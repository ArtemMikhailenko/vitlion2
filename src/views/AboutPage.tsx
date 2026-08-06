'use client'

import { useTranslation } from '@/lib/i18n/client'
import { Factory, Ruler, Zap, ShieldCheck, Palette, Headset } from 'lucide-react'
import { X, Check, Shield, AlertTriangle } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import CTASection from '../components/sections/CTASection'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import ScrollProgress from '../components/ui/ScrollProgress'
import { useInView } from '../hooks/useInView'

const WHY_ICONS = [Factory, Ruler, Zap, ShieldCheck, Palette, Headset]
const TEAM_PHOTOS = ['/media/team/roman-sales.webp', '/media/team/kirill-photograper.webp']

export default function AboutPage() {
  const { t } = useTranslation()
  const [whyRef, whyInView] = useInView({ threshold: 0.05 })
  const [glassRef, glassInView] = useInView({ threshold: 0.1 })

  const whyItems = t('whyUs.items', { returnObjects: true }) as Array<{ title: string; text: string }>
  const regularFeatures = t('glass.regularFeatures', { returnObjects: true }) as string[]
  const temperedFeatures = t('glass.temperedFeatures', { returnObjects: true }) as string[]
  const teamMembers = t('team.members', { returnObjects: true }) as Array<{ name: string; role: string }>

  return (
    <>
      <ScrollProgress />
      <Header />

      <main id="main" className="pt-20">
        <section className="relative py-20 bg-dark overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(196,152,58,0.06) 0%, transparent 70%)' }} />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-5">
              {t('whyUs.badge')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-6 leading-tight">
              {t('whyUs.title')}
            </h1>
            <p className="text-ink-mid text-lg leading-relaxed max-w-2xl mx-auto">
              {t('whyUs.subtitle')}
            </p>
          </div>
        </section>

        <section className="py-20 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={whyRef as React.RefObject<HTMLDivElement>}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.isArray(whyItems) && whyItems.map((item, i) => {
                const Icon = WHY_ICONS[i] ?? ShieldCheck
                return (
                  <div
                    key={i}
                    className="group bg-dark-card border border-dark-border hover:border-gold/40 rounded-2xl p-7 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1.5 transition-all duration-300"
                    style={{
                      opacity: whyInView ? 1 : 0,
                      transform: whyInView ? 'translateY(0)' : 'translateY(32px)',
                      transition: 'opacity 0.6s ease, transform 0.6s ease',
                      transitionDelay: whyInView ? `${i * 80}ms` : '0ms',
                    }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 group-hover:bg-gold/20 group-hover:border-gold/40 transition-all duration-300">
                      <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-ink mb-3 group-hover:text-gold transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-ink-mid text-sm leading-relaxed">{item.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
                {t('glass.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5">
                {t('glass.title')}
              </h2>
              <p className="text-ink-mid text-lg max-w-2xl mx-auto leading-relaxed">
                {t('glass.description')}
              </p>
            </div>

            <div
              ref={glassRef as React.RefObject<HTMLDivElement>}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
            >
              <div
                className="relative rounded-2xl overflow-hidden min-h-80 lg:min-h-0"
                style={{ opacity: glassInView ? 1 : 0, transform: glassInView ? 'translateX(0)' : 'translateX(-32px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
              >
                <img
                  src="/media/services/frameless-glazing/01.webp"
                  alt="Vitlion tempered glass"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />
                <div className="absolute bottom-6 start-6 end-6">
                  <div className="inline-flex items-center gap-2 bg-gold/95 text-dark font-bold px-4 py-2 rounded-xl text-sm shadow-lg">
                    <Shield className="w-4 h-4" strokeWidth={2} />
                    {t('glass.cta')}
                  </div>
                </div>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                style={{ opacity: glassInView ? 1 : 0, transform: glassInView ? 'translateX(0)' : 'translateX(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease', transitionDelay: '120ms' }}
              >
                <div className="bg-dark-card border border-red-900/40 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-red-900/30 border border-red-900/50 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-400" strokeWidth={2} />
                    </div>
                    <h3 className="font-bold text-ink">{t('glass.regularGlass')}</h3>
                  </div>
                  <ul className="space-y-3">
                    {Array.isArray(regularFeatures) && regularFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-ink-mid">
                        <X className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-dark-card border border-gold/30 rounded-2xl p-6 relative">
                  <div className="absolute top-3 end-3">
                    <span className="bg-gold/10 border border-gold/30 text-gold text-xs font-bold px-2 py-0.5 rounded-full">Vitlion</span>
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-gold" strokeWidth={2} />
                    </div>
                    <h3 className="font-bold text-ink">{t('glass.temperedGlass')}</h3>
                  </div>
                  <ul className="space-y-3">
                    {Array.isArray(temperedFeatures) && temperedFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-ink">
                        <Check className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sm:col-span-2">
                  <div className="bg-gold/8 border border-gold/25 rounded-xl p-4 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-gold shrink-0" strokeWidth={2.5} />
                    <span className="text-gold font-semibold text-sm">{t('glass.cta')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
                {t('team.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5">
                {t('team.title')}
              </h2>
              <p className="text-ink-mid text-lg max-w-2xl mx-auto leading-relaxed">
                {t('team.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="group bg-dark-card border border-dark-border hover:border-gold/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-gold/5"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={TEAM_PHOTOS[i]}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-ink mb-1 group-hover:text-gold transition-colors duration-200">
                      {member.name}
                    </h3>
                    <p className="text-ink-mid text-sm">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <CTASection />
      <Footer />
      <WhatsAppButton />
    </>
  )
}
