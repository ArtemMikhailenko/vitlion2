import { useTranslation } from 'react-i18next'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Gallery from '../components/sections/Gallery'
import CTASection from '../components/sections/CTASection'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import ScrollProgress from '../components/ui/ScrollProgress'
import SEOHead from '../components/seo/SEOHead'
import { useLanguage } from '../hooks/useLanguage'

export default function ProjectsPage() {
  const { t } = useTranslation()
  const { lang, switchLanguage } = useLanguage()

  return (
    <>
      <ScrollProgress />
      <SEOHead lang={lang} path="projects" />
      <Header lang={lang} onSwitchLang={switchLanguage} />
      <main id="main" className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
            {t('gallery.badge')}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-5">
            {t('gallery.title')}
          </h1>
          <p className="text-ink-mid text-lg max-w-2xl mx-auto">{t('gallery.subtitle')}</p>
        </div>
        <Gallery hideHeader />
      </main>
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </>
  )
}
