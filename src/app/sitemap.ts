import type { MetadataRoute } from 'next'
import { allServiceParams } from '@/lib/catalog'
import { LANGS, localePath, type Lang } from '@/lib/i18n'
import { SITE_URL } from '@/lib/site'

type Freq = MetadataRoute.Sitemap[number]['changeFrequency']

/**
 * Commercial pages first, at the priorities carried over from the original
 * hand-written sitemap. The homepage and the about/projects/contact pages are
 * included now that robots.ts no longer blocks them — see the note there.
 */
const PAGES: {
  path: string
  priority: Record<Lang, number>
  changeFrequency: Record<Lang, Freq>
}[] = [
  { path: 'services', priority: { he: 1.0, ru: 0.8 }, changeFrequency: { he: 'weekly', ru: 'weekly' } },
  { path: 'static-pergolas', priority: { he: 0.9, ru: 0.5 }, changeFrequency: { he: 'weekly', ru: 'monthly' } },
  { path: 'glazing', priority: { he: 0.8, ru: 0.5 }, changeFrequency: { he: 'weekly', ru: 'monthly' } },
  { path: 'electric-pergolas', priority: { he: 0.7, ru: 0.4 }, changeFrequency: { he: 'weekly', ru: 'monthly' } },
  { path: 'zip-shutters', priority: { he: 0.5, ru: 0.4 }, changeFrequency: { he: 'monthly', ru: 'monthly' } },
  { path: 'glass-roofs', priority: { he: 0.2, ru: 0.1 }, changeFrequency: { he: 'monthly', ru: 'yearly' } },

  // Homepage: the page brand queries land on, so it is worth discovering early.
  { path: '', priority: { he: 0.9, ru: 0.7 }, changeFrequency: { he: 'weekly', ru: 'weekly' } },
  { path: 'about', priority: { he: 0.4, ru: 0.3 }, changeFrequency: { he: 'yearly', ru: 'yearly' } },
  { path: 'projects', priority: { he: 0.4, ru: 0.3 }, changeFrequency: { he: 'monthly', ru: 'monthly' } },
  { path: 'contact', priority: { he: 0.4, ru: 0.3 }, changeFrequency: { he: 'yearly', ru: 'yearly' } },
]

/** One entry per language, each carrying the full hreflang alternate set. */
function entriesFor(
  path: string,
  priority: Record<Lang, number>,
  changeFrequency: Record<Lang, Freq>,
  lastModified: Date,
): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {}
  for (const lang of LANGS) languages[lang] = `${SITE_URL}${localePath(lang, path)}`

  return LANGS.map(lang => ({
    url: `${SITE_URL}${localePath(lang, path)}`,
    lastModified,
    changeFrequency: changeFrequency[lang],
    priority: priority[lang],
    alternates: { languages },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const pages = PAGES.flatMap(p =>
    entriesFor(p.path, p.priority, p.changeFrequency, lastModified),
  )

  // The 17 product models, each with its own page.
  const models = allServiceParams().flatMap(({ category, service }) =>
    entriesFor(
      `${category}/${service}`,
      { he: 0.6, ru: 0.4 },
      { he: 'monthly', ru: 'monthly' },
      lastModified,
    ),
  )

  return [...pages, ...models]
}
