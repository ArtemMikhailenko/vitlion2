'use server'

import { revalidatePath } from 'next/cache'
import { sql } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { getHistoryEntry, recordHistory } from '@/lib/admin/history'
import { getCurrentUser } from '@/lib/session'

export interface RestoreState {
  ok?: boolean
  error?: string
}

/**
 * Puts one old value back.
 *
 * The current value is snapshotted first, so restoring is itself undoable — an
 * "откат" that cannot be rolled back would be a worse trap than no undo at all.
 */
export async function restoreVersion(
  _prev: RestoreState,
  formData: FormData,
): Promise<RestoreState> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Сессия истекла. Войдите заново.' }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена.' }

  const id = Number(formData.get('id'))
  if (!id) return { error: 'Не удалось восстановить.' }

  const entry = await getHistoryEntry(id)
  if (!entry) return { error: 'Эта версия больше не найдена.' }

  await recordHistory([entry.key], user.email)

  try {
    await db
      .insert(schema.translations)
      .values({ key: entry.key, lang: entry.lang, value: entry.value })
      .onConflictDoUpdate({
        target: [schema.translations.key, schema.translations.lang],
        set: { value: sql`excluded.value`, updatedAt: new Date() },
      })
  } catch (error) {
    console.error('[admin] restoreVersion failed', error)
    return { error: 'Не удалось восстановить.' }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/history')
  return { ok: true }
}
