import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInView } from '../../hooks/useInView'

const GALLERY_IMAGES = [
  { src: '/media/gallery/01.jpg', alt: '' },
  { src: '/media/gallery/02.jpg', alt: '' },
  { src: '/media/gallery/03.png', alt: '' },
  { src: '/media/gallery/04.jpg', alt: '' },
  { src: '/media/gallery/05.png', alt: '' },
  { src: '/media/gallery/06.png', alt: '' },
  { src: '/media/gallery/07.png', alt: '' },
  { src: '/media/gallery/08.png', alt: '' },
  { src: '/media/gallery/09.png', alt: '' },
  { src: '/media/gallery/10.png', alt: '' },
  { src: '/media/gallery/11.jpg', alt: '' },
  { src: '/media/gallery/12.jpg', alt: '' },
  { src: '/media/gallery/13.jpg', alt: '' },
  { src: '/media/gallery/14.png', alt: '' },
  { src: '/media/gallery/15.png', alt: '' },
  { src: '/media/gallery/16.jpg', alt: '' },
]

export default function Gallery() {
  const { t } = useTranslation()
  const [lightbox, setLightbox] = useState<{ src: string; index: number } | null>(null)
  const [loaded, setLoaded] = useState<Set<string>>(new Set())
  const [gridRef, inView] = useInView({ threshold: 0.03 })

  const prev = () => {
    if (!lightbox) return
    const i = (lightbox.index - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
    setLightbox({ src: GALLERY_IMAGES[i].src, index: i })
  }

  const next = () => {
    if (!lightbox) return
    const i = (lightbox.index + 1) % GALLERY_IMAGES.length
    setLightbox({ src: GALLERY_IMAGES[i].src, index: i })
  }

  return (
    <section id="gallery" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
            {t('gallery.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            {t('gallery.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="break-inside-avoid relative group overflow-hidden rounded-xl bg-dark-card border border-dark-border hover:border-gold/40 cursor-pointer transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gold/8"
              onClick={() => setLightbox({ src: img.src, index: i })}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.55s ease, transform 0.55s ease, border-color 0.3s, box-shadow 0.3s',
                transitionDelay: inView ? `${(i % 6) * 60}ms` : '0ms',
              }}
            >
              <div className={`${i % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[4/3]'} bg-dark-elevated`}>
                <img
                  src={img.src}
                  alt={img.alt || `Vitlion project ${i + 1}`}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                    loaded.has(img.src) ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => setLoaded(prev => new Set([...prev, img.src]))}
                  onError={(e) => {
                    e.currentTarget.parentElement!.style.display = 'none'
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-all duration-300 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-white/0 group-hover:bg-gold/90 flex items-center justify-center transition-all duration-300 scale-50 group-hover:scale-100">
                  <svg className="w-5 h-5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803zM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-dark/97 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 end-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute start-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-gold/80 flex items-center justify-center text-white transition-all duration-200"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous"
          >
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            src={lightbox.src}
            alt="Gallery"
            className="max-w-full max-h-[88vh] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute end-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-gold/80 flex items-center justify-center text-white transition-all duration-200"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next"
          >
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-gray-500 text-sm">
            {lightbox.index + 1} / {GALLERY_IMAGES.length}
          </div>
        </div>
      )}
    </section>
  )
}
