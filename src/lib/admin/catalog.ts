import 'server-only'
import { and, eq } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { CATEGORIES } from '@/data/services'
import { findCategory, findService } from '@/lib/catalog'
import type { Lang } from '@/lib/i18n'

export interface EditableEntity {
  slug: string
  name: { he: string; ru: string }
  short: { he: string; ru: string }
  description: { he: string; ru: string }
  features: { he: string[]; ru: string[] }
  mainImage: string
  gallery: string[]
}

const EMPTY = { he: '', ru: '' }

/**
 * Current editable values for a category or model: the database row where one
 * exists, otherwise the values compiled into the site.
 *
 * Same principle as the text editor — the operator is shown what is live and
 * edits that, rather than facing blank fields.
 */
export async function loadEntity(
  kind: 'category' | 'model',
  slug: string,
): Promise<EditableEntity | null> {
  const base =
    kind === 'category'
      ? findCategory(slug)
      : CATEGORIES.flatMap(c => c.services).find(s => s.slug === slug)

  if (!base) return null

  const entity: EditableEntity = {
    slug,
    name: { ...base.name },
    short: { ...base.short },
    description: 'description' in base ? { ...base.description } : { ...EMPTY },
    features: 'features' in base ? { he: [...base.features.he], ru: [...base.features.ru] } : { he: [], ru: [] },
    mainImage: base.mainImage,
    gallery: 'gallery' in base ? [...base.gallery] : [],
  }

  const db = getDb()
  if (!db) return entity

  try {
    const rows = await db
      .select()
      .from(schema.catalogText)
      .where(and(eq(schema.catalogText.entityType, kind), eq(schema.catalogText.slug, slug)))

    for (const row of rows) {
      const lang = row.lang as Lang
      if (lang !== 'he' && lang !== 'ru') continue
      if (row.name) entity.name[lang] = row.name
      if (row.short) entity.short[lang] = row.short
      if (row.description) entity.description[lang] = row.description
      if (row.features?.length) entity.features[lang] = row.features
    }

    const table = kind === 'category' ? schema.categories : schema.models
    const [meta] = await db.select().from(table).where(eq(table.slug, slug)).limit(1)
    if (meta?.mainImage) entity.mainImage = meta.mainImage
    if (meta && 'gallery' in meta && meta.gallery?.length) entity.gallery = meta.gallery
  } catch (error) {
    console.error('[admin] catalog load failed, using bundled values', error)
  }

  return entity
}

/** The five categories with their model counts, for the index screen. */
export function listCategories() {
  return CATEGORIES.map(category => ({
    slug: category.slug,
    name: category.name,
    mainImage: category.mainImage,
    modelCount: category.services.length,
  }))
}

export function listModels(categorySlug: string) {
  return (
    findCategory(categorySlug)?.services.map(service => ({
      slug: service.slug,
      name: service.name,
      mainImage: service.mainImage,
    })) ?? []
  )
}

export function modelBelongsTo(categorySlug: string, modelSlug: string): boolean {
  return Boolean(findService(categorySlug, modelSlug))
}

export interface AdminEntry {
  slug: string
  name: { he: string; ru: string }
  mainImage: string
  published: boolean
  position: number
  modelCount?: number
}

/**
 * The catalogue as the panel needs to see it — including hidden entries.
 *
 * The public resolver drops anything unpublished, which is exactly wrong here:
 * a hidden model that cannot be found in the panel can never be brought back.
 */
async function withMeta(
  bundled: { slug: string; name: { he: string; ru: string }; mainImage: string; modelCount?: number }[],
  kind: 'category' | 'model',
): Promise<AdminEntry[]> {
  const db = getDb()
  const fallback = bundled.map((entry, i) => ({ ...entry, published: true, position: i }))
  if (!db) return fallback

  try {
    const table = kind === 'category' ? schema.categories : schema.models
    const rows = await db.select().from(table)
    const meta = new Map(rows.map(r => [r.slug, r]))

    return bundled
      .map((entry, i) => {
        const m = meta.get(entry.slug)
        return {
          ...entry,
          mainImage: m?.mainImage || entry.mainImage,
          published: m?.published ?? true,
          position: m?.position ?? i,
        }
      })
      .sort((a, b) => a.position - b.position)
  } catch (error) {
    console.error('[admin] catalogue meta query failed', error)
    return fallback
  }
}

export async function listCategoriesAdmin(): Promise<AdminEntry[]> {
  return withMeta(
    CATEGORIES.map(c => ({
      slug: c.slug,
      name: c.name,
      mainImage: c.mainImage,
      modelCount: c.services.length,
    })),
    'category',
  )
}

export async function listModelsAdmin(categorySlug: string): Promise<AdminEntry[]> {
  return withMeta(
    findCategory(categorySlug)?.services.map(s => ({
      slug: s.slug,
      name: s.name,
      mainImage: s.mainImage,
    })) ?? [],
    'model',
  )
}
