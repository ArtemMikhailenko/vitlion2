import { CONTACT } from '@/data/services'

/**
 * Canonical origin. Override per environment with NEXT_PUBLIC_SITE_URL.
 *
 * NOTE: the codebase has always canonicalised to vitlion.com while the mail
 * domain (and the current Hostinger deployment) is vitlion.co.il. Which one is
 * the primary domain is a business decision — set the env var once it is made,
 * so canonical/hreflang/sitemap/JSON-LD all move together.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vitlion.com').replace(/\/+$/, '')

export const SITE_NAME = 'Vitlion Group'

export const OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
} as const

/** Physical offices, structured for schema.org PostalAddress. */
export const OFFICES = [
  {
    street: { he: 'אברהם בומה שביט 1, משרד B103', ru: 'ул. Авраам Бума Шавит, 1, офис B103' },
    locality: { he: 'ראשון לציון', ru: 'Ришон-ле-Цион' },
  },
  {
    street: { he: 'ההסתדרות 25, סיטי מול', ru: 'ул. ха-Гистадрут, 25, Сити Молл' },
    locality: { he: 'חיפה', ru: 'Хайфа' },
  },
] as const

/** Head office coordinates (Rishon LeZion). */
export const GEO = { latitude: 31.973, longitude: 34.7925 } as const

/** Written warranty, stated identically in the hero, the FAQ and JSON-LD. */
export const WARRANTY_YEARS = 10

export const SOCIAL_PROFILES = [
  CONTACT.facebook,
  CONTACT.instagram,
  CONTACT.tiktok,
  CONTACT.youtube,
].filter(Boolean)

export { CONTACT }
