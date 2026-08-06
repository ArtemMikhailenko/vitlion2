'use client'

import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Contact from '../components/sections/Contact'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import ScrollProgress from '../components/ui/ScrollProgress'

export default function ContactPage() {

  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main" className="pt-20">
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
