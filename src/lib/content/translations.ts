import 'server-only'
import { inArray } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { getDictionary, type Lang } from '@/lib/i18n'

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
