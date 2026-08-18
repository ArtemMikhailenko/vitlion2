'use server'

import { revalidatePath } from 'next/cache'
import { sql } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { findList } from '@/lib/admin/lists'
import { getCurrentUser } from '@/lib/session'
import { recordHistory } from '@/lib/admin/history'
import { LANGS } from '@/lib/i18n'

export interface ListState {
  ok?: boolean
  error?: string
}

/**
 * Saves one repeating block in both languages.
 *
 * The whole array is written rather than individual entries: items get added,
 * removed and reordered, so there is no stable identity to patch against.
 * translations.value is jsonb, so the array goes in as-is.
 */
export async function saveList(_prev: ListState, formData: FormData): Promise<ListState> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Сессия истекла. Войдите заново.' }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена — сохранять некуда.' }

  const list = findList(String(formData.get('id') ?? ''))
  if (!list) return { error: 'Неизвестный блок.' }

  let parsed: Record<string, unknown[]>
  try {
    parsed = JSON.parse(String(formData.get('value') ?? '{}'))
  } catch {
    return { error: 'Не удалось прочитать содержимое.' }
  }

  await recordHistory([list.key], user.email)

  try {
    await db
      .insert(schema.translations)
      .values(
        LANGS.map(lang => ({
          key: list.key,
          lang,
          value: Array.isArray(parsed[lang]) ? parsed[lang] : [],
        })),
      )
      .onConflictDoUpdate({
        target: [schema.translations.key, schema.translations.lang],
        set: { value: sql`excluded.value`, updatedAt: new Date() },
      })
  } catch (error) {
    console.error('[admin] saveList failed', error)
    return { error: 'Не удалось сохранить. Проверьте подключение к базе.' }
  }

  // These blocks appear on the home page and on «О нас»; both language trees
  // are refreshed rather than guessing which one the operator will check.
  revalidatePath('/', 'layout')

  return { ok: true }
}
