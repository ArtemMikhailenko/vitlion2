'use client'

import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import Services from '../components/sections/Services'
import WhyUs from '../components/sections/WhyUs'
import ServiceVideos from '../components/sections/ServiceVideos'
import Gallery from '../components/sections/Gallery'
import Testimonials from '../components/sections/Testimonials'
import Contact from '../components/sections/Contact'
import CTASection from '../components/sections/CTASection'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import ScrollProgress from '../components/ui/ScrollProgress'
import FloatingVideo from '../components/ui/FloatingVideo'
import CostQuiz from '../components/ui/CostQuiz'

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-[200] focus:bg-gold focus:text-dark focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>
      <Header />
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
