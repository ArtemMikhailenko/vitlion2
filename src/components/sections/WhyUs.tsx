import { Factory, Ruler, Zap, ShieldCheck, Palette, Headset } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useInView } from '../../hooks/useInView'

const ICONS = [Factory, Ruler, Zap, ShieldCheck, Palette, Headset]

export default function WhyUs() {
  const { t } = useTranslation()
  const [gridRef, inView] = useInView({ threshold: 0.05 })
  const [headRef, headInView] = useInView({ threshold: 0.2 })

  const items = t('whyUs.items', { returnObjects: true }) as Array<{
    icon: string
    title: string
    text: string
  }>

  return (
    <section id="why-us" className="py-24 lg:py-32 bg-dark-section relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 start-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 end-0 w-80 h-80 bg-gold/3 rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef as React.RefObject<HTMLDivElement>} className="text-center mb-16">
          <span
            className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ opacity: headInView ? 1 : 0, transform: headInView ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            {t('whyUs.badge')}
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5"
            style={{ opacity: headInView ? 1 : 0, transform: headInView ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)', transitionDelay: '100ms' }}
          >
            {t('whyUs.title')}
          </h2>
          <p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            style={{ opacity: headInView ? 1 : 0, transition: 'opacity 0.6s ease', transitionDelay: '200ms' }}
          >
            {t('whyUs.subtitle')}
          </p>
        </div>

        <div ref={gridRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(items) && items.map((item, i) => {
            const Icon = ICONS[i] ?? ShieldCheck
            return (
              <div
                key={i}
                className="group bg-dark-card border border-dark-border hover:border-gold/40 rounded-2xl p-7 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1.5 transition-all duration-300"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(32px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s',
                  transitionDelay: inView ? `${i * 80}ms` : '0ms',
                }}
              >
                <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-gold/20 group-hover:border-gold/40">
                  <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gold transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
