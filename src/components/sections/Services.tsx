import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SERVICES } from '../../data/services'
import { useInView } from '../../hooks/useInView'

export default function Services() {
  const { t } = useTranslation()
  const [activeService, setActiveService] = useState<string | null>(null)
  const [gridRef, inView] = useInView({ threshold: 0.05 })

  return (
    <section id="services" className="py-24 lg:py-32 bg-dark-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
            {t('services.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            {t('services.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((service, index) => {
            const isActive = activeService === service.id
            const name = t(service.nameKey)
            const shortDesc = t(service.shortKey)
            const description = t(service.descriptionKey)
            const features = t(service.featuresKey, { returnObjects: true }) as string[]

            return (
              <div
                key={service.id}
                className={`group relative bg-dark-card border rounded-2xl overflow-hidden cursor-pointer ${
                  isActive
                    ? 'border-gold shadow-lg shadow-gold/10'
                    : 'border-dark-border hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1'
                }`}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView
                    ? (isActive ? 'translateY(0)' : undefined)
                    : 'translateY(32px)',
                  transition: `opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s`,
                  transitionDelay: inView ? `${index * 75}ms` : '0ms',
                }}
                onClick={() => setActiveService(isActive ? null : service.id)}
              >
                <div className="relative h-48 overflow-hidden bg-dark-elevated">
                  <img
                    src={service.image}
                    alt={name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
                  <div className="absolute top-4 start-4 text-3xl">{service.icon}</div>
                  <div className="absolute top-4 end-4 w-7 h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-xs font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors duration-200">
                    {name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{shortDesc}</p>

                  <button
                    className="text-gold text-sm font-medium flex items-center gap-1.5 hover:gap-3 transition-all duration-200"
                    aria-expanded={isActive}
                  >
                    {isActive ? t('services.allServices') : t('services.learnMore')}
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{ maxHeight: isActive ? '500px' : '0px', opacity: isActive ? 1 : 0 }}
                  >
                    <p className="text-gray-300 text-sm leading-relaxed mt-4 mb-4">{description}</p>
                    {Array.isArray(features) && features.length > 0 && (
                      <ul className="space-y-2 mb-5">
                        {features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="text-gold mt-0.5 shrink-0">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-dark font-semibold px-5 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('services.viewProject')}
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
