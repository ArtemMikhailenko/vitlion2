import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Contact from '../components/sections/Contact'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import ScrollProgress from '../components/ui/ScrollProgress'
import SEOHead from '../components/seo/SEOHead'
import { useLanguage } from '../hooks/useLanguage'

export default function ContactPage() {
  const { lang, switchLanguage } = useLanguage()

  return (
    <>
      <ScrollProgress />
      <SEOHead lang={lang} path="contact" />
      <Header lang={lang} onSwitchLang={switchLanguage} />
      <main id="main" className="pt-20">
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
