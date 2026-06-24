import { useEffect, useState } from 'react'
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Service } from '../../types'

interface Props {
  service: Service | null
  onClose: () => void
}

export default function ServiceModal({ service, onClose }: Props) {
  const { t } = useTranslation()
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    if (!service) return
    setActiveImg(0)
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setActiveImg(i => Math.min(i + 1, (service.gallery?.length ?? 1) - 1))
      if (e.key === 'ArrowLeft') setActiveImg(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [service, onClose])

  if (!service) return null

  const name = t(service.nameKey)
  const description = t(service.descriptionKey)
  const features = t(service.featuresKey, { returnObjects: true }) as string[]
  const gallery = service.gallery ?? [service.image]
  const currentImg = gallery[activeImg] ?? service.image

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-3xl sm:mx-4 bg-dark-card border border-dark-border rounded-t-2xl sm:rounded-2xl max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-dark-card border-b border-dark-border">
          <h2 className="text-lg font-bold text-white">{name}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-dark-elevated hover:bg-dark-border flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-150"
            aria-label={t('accessibility.close')}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="relative h-60 sm:h-80 bg-dark-elevated">
          <img
            src={currentImg}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card/60 to-transparent" />

          {gallery.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg(i => Math.max(i - 1, 0))}
                disabled={activeImg === 0}
                className="absolute start-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white disabled:opacity-30 transition-all duration-150"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" strokeWidth={2} />
              </button>
              <button
                onClick={() => setActiveImg(i => Math.min(i + 1, gallery.length - 1))}
                disabled={activeImg === gallery.length - 1}
                className="absolute end-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white disabled:opacity-30 transition-all duration-150"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-1.5 rounded-full transition-all duration-200 ${i === activeImg ? 'w-5 bg-gold' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="flex gap-2 px-6 pt-4 overflow-x-auto pb-1 scrollbar-hide">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-150 ${i === activeImg ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        <div className="px-6 py-5">
          <p className="text-gray-300 text-sm leading-relaxed mb-6">{description}</p>

          {Array.isArray(features) && features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold text-sm mb-3">{t('services.features')}</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href="#contact"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-light text-dark font-bold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm hover:scale-[1.02] active:scale-95"
          >
            {t('services.viewProject')}
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
