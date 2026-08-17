'use server'

import { revalidatePath } from 'next/cache'
import { sql } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { CONTACT_KEYS } from '@/lib/content/contact'
import { getCurrentUser } from '@/lib/session'

export interface ContactState {
  ok?: boolean
  error?: string
}

/**
 * Saves the contact details.
 *
 * Every key is written, including the ones left unchanged, so the saved row is
 * always the complete picture; a key saved as an empty string still falls back
 * to the bundled value on read, which is deliberate — clearing the phone number
 * by accident should not leave the site with no phone number.
 */
export async function saveContacts(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена — сохранять некуда.' }

  const rows = CONTACT_KEYS.map(key => ({
    key: `contact.${key}`,
    value: String(formData.get(key) ?? '').trim(),
  }))

  try {
    await db
      .insert(schema.siteSettings)
      .values(rows)
      .onConflictDoUpdate({
        target: schema.siteSettings.key,
        set: { value: sql`excluded.value`, updatedAt: new Date() },
      })
  } catch (error) {
    console.error('[admin] saveContacts failed', error)
    return { error: 'Не удалось сохранить. Проверьте подключение к базе.' }
  }

  // Contacts appear in the footer and the WhatsApp button of every page, so
  // the whole tree is revalidated rather than a list of paths.
  revalidatePath('/', 'layout')

  return { ok: true }
}
