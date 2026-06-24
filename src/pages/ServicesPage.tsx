import { useTranslation } from 'react-i18next'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Services from '../components/sections/Services'
import CTASection from '../components/sections/CTASection'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import ScrollProgress from '../components/ui/ScrollProgress'
import AccessibilityWidget from '../components/ui/AccessibilityWidget'
import { useLanguage } from '../hooks/useLanguage'

export default function ServicesPage() {
  const { t } = useTranslation()
  const { lang, switchLanguage } = useLanguage()

  return (
    <>
      <ScrollProgress />
      <Header lang={lang} onSwitchLang={switchLanguage} />
      <main id="main" className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
            {t('services.badge')}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5">
            {t('services.title')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('services.subtitle')}</p>
        </div>
        <Services hideHeader />
      </main>
      <CTASection />
      <Footer />
      <WhatsAppButton />
      <AccessibilityWidget />
    </>
  )
}
