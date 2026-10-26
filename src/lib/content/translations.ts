import 'server-only'
import { cache } from 'react'
import { eq, inArray } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { createT, getDictionary, type Dictionary, type Lang, type TFunction } from '@/lib/i18n'

/** Reads a dot path out of a dictionary object. */
export function readPath(source: unknown, path: string): unknown {
  let node: unknown = source
  for (const part of path.split('.')) {
    if (node === null || typeof node !== 'object') return undefined
    node = (node as Record<string, unknown>)[part]
  }
  return node
}

export type TranslationMap = Record<string, Record<Lang, string>>

/**
 * Current value of each key in both languages: the database row when one
 * exists, otherwise the string compiled into the site.
 *
 * Returning the bundled value rather than an empty box matters for the editing
 * experience — the operator sees the live text and edits it, instead of facing
 * blank fields and having to retype what is already on the site.
 */
export async function getTranslations(keys: string[]): Promise<TranslationMap> {
  const result: TranslationMap = {}

  for (const key of keys) {
    result[key] = {
      he: String(readPath(getDictionary('he'), key) ?? ''),
      ru: String(readPath(getDictionary('ru'), key) ?? ''),
    }
  }

  const db = getDb()
  if (!db || !keys.length) return result

  try {
    const rows = await db
      .select()
      .from(schema.translations)
      .where(inArray(schema.translations.key, keys))

    for (const row of rows) {
      const lang = row.lang as Lang
      if (!result[row.key] || (lang !== 'he' && lang !== 'ru')) continue
      if (typeof row.value === 'string') result[row.key][lang] = row.value
    }
  } catch (error) {
    console.error('[content] translations query failed, using bundled strings', error)
  }

  return result
}

export type ListValue = Record<Lang, unknown[]>

/**
 * Current value of a list key in both languages.
 *
 * Separate from getTranslations because these values are arrays, not strings:
 * the string version stringifies whatever it finds, which would turn a list of
 * reviews into "[object Object],[object Object]".
 */
export async function getListValues(keys: string[]): Promise<Record<string, ListValue>> {
  const result: Record<string, ListValue> = {}

  for (const key of keys) {
    const he = readPath(getDictionary('he'), key)
    const ru = readPath(getDictionary('ru'), key)
    result[key] = {
      he: Array.isArray(he) ? he : [],
      ru: Array.isArray(ru) ? ru : [],
    }
  }

  const db = getDb()
  if (!db || !keys.length) return result

  try {
    const rows = await db
      .select()
      .from(schema.translations)
      .where(inArray(schema.translations.key, keys))

    for (const row of rows) {
      const lang = row.lang as Lang
      if (!result[row.key] || (lang !== 'he' && lang !== 'ru')) continue
      if (Array.isArray(row.value)) result[row.key][lang] = row.value
    }
  } catch (error) {
    console.error('[content] list query failed, using bundled lists', error)
  }

  return result
}

/**
 * The dictionary the public site renders: the bundled strings with every
 * saved edit laid over them.
 *
 * Until this existed the Texts, Lists and History screens wrote rows nothing
 * on the public side ever read — the panel showed the edit, the site kept the
 * compiled string. An edit is only applied where the bundled dictionary has a
 * value of the same kind at that path, so a row left behind by a renamed key,
 * or a list stored where a string belongs, cannot put the wrong shape into a
 * component that was written for the other one.
 */
export const getLiveDictionary = cache(async (lang: Lang): Promise<Dictionary> => {
  const bundled = getDictionary(lang)
  const db = getDb()
  if (!db) return bundled

  let rows: { key: string; value: unknown }[]
  try {
    rows = await db
      .select({ key: schema.translations.key, value: schema.translations.value })
      .from(schema.translations)
      .where(eq(schema.translations.lang, lang))
  } catch (error) {
    console.error('[content] translations query failed, using bundled strings', error)
    return bundled
  }
  if (!rows.length) return bundled

  return applyTranslations(bundled, rows)
})

/**
 * Lays saved rows over a dictionary without touching the original.
 *
 * Pure, and exported, so the rule that decides which rows apply can be tested
 * without a database.
 */
export function applyTranslations<D extends object>(
  bundled: D,
  rows: { key: string; value: unknown }[],
): D {
  const live = structuredClone(bundled) as Record<string, unknown>
  for (const { key, value } of rows) {
    const parts = key.split('.')
    const leaf = parts.pop()
    if (!leaf) continue

    let node: unknown = live
    for (const part of parts) {
      node = node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined
    }
    if (!node || typeof node !== 'object') continue

    const parent = node as Record<string, unknown>
    const current = parent[leaf]
    const sameKind =
      (typeof current === 'string' && typeof value === 'string') ||
      (Array.isArray(current) && Array.isArray(value))
    if (sameKind) parent[leaf] = value
  }
  return live as D
}

/** Server-side translator over the live dictionary. */
export async function getLiveT(lang: Lang): Promise<TFunction> {
  return createT(await getLiveDictionary(lang))
}
