import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SERVICES } from '../../data/services'
import { useInView } from '../../hooks/useInView'
import ShimmerHeading from '../ui/ShimmerHeading'
import ServiceModal from '../ui/ServiceModal'
import BeforeAfterSlider from '../ui/BeforeAfterSlider'
import type { Service } from '../../types'

const BEFORE_AFTER: Record<string, { before: string; after: string }> = {
  'pergola-electric':    { before: '/media/before-after/pergola-electric-after.png',    after: '/media/before-after/pergola-electric-before.png' },
  'pergola-static':     { before: '/media/before-after/pergola-static-before.png',     after: '/media/before-after/pergola-static-after.jpg' },
  'zip-pvc':            { before: '/media/before-after/zip-pvc-after.png',             after: '/media/before-after/zip-pvc-before.jpg' },
  'frameless-glazing':  { before: '/media/before-after/frameless-glazing-before.png',  after: '/media/before-after/frameless-glazing-after.jpg' },
  'guillotine-electric':{ before: '/media/before-after/guillotine-electric-after.png', after: '/media/before-after/guillotine-electric-before.png' },
  'sliding-systems':    { before: '/media/before-after/sliding-systems-after.png',     after: '/media/before-after/sliding-systems-before.jpeg' },
  'swing-doors':        { before: '/media/before-after/swing-doors-after.png',         after: '/media/before-after/swing-doors-before.png' },
  'pivot-windows':      { before: '/media/before-after/pivot-windows-after.png',       after: '/media/before-after/pivot-windows-before.png' },
  'fixed-glazing':      { before: '/media/before-after/fixed-glazing-after.png',       after: '/media/before-after/fixed-glazing-before.png' },
}

function ServiceCard({ service, index, inView, onClick }: {
  service: typeof SERVICES[0]
  index: number
  inView: boolean
  onClick: () => void
}) {
  const { t } = useTranslation()
  const name = t(service.nameKey)
  const shortDesc = t(service.shortKey)
  const pair = BEFORE_AFTER[service.slug]

  return (
    <button
      type="button"
      className="group relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden text-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-0 appearance-none flex flex-col"
      style={{
        opacity: inView ? 1 : 0,
        boxShadow: '0 2px 12px rgba(196,152,58,0.06)',
        ...(inView ? {} : { transform: 'translateY(36px)' }),
        transition: `opacity 0.6s ease ${index * 75}ms, transform 0.4s ease ${index * 75}ms, box-shadow 0.3s, border-color 0.3s`,
      }}
      onClick={onClick}
    >
      {/* Image / before-after area */}
      <div className="relative h-52 overflow-hidden">
        {pair ? (
          <BeforeAfterSlider before={pair.before} after={pair.after} />
        ) : (
          <img
            src={service.image}
            alt={name}
            className="block w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-gold transition-colors duration-200">
          {name}
        </h3>
        <p className="text-ink-mid text-sm leading-relaxed mb-4">{shortDesc}</p>
        <span className="text-gold text-sm font-semibold flex items-center gap-1.5 group-hover:gap-3 transition-all duration-200">
          {t('services.learnMore')}
          <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </div>
    </button>
  )
}

export default function Services({ hideHeader }: { hideHeader?: boolean } = {}) {
  const { t } = useTranslation()
  const [activeService, setActiveService] = useState<Service | null>(null)
  const [gridRef, inView] = useInView({ threshold: 0.05 })

  return (
    <>
      <section id="services" className="py-24 lg:py-32 bg-dark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!hideHeader && (
            <div className="text-center mb-16">
              <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
                {t('services.badge')}
              </span>
              <ShimmerHeading className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5">
                {t('services.title')}
              </ShimmerHeading>
              <p className="text-ink-mid text-lg max-w-2xl mx-auto">{t('services.subtitle')}</p>
            </div>
          )}

          <div
            ref={gridRef as React.RefObject<HTMLDivElement>}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SERVICES.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                inView={inView}
                onClick={() => setActiveService(service)}
              />
            ))}
          </div>
        </div>
      </section>

      <ServiceModal service={activeService} onClose={() => setActiveService(null)} />
    </>
  )
}
