import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import SEOHead from './components/seo/SEOHead'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import WhyUs from './components/sections/WhyUs'
import ServiceVideos from './components/sections/ServiceVideos'
import Gallery from './components/sections/Gallery'
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
import CategoryPage from './pages/CategoryPage'
import { INDEXABLE_CATEGORY_SLUGS } from './data/seoContent'
import { useLanguage } from './hooks/useLanguage'
import ScrollToTop from './components/utility/ScrollToTop'

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

function CategoryRedirect({ ruPrefix }: { ruPrefix?: boolean }) {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  return <Navigate to={ruPrefix ? `/ru/${categorySlug}` : `/${categorySlug}`} replace />
}

export default function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Routes>
        {/* Hebrew — default, no prefix */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        {INDEXABLE_CATEGORY_SLUGS.map(slug => (
          <Route key={slug} path={`/${slug}`} element={<CategoryPage slug={slug} />} />
        ))}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Russian */}
        <Route path="/ru" element={<LandingPage />} />
        <Route path="/ru/services" element={<ServicesPage />} />
        {INDEXABLE_CATEGORY_SLUGS.map(slug => (
          <Route key={`ru-${slug}`} path={`/ru/${slug}`} element={<CategoryPage slug={slug} />} />
        ))}
        <Route path="/ru/projects" element={<ProjectsPage />} />
        <Route path="/ru/contact" element={<ContactPage />} />
        <Route path="/ru/about" element={<AboutPage />} />

        {/* Legacy modal-style category URLs — client-side redirect to the dedicated pages */}
        <Route path="/category/:categorySlug" element={<CategoryRedirect />} />
        <Route path="/category/:categorySlug/service/:serviceSlug" element={<CategoryRedirect />} />
        <Route path="/ru/category/:categorySlug" element={<CategoryRedirect ruPrefix />} />
        <Route path="/ru/category/:categorySlug/service/:serviceSlug" element={<CategoryRedirect ruPrefix />} />

        {/* Fallback for removed EN routes and unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HelmetProvider>
  )
}
