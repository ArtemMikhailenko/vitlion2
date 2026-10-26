import JsonLd from '@/components/seo/JsonLd'
import GeoSections from '@/components/sections/GeoSections'
import HomePage from '@/views/HomePage'
import ServicesPage from '@/views/ServicesPage'
import AboutPage from '@/views/AboutPage'
import ProjectsPage from '@/views/ProjectsPage'
import ContactPage from '@/views/ContactPage'
import CategoryPage from '@/views/CategoryPage'
import ServiceDetailView from '@/views/ServiceDetailView'
import ContentBlocks from '@/components/sections/ContentBlocks'
import { SERVICES_BRIEF } from '@/data/briefContent'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CTASection from '@/components/sections/CTASection'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { findCategoryLive, findServiceLive } from '@/lib/content/catalog'
import { getFaq, getModelBlocks, getPageSeo } from '@/lib/content'
import { getLiveT } from '@/lib/content/translations'
import type { Lang } from '@/lib/i18n'

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

export async function ServicesRoute({ lang }: { lang: Lang }) {
  const [t, faq, seo] = await Promise.all([getLiveT(lang), getFaq(lang), getPageSeo('services', lang)])

  return (
    <>
      {/* FAQPage markup is the highest-value schema on the site: it is what
          generative engines quote when asked about permits, wind load or
          warranty — questions no tracked competitor answers on-page. */}
      <JsonLd
        lang={lang}
        faq={faq}
        breadcrumbs={[
          { name: t('nav.home') as string },
          { name: t('nav.services') as string, path: 'services' },
        ]}
      />
      <ServicesPage
        seo={seo}
        geoSections={
          <>
            <ContentBlocks
              heading={SERVICES_BRIEF[lang].heading}
              intro={SERVICES_BRIEF[lang].intro}
              blocks={SERVICES_BRIEF[lang].blocks}
              alternate
            />
            <GeoSections lang={lang} />
          </>
        }
      />
    </>
  )
}

export async function CategoryRoute({ lang, slug }: { lang: Lang; slug: string }) {
  const t = await getLiveT(lang)
  const category = await findCategoryLive(slug)

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
      <CategoryPage lang={lang} slug={slug} />
    </>
  )
}

export async function ServiceRoute({
  lang,
  categorySlug,
  serviceSlug,
}: {
  lang: Lang
  categorySlug: string
  serviceSlug: string
}) {
  const t = await getLiveT(lang)
  const entry = await findServiceLive(categorySlug, serviceSlug)
  if (!entry) return null

  const { category, service } = entry

  return (
    <>
      <JsonLd
        lang={lang}
        product={{
          name: service.name[lang],
          description: service.description[lang],
          image: service.mainImage,
          path: `${categorySlug}/${serviceSlug}`,
          category: category.name[lang],
        }}
        breadcrumbs={[
          { name: t('nav.home') as string },
          { name: t('nav.services') as string, path: 'services' },
          { name: category.name[lang], path: categorySlug },
          { name: service.name[lang], path: `${categorySlug}/${serviceSlug}` },
        ]}
      />
      <ScrollProgress />
      <Header />
      <ServiceDetailView
        lang={lang}
        categorySlug={categorySlug}
        serviceSlug={serviceSlug}
        blocks={await getModelBlocks(serviceSlug, lang)}
      />
      <CTASection />
      <Footer />
      <WhatsAppButton />
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
