import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { SITE_URL } from '../../data/services'
import type { Language } from '../../types'

interface Props {
  lang: Language
  /** Overrides the i18n meta.title key for this specific page. */
  title?: string
  /** Overrides the i18n meta.description key for this specific page. */
  description?: string
  /** Path segment (no leading slash, no language prefix), e.g. "services" or "electric-pergolas". Omit for the homepage. */
  path?: string
  /** Set true only for pages that should be indexed (per VitlionSEO/03_Robots.md). Closed pages omit the robots meta entirely. */
  indexable?: boolean
}

export default function SEOHead({ lang, title, description, path = '', indexable = false }: Props) {
  const { t } = useTranslation()

  const prefix = lang === 'he' ? '' : `/${lang}`
  const cleanPath = path ? `/${path}` : '/'
  const canonicalUrl = `${SITE_URL}${prefix}${cleanPath}`
  const altUrl = (l: Language) => `${SITE_URL}${l === 'he' ? '' : `/${l}`}${cleanPath}`
  const pageTitle = title ?? t('meta.title')
  const pageDescription = description ?? t('meta.description')

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
        '@id': `${SITE_URL}/#business`,
        name: 'Vitlion Group',
        description: lang === 'he'
          ? 'עיצוב, ייצור והתקנה של מבנים מאלומיניום בישראל'
          : 'Проектирование, производство и монтаж алюминиевых конструкций в Израиле',
        url: SITE_URL,
        telephone: '+972-XX-XXX-XXXX',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IL',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 32.0853,
          longitude: 34.7818,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '08:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Friday',
            opens: '08:00',
            closes: '14:00',
          },
        ],
        priceRange: '₪₪₪',
        image: `${SITE_URL}/og-image.jpg`,
        logo: `${SITE_URL}/logo.svg`,
        sameAs: [
          'https://www.facebook.com/vitlion',
          'https://www.instagram.com/vitlion',
        ],
        areaServed: {
          '@type': 'Country',
          name: 'Israel',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Vitlion Group',
        inLanguage: [lang === 'he' ? 'he-IL' : 'ru-IL'],
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}${prefix}/?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#org`,
        name: 'Vitlion Group',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.svg`,
          width: 200,
          height: 60,
        },
      },
    ],
  }

  return (
    <Helmet>
      <html lang={lang === 'he' ? 'he' : 'ru'} dir={lang === 'he' ? 'rtl' : 'ltr'} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {indexable && <meta name="robots" content="index, follow" />}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="he" href={altUrl('he')} />
      <link rel="alternate" hrefLang="ru" href={altUrl('ru')} />
      <link rel="alternate" hrefLang="x-default" href={altUrl('he')} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title ?? t('meta.ogTitle')} />
      <meta property="og:description" content={description ?? t('meta.ogDescription')} />
      <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={lang === 'he' ? 'he_IL' : 'ru_IL'} />
      <meta property="og:site_name" content="Vitlion Group" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ?? t('meta.ogTitle')} />
      <meta name="twitter:description" content={description ?? t('meta.ogDescription')} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.jpg`} />
      <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
    </Helmet>
  )
}
