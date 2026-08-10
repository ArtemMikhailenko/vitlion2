import type { MetadataRoute } from 'next'
import { allServiceParams } from '@/lib/catalog'
import { LANGS, localePath, type Lang } from '@/lib/i18n'
import { SITE_URL } from '@/lib/site'

/**
 * Only the 12 indexable commercial URLs, matching robots.ts exactly.
 * Priorities/frequencies preserved from the previous hand-written sitemap.xml.
 */
const ENTRIES: {
  path: string
  priority: Record<Lang, number>
  changeFrequency: Record<Lang, MetadataRoute.Sitemap[number]['changeFrequency']>
}[] = [
  { path: 'services', priority: { he: 1.0, ru: 0.8 }, changeFrequency: { he: 'weekly', ru: 'weekly' } },
  { path: 'static-pergolas', priority: { he: 0.9, ru: 0.5 }, changeFrequency: { he: 'weekly', ru: 'monthly' } },
  { path: 'glazing', priority: { he: 0.8, ru: 0.5 }, changeFrequency: { he: 'weekly', ru: 'monthly' } },
  { path: 'electric-pergolas', priority: { he: 0.7, ru: 0.4 }, changeFrequency: { he: 'weekly', ru: 'monthly' } },
  { path: 'zip-shutters', priority: { he: 0.5, ru: 0.4 }, changeFrequency: { he: 'monthly', ru: 'monthly' } },
  { path: 'glass-roofs', priority: { he: 0.2, ru: 0.1 }, changeFrequency: { he: 'monthly', ru: 'yearly' } },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const categoryUrls = ENTRIES.flatMap(entry => {
    const languages: Record<string, string> = {}
    for (const lang of LANGS) languages[lang] = `${SITE_URL}${localePath(lang, entry.path)}`

    return LANGS.map(lang => ({
      url: `${SITE_URL}${localePath(lang, entry.path)}`,
      lastModified,
      changeFrequency: entry.changeFrequency[lang],
      priority: entry.priority[lang],
      alternates: { languages },
    }))
  })

  // The 17 product models, now that each has its own page.
  const serviceUrls = allServiceParams().flatMap(({ category, service }) => {
    const path = `${category}/${service}`
    const languages: Record<string, string> = {}
    for (const lang of LANGS) languages[lang] = `${SITE_URL}${localePath(lang, path)}`

    return LANGS.map(lang => ({
      url: `${SITE_URL}${localePath(lang, path)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: lang === 'he' ? 0.6 : 0.4,
      alternates: { languages },
    }))
  })

  return [...categoryUrls, ...serviceUrls]
}
