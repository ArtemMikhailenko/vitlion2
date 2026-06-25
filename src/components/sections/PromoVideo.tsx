import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import VideoModal from '../ui/VideoModal'

interface Props {
  lang: string
}

export default function PromoVideo({ lang }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const src = lang === 'he' ? '/media/hero/promo-he.mp4' : '/media/hero/promo-ru.mp4'
  const poster = lang === 'he' ? '/media/gallery/03.png' : '/media/gallery/06.png'

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const lines = t('promoVideo.title').split('\n')

  return (
    <>
      <section
        ref={sectionRef}
        id="promo"
        className="py-24 lg:py-32 overflow-hidden"
        style={{ backgroundColor: '#1A1D24' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
              {t('promoVideo.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight" style={{ color: '#F7F4EF' }}>
              {lines.map((line, i) => (
                <span key={i} className={`block ${i === 1 ? 'text-gradient-gold' : ''}`}>
                  {line}
                </span>
              ))}
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#A8A8B8' }}>
              {t('promoVideo.subtitle')}
            </p>
          </div>

          <div
            className={`relative max-w-5xl mx-auto transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div
              className="group relative aspect-video rounded-3xl overflow-hidden cursor-pointer ring-1 ring-dark-border hover:ring-gold/40 transition-all duration-500 shadow-2xl"
              onClick={() => setOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
              aria-label={t('promoVideo.play')}
            >
              <img
                src={poster}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 transition-opacity duration-300 group-hover:opacity-90" />

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative mb-5">
                  <span className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
                  <button
                    className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gold hover:bg-gold-light transition-all duration-300 flex items-center justify-center shadow-2xl group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <svg className="w-8 h-8 lg:w-10 lg:h-10 text-dark ms-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <span className="text-white font-semibold text-base lg:text-lg tracking-wide">
                  {t('promoVideo.play')}
                </span>
              </div>

              <div className="absolute bottom-5 start-5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-white/70 text-xs font-medium tracking-wide uppercase">
                  Vitlion Group
                </span>
              </div>
            </div>

            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gold/5 via-transparent to-gold/5 blur-2xl -z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {open && <VideoModal src={src} onClose={() => setOpen(false)} />}
    </>
  )
}
