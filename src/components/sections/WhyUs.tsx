import { useState } from 'react'
import { Factory, Ruler, Zap, ShieldCheck, Palette, Headset } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useInView } from '../../hooks/useInView'
import ShimmerHeading from '../ui/ShimmerHeading'
import KineticWatermark from '../ui/KineticWatermark'

const ICONS = [Factory, Ruler, Zap, ShieldCheck, Palette, Headset]

function FlipCard({ item, i, inView }: { item: { title: string; text: string }; i: number; inView: boolean }) {
  const [flipped, setFlipped] = useState(false)
  const Icon = ICONS[i] ?? ShieldCheck

  return (
    <div
      className="relative h-52"
      style={{
        perspective: '900px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
      }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        style={{
          width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.55s cubic-bezier(0.34,1.2,0.64,1)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-7 border border-dark-border bg-dark-card flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
            <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-ink">{item.title}</h3>
          <div className="mt-auto flex items-center gap-1 text-gold/40">
            <div className="w-3 h-px bg-gold/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-pulse" />
            <div className="w-3 h-px bg-gold/30" />
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl p-7 border border-gold/30 flex flex-col justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, rgba(196,152,58,0.12) 0%, rgba(196,152,58,0.05) 100%)',
          }}
        >
          <div className="w-8 h-px bg-gold mb-4" />
          <p className="text-ink-mid text-sm leading-relaxed">{item.text}</p>
        </div>
      </div>
    </div>
  )
}

export default function WhyUs() {
  const { t } = useTranslation()
  const [gridRef, inView] = useInView({ threshold: 0.05 })
  const [headRef, headInView] = useInView({ threshold: 0.2 })

  const items = t('whyUs.items', { returnObjects: true }) as Array<{ icon: string; title: string; text: string }>

  return (
    <section id="why-us" className="py-24 lg:py-32 bg-dark relative overflow-hidden">
      <KineticWatermark />

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
          <p className="text-ink-mid text-lg max-w-2xl mx-auto" style={{ opacity: headInView ? 1 : 0, transition: 'opacity 0.6s ease 200ms' }}>
            {t('whyUs.subtitle')}
          </p>
        </div>

        <div ref={gridRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(items) && items.map((item, i) => (
            <FlipCard key={i} item={item} i={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
