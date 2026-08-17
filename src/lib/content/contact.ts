import { cache } from 'react'
import { getDb, schema } from '@/db'
import { CONTACT } from '@/data/services'

export interface ContactInfo {
  phone: string
  whatsapp: string
  email: string
  address: string
  address2: string
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
}

export const CONTACT_KEYS = Object.keys(CONTACT) as (keyof ContactInfo)[]

/**
 * Phone, addresses and social links, from the database where set.
 *
 * Same fallback rule as the rest of the content layer: without a database, or
 * for any key that has never been saved, the value compiled into the site is
 * used. A half-filled settings table therefore cannot blank the footer.
 */
export const getContactInfo = cache(async (): Promise<ContactInfo> => {
  const db = getDb()
  if (!db) return { ...CONTACT }

  try {
    const rows = await db.select().from(schema.siteSettings)
    const saved = new Map(rows.map(row => [row.key, row.value]))

    const result = { ...CONTACT } as ContactInfo
    for (const key of CONTACT_KEYS) {
      const value = saved.get(`contact.${key}`)
      if (value) result[key] = value
    }
    return result
  } catch (error) {
    console.error('[content] site settings query failed, using bundled contacts', error)
    return { ...CONTACT }
  }
})
