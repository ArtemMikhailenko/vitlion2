'use server'

import { revalidatePath } from 'next/cache'
import { sql } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { SEO_PAGES } from '@/data/seoContent'
import { getCurrentUser } from '@/lib/session'
import { LANGS, localePath } from '@/lib/i18n'

export interface SaveState {
  ok?: boolean
  error?: string
}

/**
 * Saves the title, description and H1 for one page.
 *
 * These are the fields that decide how the page reads in search results, so
 * they are edited on their own screen rather than buried among interface
 * strings.
 */
export async function savePageSeo(_prev: SaveState, formData: FormData): Promise<SaveState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена — сохранять некуда.' }

  const slug = String(formData.get('slug') ?? '')
  if (!SEO_PAGES[slug]) return { error: 'Неизвестная страница.' }

  try {
    await db
      .insert(schema.pageSeo)
      .values(
        LANGS.map(lang => ({
          slug,
          lang,
          title: String(formData.get(`title::${lang}`) ?? '') || null,
          description: String(formData.get(`description::${lang}`) ?? '') || null,
          h1: String(formData.get(`h1::${lang}`) ?? '') || null,
          ctaLabel: String(formData.get(`ctaLabel::${lang}`) ?? '') || null,
          indexable: true,
        })),
      )
      .onConflictDoUpdate({
        target: [schema.pageSeo.slug, schema.pageSeo.lang],
        set: {
          title: sql`excluded.title`,
          description: sql`excluded.description`,
          h1: sql`excluded.h1`,
          ctaLabel: sql`excluded.cta_label`,
          updatedAt: new Date(),
        },
      })
  } catch (error) {
    console.error('[admin] savePageSeo failed', error)
    return { error: 'Не удалось сохранить. Проверьте подключение к базе.' }
  }

  for (const lang of LANGS) revalidatePath(localePath(lang, slug))

  return { ok: true }
}
