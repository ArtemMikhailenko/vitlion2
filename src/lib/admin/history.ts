import 'server-only'
import { and, desc, eq } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { getDictionary, type Lang } from '@/lib/i18n'
import { readPath } from '@/lib/content/translations'

/**
 * Version history for edited text.
 *
 * Only the translation-backed screens are recorded — the home page fields and
 * the repeating blocks. Those are the ones edited casually and often, where a
 * paragraph gets replaced and the old wording is wanted back. Catalogue text,
 * FAQ and contacts are edited deliberately and rarely; they are not covered,
 * and the panel says so rather than implying a safety net that is not there.
 */

export interface HistoryEntry {
  id: number
  key: string
  lang: string
  value: unknown
  author: string | null
  createdAt: Date
}

/**
 * Records what a key looked like *before* it was overwritten.
 *
 * Snapshotting the previous value rather than the new one means the very first
 * save captures the text the site shipped with — otherwise the original wording
 * would be the one version never stored.
 */
export async function recordHistory(keys: string[], author: string | null): Promise<void> {
  const db = getDb()
  if (!db || !keys.length) return

  try {
    const rows: {
      key: string
      lang: string
      value: unknown
      author: string | null
    }[] = []

    const existing = await db.select().from(schema.translations)
    const saved = new Map(existing.map(r => [`${r.key}:${r.lang}`, r.value]))

    for (const key of keys) {
      for (const lang of ['he', 'ru'] as Lang[]) {
        const previous = saved.get(`${key}:${lang}`) ?? readPath(getDictionary(lang), key)
        if (previous === undefined) continue
        rows.push({ key, lang, value: previous, author })
      }
    }

    if (rows.length) await db.insert(schema.contentHistory).values(rows)
  } catch (error) {
    // History is a convenience; failing to record it must never block a save.
    console.error('[admin] recordHistory failed', error)
  }
}

export async function listHistory(limit = 80): Promise<HistoryEntry[]> {
  const db = getDb()
  if (!db) return []
  try {
    return await db
      .select()
      .from(schema.contentHistory)
      .orderBy(desc(schema.contentHistory.createdAt))
      .limit(limit)
  } catch (error) {
    console.error('[admin] history list failed', error)
    return []
  }
}

export async function getHistoryEntry(id: number): Promise<HistoryEntry | null> {
  const db = getDb()
  if (!db) return null
  try {
    const [row] = await db
      .select()
      .from(schema.contentHistory)
      .where(eq(schema.contentHistory.id, id))
      .limit(1)
    return row ?? null
  } catch (error) {
    console.error('[admin] history entry query failed', error)
    return null
  }
}

/** The value a key currently has, for showing next to the old one. */
export async function currentValue(key: string, lang: string): Promise<unknown> {
  const db = getDb()
  const bundled = readPath(getDictionary(lang === 'ru' ? 'ru' : 'he'), key)
  if (!db) return bundled

  try {
    const [row] = await db
      .select()
      .from(schema.translations)
      .where(and(eq(schema.translations.key, key), eq(schema.translations.lang, lang)))
      .limit(1)
    return row ? row.value : bundled
  } catch {
    return bundled
  }
}
