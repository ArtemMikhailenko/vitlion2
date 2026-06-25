import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import VideoModal from '../ui/VideoModal'

const VIDEO_ITEMS = [
  {
    src: '/media/reviews/review1.mp4',
    poster: '/media/gallery/09.png',
    duration: null,
  },
  {
    src: '/media/reviews/review2.mp4',
    poster: '/media/gallery/12.jpg',
    duration: null,
  },
]

export default function VideoReviews() {
  const { t } = useTranslation()
  const [activeSrc, setActiveSrc] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const items = t('videoReviews.items', { returnObjects: true }) as Array<{
    name: string
    city: string
  }>

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        className="py-24 lg:py-32 bg-dark-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
              {t('videoReviews.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5">
              {t('videoReviews.title')}
            </h2>
            <p className="text-ink-mid text-lg max-w-xl mx-auto">
              {t('videoReviews.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {VIDEO_ITEMS.map((video, i) => {
              const info = Array.isArray(items) ? items[i] : null
              return (
                <div
                  key={i}
                  className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div
                    className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer ring-1 ring-dark-border hover:ring-gold/40 transition-all duration-400 bg-dark-card"
                    onClick={() => setActiveSrc(video.src)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveSrc(video.src)}
                    aria-label={t('videoReviews.play')}
                  >
                    <img
                      src={video.poster}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-all duration-300" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 hover:bg-gold hover:border-gold transition-all duration-300 flex items-center justify-center group-hover:scale-110 shadow-xl">
                        <svg className="w-6 h-6 text-white ms-0.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <svg key={s} className="w-3.5 h-3.5 text-gold fill-gold" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        {info && (
                          <span className="text-white/60 text-xs">{info.city}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {info && (
                    <div className="mt-4 flex items-center gap-3 px-1">
                      <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-ink text-sm font-medium">{info.name}</div>
                        <div className="text-ink-soft text-xs">{info.city}</div>
                      </div>
                      <button
                        onClick={() => setActiveSrc(video.src)}
                        className="ms-auto text-gold hover:text-gold-light text-xs font-medium tracking-wide flex items-center gap-1.5 transition-colors duration-200"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        {t('videoReviews.play')}
                      </button>
                    </div>
                  )}
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
