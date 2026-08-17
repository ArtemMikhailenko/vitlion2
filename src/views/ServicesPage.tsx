'use client'

import type { ReactNode } from 'react'
import { useTranslation, useLanguage } from '@/lib/i18n/client'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Services from '../components/sections/Services'
import CTASection from '../components/sections/CTASection'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import ScrollProgress from '../components/ui/ScrollProgress'
import SeoContentSection from '../components/seo/SeoContentSection'
import { digits, useContact } from '@/lib/contact/client'
import { SEO_PAGES } from '../data/seoContent'

interface Props {
  /**
   * Server-rendered GEO blocks (service area, lead times, cost, FAQ), passed in
   * from the route segment so they stay a Server Component even though this
   * page is interactive.
   */
  geoSections?: ReactNode
}

export default function ServicesPage({ geoSections }: Props) {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const seo = SEO_PAGES.services[lang]
  const waHref = `https://wa.me/${digits(useContact().whatsapp)}`

  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main" className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
            {t('services.badge')}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-5">{seo.h1}</h1>
          <p className="text-ink-mid text-lg max-w-2xl mx-auto">{t('services.subtitle')}</p>
        </div>
        <Services hideHeader />
        <SeoContentSection
          h2Blocks={seo.h2Blocks}
          seoText={seo.seoText}
          ctaLabel={seo.ctaLabel}
          ctaHref={waHref}
        />
        {geoSections}
      </main>
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </>
  )
}
