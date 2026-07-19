import { useTranslation } from 'react-i18next'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Services from '../components/sections/Services'
import CTASection from '../components/sections/CTASection'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import ScrollProgress from '../components/ui/ScrollProgress'
import SEOHead from '../components/seo/SEOHead'
import SeoContentSection from '../components/seo/SeoContentSection'
import { CONTACT } from '../data/services'
import { SEO_PAGES } from '../data/seoContent'
import { useLanguage } from '../hooks/useLanguage'

export default function ServicesPage() {
  const { t, i18n } = useTranslation()
  const { lang, switchLanguage } = useLanguage()
  const displayLang = i18n.resolvedLanguage === 'ru' ? 'ru' : 'he'
  const seo = SEO_PAGES.services[displayLang]
  const waHref = `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}`

  return (
    <>
      <ScrollProgress />
      <SEOHead lang={lang} title={seo.title} description={seo.description} path="services" indexable />
      <Header lang={lang} onSwitchLang={switchLanguage} />
      <main id="main" className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
            {t('services.badge')}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-5">
            {seo.h1}
          </h1>
          <p className="text-ink-mid text-lg max-w-2xl mx-auto">{t('services.subtitle')}</p>
        </div>
        <Services hideHeader />
        <SeoContentSection h2Blocks={seo.h2Blocks} seoText={seo.seoText} ctaLabel={seo.ctaLabel} ctaHref={waHref} />
      </main>
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </>
  )
}

