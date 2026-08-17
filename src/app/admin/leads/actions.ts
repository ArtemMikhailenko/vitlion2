'use server'

import { revalidatePath } from 'next/cache'
import { desc, eq } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { getCurrentUser } from '@/lib/session'

export interface LeadState {
  error?: string
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

/** Marks an enquiry as dealt with, or puts it back in the queue. */
export async function toggleHandled(_prev: LeadState, formData: FormData): Promise<LeadState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const id = Number(formData.get('id'))
  const handled = formData.get('handled') === 'true'

  const db = getDb()
  if (!db || !id) return { error: 'Не удалось обновить.' }

  try {
    await db.update(schema.leads).set({ handled: !handled }).where(eq(schema.leads.id, id))
  } catch (error) {
    console.error('[admin] toggleHandled failed', error)
    return { error: 'Не удалось обновить.' }
  }

  revalidatePath('/admin/leads')
  return {}
}
