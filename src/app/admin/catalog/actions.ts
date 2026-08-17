'use server'

import { revalidatePath } from 'next/cache'
import { sql } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { getCurrentUser } from '@/lib/session'
import { modelBelongsTo } from '@/lib/admin/catalog'
import { findCategory } from '@/lib/catalog'
import { localePath, LANGS } from '@/lib/i18n'

export interface SaveState {
  ok?: boolean
  error?: string
}

const lines = (value: FormDataEntryValue | null): string[] =>
  String(value ?? '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

/**
 * Saves a category or model.
 *
 * The slug is validated against the real catalogue rather than trusted from the
 * form, so a crafted request cannot create rows for entities that do not exist.
 */
export async function saveEntity(_prev: SaveState, formData: FormData): Promise<SaveState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена — сохранять некуда.' }

  const kind = String(formData.get('kind') ?? '')
  const slug = String(formData.get('slug') ?? '')
  const categorySlug = String(formData.get('categorySlug') ?? '')

  const valid =
    kind === 'category' ? Boolean(findCategory(slug)) : modelBelongsTo(categorySlug, slug)
  if (!valid) return { error: 'Неизвестный раздел каталога.' }

  try {
    await db
      .insert(schema.catalogText)
      .values(
        LANGS.map(lang => ({
          entityType: kind,
          slug,
          lang,
          name: String(formData.get(`name::${lang}`) ?? '') || null,
          short: String(formData.get(`short::${lang}`) ?? '') || null,
          description: String(formData.get(`description::${lang}`) ?? '') || null,
          features: lines(formData.get(`features::${lang}`)),
        })),
      )
      .onConflictDoUpdate({
        target: [schema.catalogText.entityType, schema.catalogText.slug, schema.catalogText.lang],
        set: {
          name: sql`excluded.name`,
          short: sql`excluded.short`,
          description: sql`excluded.description`,
          features: sql`excluded.features`,
          updatedAt: new Date(),
        },
      })

    const mainImage = String(formData.get('mainImage') ?? '').trim() || null
    const gallery = lines(formData.get('gallery'))

    if (kind === 'category') {
      await db
        .insert(schema.categories)
        .values({ slug, mainImage })
        .onConflictDoUpdate({
          target: schema.categories.slug,
          set: { mainImage: sql`excluded.main_image`, updatedAt: new Date() },
        })
    } else {
      await db
        .insert(schema.models)
        .values({ slug, categorySlug, mainImage, gallery })
        .onConflictDoUpdate({
          target: schema.models.slug,
          set: {
            mainImage: sql`excluded.main_image`,
            gallery: sql`excluded.gallery`,
            updatedAt: new Date(),
          },
        })
    }
  } catch (error) {
    console.error('[admin] saveEntity failed', error)
    return { error: 'Не удалось сохранить. Проверьте подключение к базе.' }
  }

  // Refresh only what this entity actually appears on: its own page in both
  // languages, plus the category page that lists it.
  for (const lang of LANGS) {
    if (kind === 'category') {
      revalidatePath(localePath(lang, slug))
    } else {
      revalidatePath(`${localePath(lang, categorySlug)}/${slug}`)
      revalidatePath(localePath(lang, categorySlug))
    }
    revalidatePath(localePath(lang, 'services'))
  }

  return { ok: true }
}
