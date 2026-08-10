import Link from 'next/link'
import ContentBlocks from '../components/sections/ContentBlocks'
import { getCategoryBrief } from '../data/briefContent'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import CTASection from '../components/sections/CTASection'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import ScrollProgress from '../components/ui/ScrollProgress'
import SeoContentSection from '../components/seo/SeoContentSection'
import { CONTACT } from '../data/services'
import { SEO_PAGES } from '../data/seoContent'
import { findCategory } from '@/lib/catalog'
import { localePath, type Lang } from '@/lib/i18n'

interface Props {
  lang: Lang
  slug: string
}

/**
 * Category page — now a Server Component.
 *
 * The model cards used to be <button>s that opened a modal, which meant the 17
 * models had no URLs and crawlers could not reach any of that content. They are
 * plain links to the per-model pages now, so the catalog is fully crawlable and
 * each model is shareable.
 */
export default function CategoryPage({ lang, slug }: Props) {
  const category = findCategory(slug)
  const seo = SEO_PAGES[slug]?.[lang]

  // The route only renders known slugs (generateStaticParams + dynamicParams:false).
  if (!category || !seo) return null

  const waHref = `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}`
  const briefBlocks = getCategoryBrief(slug, lang)

  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main" className="pt-20">
        <section className="py-16 lg:py-20 bg-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
              {category.name[lang]}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5">{seo.h1}</h1>
            <p className="text-ink-mid text-lg max-w-2xl mx-auto">{category.short[lang]}</p>
          </div>
        </section>

        <section className="pb-16 lg:pb-20 bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {category.services.map(service => (
                <Link
                  key={service.id}
                  href={`${localePath(lang, slug)}/${service.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl text-start bg-dark-card border border-dark-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative h-36 sm:h-48 overflow-hidden">
                    <img
                      src={service.mainImage}
                      alt={service.name[lang]}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="px-3 py-3 sm:px-4 sm:py-4">
                    <p className="text-sm font-semibold text-ink leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
                      {service.name[lang]}
                    </p>
                    <p className="text-xs text-ink-mid mt-1 leading-snug line-clamp-2">
                      {service.short[lang]}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Body copy. The brief supersedes seoContent's h2Blocks/seoText — they
            are an earlier pass of the same text, so rendering both would repeat
            every section on the page. Older pages without brief copy still fall
            back to the original blocks. */}
        {briefBlocks.length ? (
          <ContentBlocks blocks={briefBlocks} alternate>
            <div className="mt-12 text-center">
              <a
                href={waHref}
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 font-bold text-dark transition-transform hover:scale-105"
              >
                {seo.ctaLabel}
              </a>
            </div>
          </ContentBlocks>
        ) : (
          <SeoContentSection
            h2Blocks={seo.h2Blocks}
            seoText={seo.seoText}
            ctaLabel={seo.ctaLabel}
            ctaHref={waHref}
          />
        )}
      </main>

      <CTASection />
      <Footer />
      <WhatsAppButton />
    </>
  )
}
