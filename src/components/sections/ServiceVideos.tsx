import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import VideoModal from '../ui/VideoModal'

const VIDEO_ITEMS = [
  {
    src: '/media/services-video/frameless-glazing.mp4',
    poster: '/media/services/frameless-glazing/main.jpg',
  },
  {
    src: '/media/services-video/bioclimatic.mp4',
    poster: '/media/services/pergola-electric/main.jpg',
  },
  {
    src: '/media/services-video/glazing.mp4',
    poster: '/media/services/guillotine-electric/main.jpg',
  },
  {
    src: '/media/services-video/pergola-pvc.mp4',
    poster: '/media/services/zip-pvc/main.jpg',
  },
]

export default function ServiceVideos() {
  const { t } = useTranslation()
  const [activeSrc, setActiveSrc] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const items = t('serviceVideos.items', { returnObjects: true }) as Array<{
    title: string
    label: string
  }>

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.08 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section ref={sectionRef} className="py-24 lg:py-32 bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
              {t('serviceVideos.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5">
              {t('serviceVideos.title')}
            </h2>
            <p className="text-ink text-lg max-w-xl mx-auto">
              {t('serviceVideos.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {VIDEO_ITEMS.map((video, i) => {
              const info = Array.isArray(items) ? items[i] : null
              return (
                <div
                  key={i}
                  className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div
                    className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer ring-1 ring-dark-border hover:ring-gold/50 transition-all duration-400 bg-dark-elevated"
                    onClick={() => setActiveSrc(video.src)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveSrc(video.src)}
                    aria-label={info?.title ?? 'Play video'}
                  >
                    <img
                      src={video.poster}
                      alt={info?.title ?? ''}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent group-hover:from-black/90 transition-colors duration-300" />

                    {info && (
                      <div className="absolute top-4 start-4">
                        <span className="inline-block bg-gold/90 text-dark text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                          {info.label}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-gold group-hover:border-gold group-hover:scale-110 shadow-2xl">
                        <svg className="w-6 h-6 text-white ms-0.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {info && (
                      <div className="absolute bottom-0 inset-x-0 p-5">
                        <h3 className="text-white font-semibold text-base lg:text-lg leading-snug">
                          {info.title}
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {activeSrc && <VideoModal src={activeSrc} onClose={() => setActiveSrc(null)} />}
    </>
  )
}
