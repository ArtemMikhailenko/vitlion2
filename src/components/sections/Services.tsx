import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SERVICES } from '../../data/services'
import { useInView } from '../../hooks/useInView'
import ShimmerHeading from '../ui/ShimmerHeading'
import ServiceModal from '../ui/ServiceModal'
import type { Service } from '../../types'

function ServiceCard({ service, index, inView, onClick }: {
  service: typeof SERVICES[0]
  index: number
  inView: boolean
  onClick: () => void
}) {
  const { t } = useTranslation()
  const name = t(service.nameKey)
  const shortDesc = t(service.shortKey)

  return (
    <button
      type="button"
      className="group relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden text-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{
        opacity: inView ? 1 : 0,
        boxShadow: '0 2px 12px rgba(196,152,58,0.06)',
        ...(inView ? {} : { transform: 'translateY(36px)' }),
        transition: `opacity 0.6s ease ${index * 75}ms, transform 0.4s ease ${index * 75}ms, box-shadow 0.3s, border-color 0.3s`,
      }}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="absolute top-4 end-4 w-7 h-7 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold text-xs font-bold">
          {String(index + 1).padStart(2, '0')}
        </div>
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
