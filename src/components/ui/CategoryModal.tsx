import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import type { ServiceCategory, ServiceItem } from '../../types'
import ServiceDetailModal from './ServiceDetailModal'
import { CATEGORIES } from '../../data/services'

interface Props {
  category: ServiceCategory | null
  onClose: () => void
}

export default function CategoryModal({ category, onClose }: Props) {
  const { t, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const lang = i18n.resolvedLanguage === 'ru' ? 'ru' : 'he'

  const serviceSlug = category ? searchParams.get('service') : null
  const allServices = CATEGORIES.flatMap(c => c.services)
  const activeService: ServiceItem | null = serviceSlug
    ? (allServices.find(s => s.slug === serviceSlug) ?? null)
    : null

  const activeServiceCategory = activeService
    ? (CATEGORIES.find(c => c.services.some(s => s.id === activeService.id)) ?? category)
    : category

  const categoryServices = activeServiceCategory?.services ?? category?.services ?? []

  const openService = (service: ServiceItem) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev)
      p.set('service', service.slug)
      return p
    })
  }

  const closeService = () => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev)
      p.delete('service')
      return p
    })
  }

  useEffect(() => {
    if (!category) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [category])

  useEffect(() => {
    if (!category) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeService) closeService()
        else onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [category, activeService, onClose])

  if (!category) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label={category.name[lang]}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

        <div
          className="relative z-10 w-full sm:max-w-3xl max-h-[92dvh] sm:max-h-[85dvh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
          style={{ backgroundColor: '#13161F', border: '1px solid #23263A' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-5 shrink-0"
            style={{ borderBottom: '1px solid #23263A' }}
          >
            <div>
              <h2 className="text-xl font-bold text-ink">{category.name[lang]}</h2>
              <p className="text-ink-mid text-sm mt-0.5">{category.short[lang]}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-mid transition-all duration-150 hover:rotate-90 hover:text-ink"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              aria-label={t('accessibility.close')}
            >
              <X className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>

          {/* Services grid */}
          <div className="overflow-y-auto flex-1 p-5 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {category.services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => openService(service)}
                  className="group flex flex-col overflow-hidden rounded-2xl text-start transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ backgroundColor: '#0C0E14', border: '1px solid #23263A' }}
                >
                  <div className="relative h-36 sm:h-44 overflow-hidden">
                    <img
                      src={service.mainImage}
                      alt={service.name[lang]}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(12,14,20,0.55) 0%, transparent 60%)' }}
                    />
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-[13px] font-semibold text-ink leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
                      {service.name[lang]}
                    </p>
                    <p className="text-[11px] text-ink-mid mt-1 leading-snug line-clamp-2">
                      {service.short[lang]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ServiceDetailModal
        service={activeService}
        onClose={closeService}
        categoryServices={categoryServices}
        onSelectService={openService}
        categoryName={activeServiceCategory?.name[lang]}
      />
    </>
  )
}
