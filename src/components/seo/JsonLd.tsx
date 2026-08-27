import type { FaqItem } from '@/data/geoContent'
import { servedCities } from '@/data/geoContent'
import { localePath, type Lang } from '@/lib/i18n'
import { GEO, OFFICES, OG_IMAGE, SITE_NAME, SITE_URL, WARRANTY_YEARS } from '@/lib/site'
import { getContactInfo } from '@/lib/content/contact'
import { entityModified } from '@/lib/content/freshness'

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
export default async function JsonLd({ lang, faq, breadcrumbs, product }: Props) {
  const contact = await getContactInfo()
  const socialProfiles = [contact.facebook, contact.instagram, contact.tiktok, contact.youtube].filter(Boolean)

  const business = {
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    description:
      lang === 'he'
        ? 'עיצוב, ייצור והתקנה של מבנים מאלומיניום בישראל'
        : 'Проектирование, производство и монтаж алюминиевых конструкций в Израиле',
    url: SITE_URL,
    telephone: contact.phone,
    email: contact.email,
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
    sameAs: socialProfiles,
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
    sameAs: socialProfiles,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contact.phone,
      email: contact.email,
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
    /*
     * `dateModified` carries the real edit time of this model's text, so a page
     * revised last week is distinguishable from one untouched since launch.
     * Search and AI systems weigh freshness when deciding what to cite; a date
     * that is accurate is the only kind worth emitting.
     */
    const modified = await entityModified(product.path.split('/').pop() ?? '')

    /*
     * No `offers`, and that is deliberate.
     *
     * Search Console reported five errors on these pages, and four of them came
     * from one mistake: an Offer was emitted with a currency and an availability
     * but no price, because nothing here has a list price — every structure is
     * made to measure and quoted after a site survey. An Offer without a price
     * is not a valid offer, and Google then also asked for the shipping and
     * return policies that any purchasable item must carry.
     *
     * Dropping it costs nothing. Merchant rich results need a real price, so
     * these pages were never eligible; what remains is a valid Product that
     * still tells Google and AI engines what the thing is, who makes it and
     * what it looks like.
     *
     * `category` went with it: the value was the category name in Hebrew or
     * Russian, which Search Console rejected outright.
     */
    graph.push({
      '@type': 'Product',
      '@id': `${SITE_URL}${localePath(lang, product.path)}#product`,
      name: product.name,
      description: product.description,
      image: `${SITE_URL}${product.image}`,
      url: `${SITE_URL}${localePath(lang, product.path)}`,
      /*
       * Inline rather than a reference to the Organization node: Search Console
       * rejected `{ '@id': … }` here with "недопустимый тип объекта", because the
       * Product validator does not resolve @id references for this field.
       */
      brand: { '@type': 'Brand', name: SITE_NAME },
      manufacturer: { '@id': `${SITE_URL}/#org` },
      isRelatedTo: { '@id': `${SITE_URL}/#business` },
      dateModified: modified.toISOString(),
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
