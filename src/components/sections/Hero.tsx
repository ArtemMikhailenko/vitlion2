import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import HeroParticles from '../ui/HeroParticles'


function SparkyLine({ text, delay, color = 'white' }: { text: string; delay: number; color?: 'white' | 'gold' }) {
  const [revealed, setRevealed] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const start = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(start)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (revealed >= text.length) return
    const id = setTimeout(() => setRevealed(r => r + 1), 52)
    return () => clearTimeout(id)
  }, [started, revealed, text.length])

  return (
    <span className="inline">
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={
            i < revealed
              ? {
                  animation: `spark 0.55s ease-out both`,
                  animationDelay: `0ms`,
                  color: color === 'gold' ? undefined : 'white',
                }
              : { opacity: 0 }
          }
          className={color === 'gold' ? 'text-gold' : ''}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(id)
  }, [])

  const titleLines = t('hero.title').split('\n')

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0F1118] to-[#0A0D14]" />
        <HeroParticles />
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          autoPlay muted loop playsInline poster="/media/hero-bg.jpg"
        >
          <source src="/media/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]/80" />
        {/* Subtle metallic shimmer overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(139,143,168,0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight mb-6">
          {titleLines.map((line, i) => (
            <div key={i} className="block">
              {mounted && (
                <SparkyLine
                  text={line}
                  delay={i * (line.length * 52) + i * 100}
                  color={i === 1 ? 'gold' : 'white'}
                />
              )}
            </div>
          ))}
        </h1>

        <p
          className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            transitionDelay: `${titleLines.join('').length * 52 + 400}ms`,
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
            transitionDelay: `${titleLines.join('').length * 52 + 550}ms`,
          }}
        >
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#111] font-bold px-8 py-4 rounded-xl transition-all duration-200 text-base shadow-lg shadow-gold/25 hover:shadow-gold/45 hover:scale-105 active:scale-95"
          >
            {t('hero.cta')}
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="/projects"
            className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/14 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base active:scale-95 backdrop-blur-sm"
          >
            {t('hero.ctaSecondary')}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gray-500">
        <span className="text-xs tracking-widest uppercase">{t('hero.scrollDown')}</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
