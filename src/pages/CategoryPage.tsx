import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import CTASection from '../components/sections/CTASection'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import ScrollProgress from '../components/ui/ScrollProgress'
import SEOHead from '../components/seo/SEOHead'
import SeoContentSection from '../components/seo/SeoContentSection'
import ServiceDetailModal from '../components/ui/ServiceDetailModal'
import { CATEGORIES, CONTACT } from '../data/services'
import { SEO_PAGES } from '../data/seoContent'
import { useLanguage } from '../hooks/useLanguage'
import type { ServiceItem } from '../types'

interface Props {
  slug: string
}

export default function CategoryPage({ slug }: Props) {
  const { i18n } = useTranslation()
  const { lang, switchLanguage } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const displayLang = i18n.resolvedLanguage === 'ru' ? 'ru' : 'he'
  const category = CATEGORIES.find(c => c.slug === slug)
  const seo = SEO_PAGES[slug]?.[displayLang]
  const [activeService, setActiveService] = useState<ServiceItem | null>(null)

  useEffect(() => {
    const openSlug = (location.state as { openService?: string } | null)?.openService
    if (openSlug && category) {
      const svc = category.services.find(s => s.slug === openSlug)
      if (svc) setActiveService(svc)
      navigate(location.pathname, { replace: true, state: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!category || !seo) return null

  const waHref = `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}`

  return (
    <>
      <ScrollProgress />
      <SEOHead lang={lang} title={seo.title} description={seo.description} path={slug} indexable />
      <Header lang={lang} onSwitchLang={switchLanguage} />
      <main id="main" className="pt-20">
        <section className="py-16 lg:py-20 bg-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
              {category.name[displayLang]}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5">{seo.h1}</h1>
            <p className="text-ink-mid text-lg max-w-2xl mx-auto">{category.short[displayLang]}</p>
          </div>
        </section>

        <section className="pb-16 lg:pb-20 bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {category.services.map(service => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActiveService(service)}
                  className="group flex flex-col overflow-hidden rounded-2xl text-start bg-dark-card border border-dark-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative h-36 sm:h-48 overflow-hidden">
                    <img
                      src={service.mainImage}
                      alt={service.name[displayLang]}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                  <div className="px-3 py-3 sm:px-4 sm:py-4">
                    <p className="text-sm font-semibold text-ink leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
                      {service.name[displayLang]}
                    </p>
                    <p className="text-xs text-ink-mid mt-1 leading-snug line-clamp-2">
                      {service.short[displayLang]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <SeoContentSection h2Blocks={seo.h2Blocks} seoText={seo.seoText} ctaLabel={seo.ctaLabel} ctaHref={waHref} />
      </main>

      <ServiceDetailModal
        service={activeService}
        onClose={() => setActiveService(null)}
        categoryServices={category.services}
        onSelectService={setActiveService}
        categoryName={category.name[displayLang]}
      />

      <CTASection />
      <Footer />
      <WhatsAppButton />
    </>
  )
}
