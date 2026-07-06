import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import SEOHead from './components/seo/SEOHead'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import WhyUs from './components/sections/WhyUs'
import ServiceVideos from './components/sections/ServiceVideos'
import Gallery from './components/sections/Gallery'
import VideoReviews from './components/sections/VideoReviews'
import Testimonials from './components/sections/Testimonials'
import Contact from './components/sections/Contact'
import CTASection from './components/sections/CTASection'
import WhatsAppButton from './components/ui/WhatsAppButton'
import ScrollProgress from './components/ui/ScrollProgress'
import FloatingVideo from './components/ui/FloatingVideo'
import CostQuiz from './components/ui/CostQuiz'
import ServicesPage from './pages/ServicesPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import { useLanguage } from './hooks/useLanguage'

function LandingPage() {
  const { lang, switchLanguage } = useLanguage()
  return (
    <>
      <ScrollProgress />
      <SEOHead lang={lang} />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-[200] focus:bg-gold focus:text-dark focus:px-4 focus:py-2 focus:rounded-lg">
        Skip to main content
      </a>
      <Header lang={lang} onSwitchLang={switchLanguage} />
      <main id="main">
        <Hero />
        <Services />
        <ServiceVideos />
        <WhyUs />
        <Gallery />
        <VideoReviews />
        <Testimonials />
        <Contact />
      </main>
      <CTASection />
      <Footer />
      <WhatsAppButton />
      <FloatingVideo />
      <CostQuiz />
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </HelmetProvider>
  )
}
