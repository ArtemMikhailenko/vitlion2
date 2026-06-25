import { X, Check, Shield, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useInView } from '../../hooks/useInView'

export default function GlassExplanation() {
  const { t } = useTranslation()
  const [ref, inView] = useInView({ threshold: 0.1 })
  const [headRef, headInView] = useInView({ threshold: 0.2 })

  const regularFeatures = t('glass.regularFeatures', { returnObjects: true }) as string[]
  const temperedFeatures = t('glass.temperedFeatures', { returnObjects: true }) as string[]

  return (
    <section className="py-24 lg:py-32 bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headRef as React.RefObject<HTMLDivElement>}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ opacity: headInView ? 1 : 0, transform: headInView ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            {t('glass.badge')}
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5"
            style={{ opacity: headInView ? 1 : 0, transform: headInView ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s ease', transitionDelay: '80ms' }}
          >
            {t('glass.title')}
          </h2>
          <p
            className="text-ink-mid text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ opacity: headInView ? 1 : 0, transition: 'opacity 0.6s ease', transitionDelay: '160ms' }}
          >
            {t('glass.description')}
          </p>
        </div>

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
        >
          <div
            className="relative rounded-2xl overflow-hidden min-h-80 lg:min-h-0"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-32px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
          >
            <img
              src="/media/services/frameless-glazing/01.jpg"
              alt="Vitlion tempered glass installation"
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
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease', transitionDelay: '120ms' }}
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
                <span className="bg-gold/10 border border-gold/30 text-gold text-xs font-bold px-2 py-0.5 rounded-full">
                  Vitlion
                </span>
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
  )
}
