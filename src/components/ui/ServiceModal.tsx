import { useEffect, useState } from 'react'
import { X, Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[88dvh] overflow-y-auto overscroll-contain rounded-t-3xl sm:rounded-2xl shadow-2xl"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4DECC',
          boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        }}
      >
        {/* Gold accent line at top */}
        <div className="h-0.5 w-full rounded-t-3xl sm:rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, #C4983A 40%, #E8C568 60%, transparent)' }} />

        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b"
          style={{ backgroundColor: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', borderColor: '#E4DECC' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 rounded-full bg-gold" />
            <h2 className="text-base font-bold tracking-wide" style={{ color: '#1A1D24' }}>{name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-soft hover:text-ink transition-all duration-150 hover:rotate-90"
            style={{ background: '#F7F4EF', border: '1px solid #E4DECC' }}
            aria-label={t('accessibility.close')}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Image */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img
            src={currentImg}
            alt={name}
            className="w-full h-full object-cover transition-all duration-500"
            loading="lazy"
          />
          {/* Very subtle bottom vignette only */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(30,33,40,0.55) 0%, transparent 45%)' }} />

          {/* Nav arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg(i => Math.max(i - 1, 0))}
                disabled={activeImg === 0}
                className="absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-20 transition-all duration-150 hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setActiveImg(i => Math.min(i + 1, gallery.length - 1))}
                disabled={activeImg === gallery.length - 1}
                className="absolute end-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-20 transition-all duration-150 hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2.5} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImg ? 'w-6 bg-gold' : 'w-1.5 bg-white/35 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {gallery.length > 1 && (
          <div className="flex gap-2 px-5 pt-3 overflow-x-auto">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className="shrink-0 w-14 h-10 rounded-lg overflow-hidden transition-all duration-200"
                style={{
                  border: i === activeImg ? '2px solid #C4983A' : '2px solid rgba(255,255,255,0.08)',
                  opacity: i === activeImg ? 1 : 0.55,
                  boxShadow: i === activeImg ? '0 0 0 1px rgba(196,152,58,0.3)' : 'none',
                }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="px-5 pt-5 pb-6 space-y-5">
          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(196,152,58,0.35), transparent)' }} />
            <div className="w-1 h-1 rounded-full bg-gold/40" />
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: '#52566B' }}>{description}</p>

          {/* Features */}
          {Array.isArray(features) && features.length > 0 && (
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: 'rgba(196,152,58,0.06)', border: '1px solid rgba(196,152,58,0.18)' }}
            >
              <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-3">{t('services.features')}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#52566B' }}>
                    <Check className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <a
            href="#contact"
            onClick={onClose}
            className="flex items-center justify-center gap-2.5 w-full font-bold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #C4983A 0%, #E8C568 50%, #C4983A 100%)',
              backgroundSize: '200% 100%',
              color: '#1C1F26',
              boxShadow: '0 4px 20px rgba(196,152,58,0.35)',
            }}
          >
            {t('services.viewProject')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  )
}
