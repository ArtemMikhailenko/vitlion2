import { Factory, Ruler, Zap, ShieldCheck, Palette, Headset } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useInView } from '../../hooks/useInView'
import ShimmerHeading from '../ui/ShimmerHeading'

const ICONS = [Factory, Ruler, Zap, ShieldCheck, Palette, Headset]

export default function WhyUs() {
  const { t } = useTranslation()
  const [gridRef, inView] = useInView({ threshold: 0.05 })
  const [headRef, headInView] = useInView({ threshold: 0.2 })

  const items = t('whyUs.items', { returnObjects: true }) as Array<{ icon: string; title: string; text: string }>

  return (
    <section id="why-us" className="py-24 lg:py-32 bg-dark relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef as React.RefObject<HTMLDivElement>} className="text-center mb-16">
          <span
            className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ opacity: headInView ? 1 : 0, transform: headInView ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            {t('whyUs.badge')}
          </span>
          <ShimmerHeading className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5" delay={100}>
            {t('whyUs.title')}
          </ShimmerHeading>
          <p
            className="text-ink-mid text-lg max-w-2xl mx-auto"
            style={{ opacity: headInView ? 1 : 0, transition: 'opacity 0.6s ease 200ms' }}
          >
            {t('whyUs.subtitle')}
          </p>
        </div>

        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {Array.isArray(items) && items.map((item, i) => {
            const Icon = ICONS[i] ?? ShieldCheck
            return (
              <div
                key={i}
                className="group rounded-2xl p-7 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  backgroundColor: '#13161F',
                  borderColor: '#23263A',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(32px)',
                  transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms, box-shadow 0.3s, border-color 0.3s`,
                  boxShadow: '0 1px 8px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(196,152,58,0.45)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#23263A')}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(196,152,58,0.1)', border: '1px solid rgba(196,152,58,0.2)' }}
                >
                  <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-ink-mid text-sm leading-relaxed">{item.text}</p>
                <div className="mt-5 h-0.5 w-8 rounded-full" style={{ background: 'linear-gradient(90deg, #C4983A, transparent)' }} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
