import type { FaqItem } from '@/data/geoContent'
import { servedCities } from '@/data/geoContent'
import { localePath, type Lang } from '@/lib/i18n'
import { CONTACT, GEO, OFFICES, OG_IMAGE, SITE_NAME, SITE_URL, SOCIAL_PROFILES, WARRANTY_YEARS } from '@/lib/site'

interface Crumb {
  name: string
  /** Path with no leading slash and no language prefix. */
  path?: string
}

interface ProductInfo {
  name: string
  description: string
  image: string
  /** Path with no leading slash and no language prefix. */
  path: string
  category: string
}

interface Props {
  lang: Lang
  /** Emits a FAQPage node — the highest-value schema for AI citation here. */
  faq?: FaqItem[]
  breadcrumbs?: Crumb[]
  /** Emitted on the per-model pages. */
  product?: ProductInfo
}

/**
 * Structured data for the page, rendered server-side.
 *
 * Fixes carried over from the audit of the old SEOHead: the telephone was the
 * literal placeholder "+972-XX-XXX-XXXX" and `sameAs` pointed at two social
 * profiles that do not exist. Both now come from the single CONTACT source.
 */
export default function JsonLd({ lang, faq, breadcrumbs, product }: Props) {
  const business = {
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    description:
      lang === 'he'
        ? 'עיצוב, ייצור והתקנה של מבנים מאלומיניום בישראל'
        : 'Проектирование, производство и монтаж алюминиевых конструкций в Израиле',
    url: SITE_URL,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: OFFICES.map(office => ({
      '@type': 'PostalAddress',
      streetAddress: office.street[lang],
      addressLocality: office.locality[lang],
      addressCountry: 'IL',
    })),
    geo: { '@type': 'GeoCoordinates', latitude: GEO.latitude, longitude: GEO.longitude },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:00',
        closes: '18:00',
      },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:00', closes: '14:00' },
    ],
    priceRange: '₪₪₪',
    image: `${SITE_URL}${OG_IMAGE.url}`,
    logo: `${SITE_URL}/logo.svg`,
    sameAs: SOCIAL_PROFILES,
    // Country plus the concrete cities from the GEO content block, so the
    // service-area claim on the page and in the markup say the same thing.
    areaServed: [
      { '@type': 'Country', name: 'Israel' },
      ...servedCities(lang).map(city => ({ '@type': 'City', name: city })),
    ],
    warranty: {
      '@type': 'WarrantyPromise',
      durationOfWarranty: { '@type': 'QuantitativeValue', value: WARRANTY_YEARS, unitCode: 'ANN' },
    },
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: lang === 'he' ? 'he-IL' : 'ru-IL',
    publisher: { '@id': `${SITE_URL}/#org` },
  }

  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#org`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg`, width: 200, height: 60 },
    sameAs: SOCIAL_PROFILES,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT.phone,
      email: CONTACT.email,
      contactType: 'sales',
      areaServed: 'IL',
      availableLanguage: ['he', 'ru'],
    },
  }

  const graph: Record<string, unknown>[] = [business, website, organization]

  if (faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE_URL}${localePath(lang)}#faq`,
      mainEntity: faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  }

  if (product) {
    graph.push({
      '@type': 'Product',
      '@id': `${SITE_URL}${localePath(lang, product.path)}#product`,
      name: product.name,
      description: product.description,
      image: `${SITE_URL}${product.image}`,
      category: product.category,
      brand: { '@id': `${SITE_URL}/#org` },
      // Everything is made to measure, so there is no list price to publish —
      // the free on-site survey is the offer.
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'ILS',
        url: `${SITE_URL}${localePath(lang, product.path)}`,
        seller: { '@id': `${SITE_URL}/#business` },
      },
      warranty: {
        '@type': 'WarrantyPromise',
        durationOfWarranty: { '@type': 'QuantitativeValue', value: WARRANTY_YEARS, unitCode: 'ANN' },
      },
    })
  }

  if (breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${SITE_URL}${localePath(lang, crumb.path)}`,
      })),
    })
  }

  const payload = { '@context': 'https://schema.org', '@graph': graph }

  return (
    <script
      type="application/ld+json"
      // Structured data is build-time content from our own modules, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
