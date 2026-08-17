'use server'

import { revalidatePath } from 'next/cache'
import { desc, eq } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { OPEN_STATUSES, isLeadStatus } from '@/lib/admin/leadStatus'
import { getCurrentUser } from '@/lib/session'

export interface LeadState {
  error?: string
  ok?: boolean
}

export async function listLeads() {
  const db = getDb()
  if (!db) return []
  try {
    return await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(500)
  } catch (error) {
    console.error('[admin] leads list failed', error)
    return []
  }
}

/**
 * Moves an enquiry to another stage.
 *
 * `handled` is kept in step rather than left to drift: it drives the navigation
 * badge and the dashboard, both of which ask "does this still need me", and the
 * answer is exactly "the stage is not new or callback".
 */
export async function setStatus(_prev: LeadState, formData: FormData): Promise<LeadState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const id = Number(formData.get('id'))
  const status = String(formData.get('status') ?? '')
  if (!id || !isLeadStatus(status)) return { error: 'Не удалось обновить.' }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена.' }

  try {
    await db
      .update(schema.leads)
      .set({ status, handled: !OPEN_STATUSES.includes(status) })
      .where(eq(schema.leads.id, id))
  } catch (error) {
    console.error('[admin] setStatus failed', error)
    return { error: 'Не удалось обновить. Возможно, не выполнен db/leads-status.sql.' }
  }

  revalidatePath('/admin/leads')
  revalidatePath('/admin')
  return { ok: true }
}

export async function saveNote(_prev: LeadState, formData: FormData): Promise<LeadState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const id = Number(formData.get('id'))
  if (!id) return { error: 'Не удалось сохранить.' }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена.' }

  try {
    await db
      .update(schema.leads)
      .set({ note: String(formData.get('note') ?? '').trim().slice(0, 2000) || null })
      .where(eq(schema.leads.id, id))
  } catch (error) {
    console.error('[admin] saveNote failed', error)
    return { error: 'Не удалось сохранить заметку.' }
  }

  revalidatePath('/admin/leads')
  return { ok: true }
}
