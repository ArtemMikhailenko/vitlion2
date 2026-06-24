import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInView } from '../../hooks/useInView'

function StatCounter({ value, label }: { value: string; label: string }) {
  const [count, setCount] = useState(0)
  const [statsRef, inView] = useInView({ threshold: 0.3 })
  const ran = useRef(false)

  const parsed = useMemo(() => {
    const m = value.match(/^(\d+)(.*)$/)
    return m ? { num: parseInt(m[1]), suffix: m[2] } : { num: 0, suffix: value }
  }, [value])

  useEffect(() => {
    if (!inView || ran.current) return
    ran.current = true
    const duration = 1800
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * parsed.num))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, parsed.num])

  return (
    <div
      ref={statsRef as React.RefObject<HTMLDivElement>}
      className="bg-white/5 border border-white/10 rounded-2xl px-4 py-6 text-center hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
    >
      <div className="text-3xl lg:text-4xl font-bold text-gold mb-1 tabular-nums">
        {count}{parsed.suffix}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

export default function Hero() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(id)
  }, [])

  const stats = [
    t('stats.projects', { returnObjects: true }) as { value: string; label: string },
    t('stats.experience', { returnObjects: true }) as { value: string; label: string },
    t('stats.warranty', { returnObjects: true }) as { value: string; label: string },
    t('stats.cities', { returnObjects: true }) as { value: string; label: string },
  ]

  const titleLines = t('hero.title').split('\n')

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-section to-dark-card" />
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          autoPlay
          muted
          loop
          playsInline
          poster="/media/hero-bg.jpg"
        >
          <source src="/media/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/40 to-dark" />
      </div>

      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <div
          className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
          {t('hero.badge')}
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight mb-6">
          {titleLines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <span
                className="block"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(100%)',
                  transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)`,
                  transitionDelay: `${i * 160 + 250}ms`,
                }}
              >
                {i === 1 ? <span className="text-gold">{line}</span> : line}
              </span>
            </div>
          ))}
        </h1>

        <p
          className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            transitionDelay: '650ms',
          }}
        >
          {t('hero.subtitle')}
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            transitionDelay: '800ms',
          }}
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-dark font-bold px-8 py-4 rounded-xl transition-all duration-200 text-base shadow-lg shadow-gold/20 hover:shadow-gold/40 hover:scale-105 active:scale-95"
          >
            {t('hero.cta')}
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="#gallery"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base active:scale-95"
          >
            {t('hero.ctaSecondary')}
          </a>
        </div>

        <div
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            transitionDelay: '950ms',
          }}
        >
          {stats.map((stat, i) => (
            <StatCounter key={i} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gray-500">
        <span className="text-xs tracking-widest uppercase">{t('hero.scrollDown')}</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
