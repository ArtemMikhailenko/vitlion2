import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useInView } from '../../hooks/useInView'

const GALLERY_IMAGES = [
  { src: '/media/gallery/01.jpg', alt: 'Frameless glazing project' },
  { src: '/media/gallery/02.jpg', alt: 'Aluminum pergola' },
  { src: '/media/gallery/03.png', alt: 'ZIP PVC curtains' },
  { src: '/media/gallery/04.jpg', alt: 'Bioclimatic pergola' },
  { src: '/media/gallery/05.png', alt: 'Sliding system' },
  { src: '/media/gallery/06.png', alt: 'Electric guillotine' },
  { src: '/media/gallery/07.png', alt: 'Fixed glazing' },
  { src: '/media/gallery/08.png', alt: 'Swing doors' },
  { src: '/media/gallery/09.png', alt: 'Pergola installation' },
  { src: '/media/gallery/10.png', alt: 'Glass system' },
  { src: '/media/gallery/13.jpg', alt: 'Winter garden' },
  { src: '/media/gallery/14.png', alt: 'Pergola with PVC' },
  { src: '/media/gallery/15.png', alt: 'Pivot windows' },
  { src: '/media/gallery/16.jpg', alt: 'Commercial glazing' },
]

export default function Gallery({ hideHeader }: { hideHeader?: boolean } = {}) {
  const { t } = useTranslation()
  const [lightbox, setLightbox] = useState<{ src: string; index: number } | null>(null)
  const [ref, inView] = useInView({ threshold: 0.03 })
  const [cols, setCols] = useState(3)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCols(1)
      else if (window.innerWidth < 1024) setCols(2)
      else setCols(3)
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  const columns: typeof GALLERY_IMAGES[number][][] = Array.from({ length: cols }, () => [])
  GALLERY_IMAGES.forEach((img, i) => columns[i % cols].push(img))

  const allIndices: number[] = []
  columns.forEach((col) => col.forEach((img) => allIndices.push(GALLERY_IMAGES.indexOf(img))))

  const getOriginalIndex = (colIdx: number, rowIdx: number) => {
    let idx = 0
    for (let c = 0; c < colIdx; c++) idx += columns[c].length
    return idx + rowIdx
  }

  const prev = () => {
    if (!lightbox) return
    setLightbox({ src: GALLERY_IMAGES[(lightbox.index - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length].src, index: (lightbox.index - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length })
  }

  const next = () => {
    if (!lightbox) return
    setLightbox({ src: GALLERY_IMAGES[(lightbox.index + 1) % GALLERY_IMAGES.length].src, index: (lightbox.index + 1) % GALLERY_IMAGES.length })
  }

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <section id="gallery" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!hideHeader && (
          <div className="text-center mb-16">
            <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
              {t('gallery.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5">
              {t('gallery.title')}
            </h2>
            <p className="text-ink-mid text-lg max-w-xl mx-auto">
              {t('gallery.subtitle')}
            </p>
          </div>
        )}

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex gap-4"
        >
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex-1 flex flex-col gap-4">
              {col.map((img, rowIdx) => {
                const originalIdx = getOriginalIndex(colIdx, rowIdx)
                const staggerIdx = colIdx + rowIdx * cols
                return (
                  <div
                    key={img.src}
                    className="relative group overflow-hidden rounded-xl bg-dark-card border border-dark-border hover:border-gold/40 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-gold/10"
                    onClick={() => setLightbox({ src: img.src, index: originalIdx })}
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? 'translateY(0)' : 'translateY(28px)',
                      transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s',
                      transitionDelay: inView ? `${staggerIdx * 55}ms` : '0ms',
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                      onError={(e) => {
                        const el = e.currentTarget.closest<HTMLElement>('.relative')
                        if (el) el.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-transparent group-hover:bg-dark/50 transition-all duration-300 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-gold/0 group-hover:bg-gold flex items-center justify-center transition-all duration-300 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                        <svg className="w-5 h-5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803zM10.5 7.5v6m3-3h-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 end-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200 z-10"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute start-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-gold/80 flex items-center justify-center text-white transition-all duration-200 z-10"
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
            className="absolute end-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-gold/80 flex items-center justify-center text-white transition-all duration-200 z-10"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next"
          >
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-gray-500 text-sm tabular-nums">
            {lightbox.index + 1} / {GALLERY_IMAGES.length}
          </div>
        </div>
      )}
    </section>
  )
}
