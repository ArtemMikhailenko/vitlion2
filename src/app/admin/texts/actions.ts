'use server'

import { revalidatePath } from 'next/cache'
import { sql } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { getCurrentUser } from '@/lib/session'
import { ALL_FIELD_KEYS } from '@/lib/admin/fields'

export interface SaveState {
  ok?: boolean
  error?: string
  savedAt?: number
}

export async function saveTexts(_prev: SaveState, formData: FormData): Promise<SaveState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const db = getDb()
  if (!db) {
    return { error: 'База данных не подключена — сохранять некуда. Задайте DATABASE_URL.' }
  }

  // Only keys from the manifest are accepted, so a crafted form cannot write
  // arbitrary rows into the translations table.
  const rows: { key: string; lang: string; value: string }[] = []
  for (const key of ALL_FIELD_KEYS) {
    for (const lang of ['he', 'ru'] as const) {
      const raw = formData.get(`${key}::${lang}`)
      if (raw === null) continue
      rows.push({ key, lang, value: String(raw) })
    }
  }

  if (!rows.length) return { error: 'Нечего сохранять.' }

  try {
    await db
      .insert(schema.translations)
      .values(rows.map(r => ({ key: r.key, lang: r.lang, value: r.value })))
      .onConflictDoUpdate({
        target: [schema.translations.key, schema.translations.lang],
        set: { value: sql`excluded.value`, updatedAt: new Date() },
      })
  } catch (error) {
    console.error('[admin] saveTexts failed', error)
    return { error: 'Не удалось сохранить. Проверьте подключение к базе.' }
  }

  // These strings appear in the header, footer and hero of every page, so the
  // whole tree is refreshed rather than guessing at a subset.
  revalidatePath('/', 'layout')

  return { ok: true, savedAt: Date.now() }
}
