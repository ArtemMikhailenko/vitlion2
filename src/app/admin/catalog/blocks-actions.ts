'use server'

import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import type { ContentBlock } from '@/components/sections/ContentBlocks'
import { getCurrentUser } from '@/lib/session'
import { LANGS, localePath, type Lang } from '@/lib/i18n'

export interface BlocksState {
  ok?: boolean
  error?: string
}

/** Drops empty strings so a stray blank line does not become an empty paragraph. */
function clean(list: unknown): string[] {
  if (!Array.isArray(list)) return []
  return list.map(v => String(v).trim()).filter(Boolean)
}

/**
 * Replaces the body text of one category or model page, in both languages.
 *
 * Rows are deleted and re-inserted rather than updated in place: the operator
 * can add, remove and reorder blocks, so the positions after a save need not
 * line up with the positions before it. Rewriting the whole owner keeps that
 * simple and cannot leave an orphaned block behind.
 */
export async function saveBlocks(_prev: BlocksState, formData: FormData): Promise<BlocksState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена — сохранять некуда.' }

  const ownerType = String(formData.get('ownerType') ?? '')
  const ownerSlug = String(formData.get('ownerSlug') ?? '')
  const categorySlug = String(formData.get('categorySlug') ?? '')

  if (ownerType !== 'category' && ownerType !== 'model') return { error: 'Неизвестный раздел.' }
  if (!ownerSlug) return { error: 'Не указана страница.' }

  let parsed: Record<Lang, ContentBlock[]>
  try {
    parsed = JSON.parse(String(formData.get('blocks') ?? '{}'))
  } catch {
    return { error: 'Не удалось прочитать текст блоков.' }
  }

  const rows = LANGS.flatMap(lang =>
    (parsed[lang] ?? []).map((block, position) => ({
      ownerType,
      ownerSlug,
      lang,
      position,
      heading: block.heading?.trim() || null,
      paragraphs: clean(block.paragraphs),
      items: clean(block.items),
      outro: clean(block.outro),
    })),
  ).filter(row => row.heading || row.paragraphs.length || row.items.length || row.outro.length)

  try {
    await db
      .delete(schema.contentBlocks)
      .where(
        and(
          eq(schema.contentBlocks.ownerType, ownerType),
          eq(schema.contentBlocks.ownerSlug, ownerSlug),
        ),
      )

    if (rows.length) await db.insert(schema.contentBlocks).values(rows)
  } catch (error) {
    console.error('[admin] saveBlocks failed', error)
    return { error: 'Не удалось сохранить. Проверьте подключение к базе.' }
  }

  const path = ownerType === 'category' ? ownerSlug : `${categorySlug}/${ownerSlug}`
  for (const lang of LANGS) revalidatePath(localePath(lang, path))

  return { ok: true }
}
