import { HelmetProvider } from 'react-helmet-async'
import SEOHead from './components/seo/SEOHead'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import GlassExplanation from './components/sections/GlassExplanation'
import WhyUs from './components/sections/WhyUs'
import ServiceVideos from './components/sections/ServiceVideos'
import PromoVideo from './components/sections/PromoVideo'
import Gallery from './components/sections/Gallery'
import VideoReviews from './components/sections/VideoReviews'
import Testimonials from './components/sections/Testimonials'
import Contact from './components/sections/Contact'
import WhatsAppButton from './components/ui/WhatsAppButton'
import ScrollProgress from './components/ui/ScrollProgress'
import CursorGlow from './components/ui/CursorGlow'
import AccessibilityWidget from './components/ui/AccessibilityWidget'
import { useLanguage } from './hooks/useLanguage'

export default function App() {
  const { lang, switchLanguage } = useLanguage()

  return (
    <HelmetProvider>
      <ScrollProgress />
      <CursorGlow />
      <SEOHead lang={lang} />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-[200] focus:bg-gold focus:text-dark focus:px-4 focus:py-2 focus:rounded-lg">
        Skip to main content
      </a>
      <Header lang={lang} onSwitchLang={switchLanguage} />
      <main id="main">
        <Hero />
        <Services />
        <ServiceVideos />
        <GlassExplanation />
        <WhyUs />
        <PromoVideo lang={lang} />
        <Gallery />
        <VideoReviews />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <AccessibilityWidget />
    </HelmetProvider>
  )
}
