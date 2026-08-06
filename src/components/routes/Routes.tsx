import JsonLd from '@/components/seo/JsonLd'
import GeoSections from '@/components/sections/GeoSections'
import HomePage from '@/views/HomePage'
import ServicesPage from '@/views/ServicesPage'
import AboutPage from '@/views/AboutPage'
import ProjectsPage from '@/views/ProjectsPage'
import ContactPage from '@/views/ContactPage'
import CategoryPage from '@/views/CategoryPage'
import { getGeoContent } from '@/data/geoContent'
import { CATEGORIES } from '@/data/services'
import { getT, type Lang } from '@/lib/i18n'

/**
 * Server-side wrappers shared by the Hebrew and Russian route trees.
 * They emit the structured data and then render the (client) page view, so
 * every route file stays a few lines long and the two languages cannot drift.
 */

export function HomeRoute({ lang }: { lang: Lang }) {
  return (
    <>
      <JsonLd lang={lang} />
      <HomePage />
    </>
  )
}

export function ServicesRoute({ lang }: { lang: Lang }) {
  const t = getT(lang)
  const { faq } = getGeoContent(lang)

  return (
    <>
      {/* FAQPage markup is the highest-value schema on the site: it is what
          generative engines quote when asked about permits, wind load or
          warranty — questions no tracked competitor answers on-page. */}
      <JsonLd
        lang={lang}
        faq={faq.items}
        breadcrumbs={[
          { name: t('nav.home') as string },
          { name: t('nav.services') as string, path: 'services' },
        ]}
      />
      <ServicesPage geoSections={<GeoSections lang={lang} />} />
    </>
  )
}

export function CategoryRoute({ lang, slug }: { lang: Lang; slug: string }) {
  const t = getT(lang)
  const category = CATEGORIES.find(c => c.slug === slug)

  return (
    <>
      <JsonLd
        lang={lang}
        breadcrumbs={[
          { name: t('nav.home') as string },
          { name: t('nav.services') as string, path: 'services' },
          ...(category ? [{ name: category.name[lang], path: slug }] : []),
        ]}
      />
      <CategoryPage slug={slug} />
    </>
  )
}

export function AboutRoute({ lang }: { lang: Lang }) {
  return (
    <>
      <JsonLd lang={lang} />
      <AboutPage />
    </>
  )
}

export function ProjectsRoute({ lang }: { lang: Lang }) {
  return (
    <>
      <JsonLd lang={lang} />
      <ProjectsPage />
    </>
  )
}

export function ContactRoute({ lang }: { lang: Lang }) {
  return (
    <>
      <JsonLd lang={lang} />
      <ContactPage />
    </>
  )
}
