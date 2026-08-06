import type { Metadata } from 'next'
import { getT, localePath, LANGS, type Lang } from './i18n'
import { OG_IMAGE, SITE_NAME, SITE_URL } from './site'

interface BuildMetadataArgs {
  lang: Lang
  /** Route path with no leading slash and no language prefix. '' = homepage. */
  path?: string
  /** Overrides the dictionary meta.title. */
  title?: string
  /** Overrides the dictionary meta.description. */
  description?: string
  /**
   * Only the 12 commercial URLs (services + 5 categories, ×2 languages) are
   * indexable — matching public/robots.txt and the sitemap. Non-indexable pages
   * deliberately emit no robots meta at all (crawling is blocked in robots.txt),
   * which preserves the behaviour the site shipped with.
   */
  indexable?: boolean
}

export function buildMetadata({
  lang,
  path = '',
  title,
  description,
  indexable = false,
}: BuildMetadataArgs): Metadata {
  const t = getT(lang)
  const canonical = `${SITE_URL}${localePath(lang, path)}`

  const languages: Record<string, string> = {}
  for (const l of LANGS) languages[l] = `${SITE_URL}${localePath(l, path)}`
  languages['x-default'] = `${SITE_URL}${localePath('he', path)}`

  const pageTitle = title ?? (t('meta.title') as string)
  const pageDescription = description ?? (t('meta.description') as string)
  const ogTitle = title ?? (t('meta.ogTitle') as string)
  const ogDescription = description ?? (t('meta.ogDescription') as string)

  return {
    metadataBase: new URL(SITE_URL),
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical, languages },
    ...(indexable ? { robots: { index: true, follow: true } } : {}),
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: SITE_NAME,
      title: ogTitle,
      description: ogDescription,
      locale: lang === 'he' ? 'he_IL' : 'ru_IL',
      images: [{ url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [OG_IMAGE.url],
    },
  }
}
