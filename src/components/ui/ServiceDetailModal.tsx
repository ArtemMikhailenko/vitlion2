import { useEffect, useState } from 'react'
import { X, Check, ChevronLeft, ChevronRight, ArrowRight, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ServiceItem } from '../../types'

interface Props {
  service: ServiceItem | null
  onClose: () => void
  relatedServices?: ServiceItem[]
  onSelectService?: (s: ServiceItem) => void
}

export default function ServiceDetailModal({ service, onClose, relatedServices, onSelectService }: Props) {
  const { t, i18n } = useTranslation()
  const [activeImg, setActiveImg] = useState(0)
  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const lang = i18n.resolvedLanguage === 'ru' ? 'ru' : 'he'

  useEffect(() => {
    if (!service) return
    setActiveImg(0)
    setImageViewerOpen(false)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [service])

  useEffect(() => {
    if (!service) return
    const galleryLength = service.gallery?.length ?? 1
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (imageViewerOpen) { setImageViewerOpen(false); return }
        onClose()
      }
      if (e.key === 'ArrowRight') setActiveImg(i => Math.min(i + 1, galleryLength - 1))
      if (e.key === 'ArrowLeft') setActiveImg(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [imageViewerOpen, service, onClose])

  if (!service) return null

  const name = service.name[lang]
  const description = service.description[lang]
  const features = service.features[lang]
  const gallery = service.gallery ?? [service.mainImage]
  const currentImg = gallery[activeImg] ?? service.mainImage
  const showPreviousImage = () => setActiveImg(i => Math.max(i - 1, 0))
  const showNextImage = () => setActiveImg(i => Math.min(i + 1, gallery.length - 1))

  return (
    <div
      className="fixed inset-0 z-[60] flex items-stretch justify-center overflow-hidden p-0"
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 flex h-dvh w-full flex-col overflow-hidden">
        {/* Image */}
        <div
          className="relative h-[52dvh] min-h-[300px] shrink-0 overflow-hidden sm:h-[58dvh] lg:h-[54dvh]"
          style={{ boxShadow: '0 34px 90px rgba(0,0,0,0.34)' }}
        >
          <img
            src={currentImg}
            alt={name}
            className="w-full h-full object-cover transition-all duration-500"
            loading="lazy"
          />
          <button
            type="button"
            onClick={() => setImageViewerOpen(true)}
            className="absolute inset-0 z-[1] cursor-zoom-in"
            aria-label="Open image viewer"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,10,14,0.34), rgba(8,10,14,0.04) 48%, rgba(8,10,14,0.25))' }} />
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: 'linear-gradient(90deg, transparent 8%, #C4983A 42%, #E8C568 58%, transparent 92%)' }}
          />

          <button
            onClick={onClose}
            className="absolute end-4 top-4 z-[2] flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-150 hover:rotate-90 hover:scale-105"
            style={{ background: 'rgba(10,12,16,0.58)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)' }}
            aria-label={t('accessibility.close')}
          >
            <X className="h-4 w-4" strokeWidth={2.25} />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                onClick={showPreviousImage}
                disabled={activeImg === 0}
                className="absolute start-4 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-150 hover:scale-110 disabled:opacity-25 sm:start-6"
                style={{ background: 'rgba(10,12,16,0.58)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" strokeWidth={2.5} />
              </button>
              <button
                onClick={showNextImage}
                disabled={activeImg === gallery.length - 1}
                className="absolute end-4 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-150 hover:scale-110 disabled:opacity-25 sm:end-6"
                style={{ background: 'rgba(10,12,16,0.58)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" strokeWidth={2.5} />
              </button>
            </>
          )}

          {gallery.length > 1 && (
            <div
              className="absolute bottom-3 start-3 z-[2] inline-flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5 rounded-xl p-1.5 sm:bottom-4 sm:start-4"
              style={{ background: 'rgba(6,8,12,0.88)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActiveImg(i) }}
                  className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-black transition-all duration-200 hover:opacity-100 sm:h-11 sm:w-16"
                  style={{
                    border: i === activeImg ? '2px solid #E8C568' : '1px solid rgba(255,255,255,0.25)',
                    opacity: i === activeImg ? 1 : 0.65,
                  }}
                  aria-label={`${i + 1} / ${gallery.length}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {imageViewerOpen && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
            <img src={currentImg} alt={name} className="h-full w-full object-contain" />
            <button
              onClick={() => setImageViewerOpen(false)}
              className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-white transition-all duration-150 hover:rotate-90 hover:scale-105 sm:end-6 sm:top-6"
              style={{ background: 'rgba(10,12,16,0.68)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)' }}
              aria-label={t('accessibility.close')}
            >
              <X className="h-5 w-5" strokeWidth={2.25} />
            </button>
            {gallery.length > 1 && (
              <>
                <button
                  onClick={showPreviousImage}
                  disabled={activeImg === 0}
                  className="absolute start-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-150 hover:scale-110 disabled:opacity-25 sm:start-6"
                  style={{ background: 'rgba(10,12,16,0.68)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)' }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 rtl:rotate-180" strokeWidth={2.5} />
                </button>
                <button
                  onClick={showNextImage}
                  disabled={activeImg === gallery.length - 1}
                  className="absolute end-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all duration-150 hover:scale-110 disabled:opacity-25 sm:end-6"
                  style={{ background: 'rgba(10,12,16,0.68)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)' }}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 rtl:rotate-180" strokeWidth={2.5} />
                </button>
                <div
                  className="absolute bottom-4 left-1/2 inline-flex max-w-[calc(100%-2rem)] -translate-x-1/2 flex-wrap justify-center gap-1.5 rounded-2xl p-1.5 sm:bottom-6"
                  style={{ background: 'rgba(10,12,16,0.58)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)' }}
                >
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className="h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-black transition-all duration-200 hover:opacity-100"
                      style={{
                        border: i === activeImg ? '2px solid #E8C568' : '1px solid rgba(255,255,255,0.28)',
                        opacity: i === activeImg ? 1 : 0.68,
                        boxShadow: i === activeImg ? '0 0 0 2px rgba(196,152,58,0.3)' : 'none',
                      }}
                      aria-label={`${i + 1} / ${gallery.length}`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8 pt-5 sm:px-8 lg:px-12"
          style={{ background: 'rgba(10,12,16,0.86)', backdropFilter: 'blur(18px)' }}
        >
          {/* Похожие решения */}
          {relatedServices && relatedServices.length > 0 && (
            <div className="mx-auto w-full max-w-7xl mb-5">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-white/45">
                {lang === 'ru' ? 'Похожие решения' : 'פתרונות דומים'}
              </p>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {relatedServices.slice(0, 4).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectService?.(s)}
                    className="group flex w-36 shrink-0 flex-col overflow-hidden rounded-xl text-start transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ backgroundColor: '#13161F', border: '1px solid #23263A' }}
                  >
                    <div className="h-20 w-full overflow-hidden">
                      <img
                        src={s.mainImage}
                        alt={s.name[lang]}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    </div>
                    <p className="px-2.5 py-2 text-[11px] font-semibold leading-snug text-ink group-hover:text-gold transition-colors duration-200 line-clamp-2">
                      {s.name[lang]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)] lg:gap-8">
            <div>
              <h2 className="mb-2 text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">{name}</h2>
              <p className="text-[13px] leading-6 text-white/74 sm:text-sm">{description}</p>
            </div>
            <div>
              {features.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/50">{t('services.features')}</p>
                  <ul className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2 lg:grid-cols-1">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] leading-5 text-white/72">
                        <Check className="mt-1 h-3 w-3 shrink-0 text-white/45" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* CTA buttons */}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  href="#contact"
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-[13px] font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #C4983A 0%, #E8C568 50%, #C4983A 100%)', color: '#1C1F26', boxShadow: '0 4px 20px rgba(196,152,58,0.35)' }}
                >
                  {lang === 'ru' ? 'Получить консультацию' : 'קבל ייעוץ'}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" strokeWidth={2.5} />
                </a>
                <a
                  href="https://wa.me/972522324036"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-[13px] font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: '#0C0E14', border: '1px solid #25D366', color: '#25D366' }}
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
