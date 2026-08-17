import { cache } from 'react'
import { getDb, schema } from '@/db'
import { CATEGORIES } from '@/data/services'
import type { ServiceCategory, ServiceItem } from '@/types'

/**
 * The catalogue the site actually renders.
 *
 * Every public page used to read the bundled CATEGORIES constant directly,
 * while the panel wrote its edits to catalog_text, categories and models. The
 * two never met: a name changed in the panel was stored, read back into the
 * form — so the edit looked applied — and the live page kept showing the
 * compiled-in text. This is the join that was missing.
 *
 * Both languages are resolved at once and the result keeps the exact shape of
 * the bundled data, so consumers do not care where a value came from.
 *
 * Unpublished entries are dropped and the rest are ordered by `position`, which
 * is what makes hiding and reordering from the panel take effect everywhere —
 * menus, category pages, the sitemap — rather than in one place someone
 * remembered to update.
 */
export const getCatalog = cache(async (): Promise<ServiceCategory[]> => {
  const db = getDb()
  if (!db) return CATEGORIES

  try {
    const [texts, categoryMeta, modelMeta] = await Promise.all([
      db.select().from(schema.catalogText),
      db.select().from(schema.categories),
      db.select().from(schema.models),
    ])

    const textByKey = new Map<string, typeof texts>()
    for (const row of texts) {
      const key = `${row.entityType}:${row.slug}`
      const list = textByKey.get(key)
      if (list) list.push(row)
      else textByKey.set(key, [row])
    }

    const catMeta = new Map(categoryMeta.map(m => [m.slug, m]))
    const modMeta = new Map(modelMeta.map(m => [m.slug, m]))

    const applyText = <T extends ServiceCategory | ServiceItem>(
      entity: T,
      kind: 'category' | 'model',
    ): T => {
      const rows = textByKey.get(`${kind}:${entity.slug}`)
      if (!rows?.length) return entity

      const next: T = {
        ...entity,
        name: { ...entity.name },
        short: { ...entity.short },
      }
      if ('description' in next) next.description = { ...next.description }
      if ('features' in next) next.features = { he: [...next.features.he], ru: [...next.features.ru] }

      for (const row of rows) {
        if (row.lang !== 'he' && row.lang !== 'ru') continue
        const lang = row.lang
        if (row.name) next.name[lang] = row.name
        if (row.short) next.short[lang] = row.short
        if (row.description && 'description' in next) next.description[lang] = row.description
        if (row.features?.length && 'features' in next) next.features[lang] = row.features
      }

      return next
    }

    const models = (category: ServiceCategory): ServiceItem[] =>
      category.services
        .map(service => {
          const meta = modMeta.get(service.slug)
          const resolved = applyText(service, 'model')
          return {
            ...resolved,
            mainImage: meta?.mainImage || resolved.mainImage,
            gallery: meta?.gallery?.length ? meta.gallery : resolved.gallery,
            __position: meta?.position ?? 0,
            __published: meta?.published ?? true,
          }
        })
        .filter(s => s.__published)
        .sort((a, b) => a.__position - b.__position)
        .map(({ __position, __published, ...service }) => service)

    return CATEGORIES.map(category => {
      const meta = catMeta.get(category.slug)
      const resolved = applyText(category, 'category')
      return {
        ...resolved,
        mainImage: meta?.mainImage || resolved.mainImage,
        services: models(category),
        __position: meta?.position ?? 0,
        __published: meta?.published ?? true,
      }
    })
      .filter(c => c.__published)
      .sort((a, b) => a.__position - b.__position)
      .map(({ __position, __published, ...category }) => category)
  } catch (error) {
    // A database problem must never empty the catalogue — that would blank the
    // main navigation and every category page at once.
    console.error('[content] catalogue query failed, using bundled catalogue', error)
    return CATEGORIES
  }
})

export async function findCategoryLive(slug: string): Promise<ServiceCategory | undefined> {
  return (await getCatalog()).find(c => c.slug === slug)
}

export async function findServiceLive(
  categorySlug: string,
  serviceSlug: string,
): Promise<{ category: ServiceCategory; service: ServiceItem } | undefined> {
  const category = await findCategoryLive(categorySlug)
  const service = category?.services.find(s => s.slug === serviceSlug)
  return category && service ? { category, service } : undefined
}
