import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { SITE_URL } from '../../data/services'
import type { Language } from '../../types'

interface Props {
  lang: Language
}

export default function SEOHead({ lang }: Props) {
  const { t } = useTranslation()

  const prefix = lang === 'he' ? '' : `/${lang}`
  const canonicalUrl = `${SITE_URL}${prefix}/`
  const altUrl = (l: Language) => l === 'he' ? `${SITE_URL}/` : `${SITE_URL}/${l}/`

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
      <title>{t('meta.title')}</title>
      <meta name="description" content={t('meta.description')} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="he" href={altUrl('he')} />
      <link rel="alternate" hrefLang="ru" href={altUrl('ru')} />
      <link rel="alternate" hrefLang="x-default" href={altUrl('he')} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={t('meta.ogTitle')} />
      <meta property="og:description" content={t('meta.ogDescription')} />
      <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={lang === 'he' ? 'he_IL' : 'ru_IL'} />
      <meta property="og:site_name" content="Vitlion Group" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t('meta.ogTitle')} />
      <meta name="twitter:description" content={t('meta.ogDescription')} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.jpg`} />
      <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
    </Helmet>
  )
}
