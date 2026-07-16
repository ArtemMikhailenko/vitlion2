import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { CATEGORIES } from '../../data/services'
import { useInView } from '../../hooks/useInView'
import ShimmerHeading from '../ui/ShimmerHeading'
import CategoryModal from '../ui/CategoryModal'
import BeforeAfterSlider from '../ui/BeforeAfterSlider'
import type { ServiceCategory } from '../../types'
import { useLanguage } from '../../hooks/useLanguage'

const CATEGORY_BA: Record<string, { before: string; after: string }> = {
  'electric-pergolas': { before: '/media/before-after/pergola-electric-after.png',    after: '/media/before-after/pergola-electric-before.png' },
  'static-pergolas':   { before: '/media/before-after/pergola-static-before.png',     after: '/media/before-after/pergola-static-after.jpg' },
  'zip-shutters':      { before: '/media/before-after/zip-shutters-before.png',       after: '/media/before-after/zip-shutters-after.png' },
  'glass-roofs':       { before: '/media/before-after/glass-roofs-before.png', after: '/media/before-after/glass-roofs-after.png' },
  'glazing':           { before: '/media/before-after/frameless-glazing-before.png',  after: '/media/before-after/frameless-glazing-after.jpg' },
}

function CategoryCard({ category, index, inView, onClick, lang }: {
  category: ServiceCategory
  index: number
  inView: boolean
  onClick: () => void
  lang: 'he' | 'ru'
}) {
  const { t } = useTranslation()
  const pair = CATEGORY_BA[category.slug]

  return (
    <button
      type="button"
      className="group relative w-full bg-dark-card border border-dark-border rounded-2xl overflow-hidden text-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-0 appearance-none flex flex-col"
      style={{
        opacity: inView ? 1 : 0,
        boxShadow: '0 2px 12px rgba(196,152,58,0.06)',
        ...(inView ? {} : { transform: 'translateY(36px)' }),
        transition: `opacity 0.6s ease ${index * 100}ms, transform 0.4s ease ${index * 100}ms, box-shadow 0.3s, border-color 0.3s`,
      }}
      onClick={onClick}
    >
      {/* Image / before-after area */}
      <div className="relative h-52 overflow-hidden">
        {pair ? (
          <BeforeAfterSlider before={pair.before} after={pair.after} />
        ) : (
          <img
            src={category.mainImage}
            alt={category.name[lang]}
            className="block w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading={index < 2 ? 'eager' : 'lazy'}
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-gold transition-colors duration-200">
          {category.name[lang]}
        </h3>
        <p className="text-ink-mid text-sm leading-relaxed mb-4">{category.short[lang]}</p>
        <span className="text-gold text-sm font-semibold flex items-center gap-1.5 group-hover:gap-3 transition-all duration-200">
          {t('services.learnMore')}
          <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </div>
    </button>
  )
}

export default function Services({ hideHeader }: { hideHeader?: boolean } = {}) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const { categorySlug } = useParams<{ categorySlug?: string }>()
  const [gridRef, inView] = useInView({ threshold: 0.05 })
  const displayLang = i18n.resolvedLanguage === 'ru' ? 'ru' : 'he'
  const prefix = lang === 'he' ? '' : `/${lang}`

  const activeCategory = categorySlug ? (CATEGORIES.find(c => c.slug === categorySlug) ?? null) : null

  const openCategory = (category: ServiceCategory) => {
    navigate(`${prefix}/category/${category.slug}`)
  }

  const closeCategory = () => {
    navigate(prefix || '/')
  }

  return (
    <>
      <section id="services" className="py-24 lg:py-32 bg-dark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!hideHeader && (
            <div className="text-center mb-16">
              <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
                {t('services.badge')}
              </span>
              <ShimmerHeading className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5">
                {t('services.title')}
              </ShimmerHeading>
              <p className="text-ink-mid text-lg max-w-2xl mx-auto">{t('services.subtitle')}</p>
            </div>
          )}

          <div ref={gridRef as React.RefObject<HTMLDivElement>}>
            {/* Top row: 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {CATEGORIES.slice(0, 3).map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  inView={inView}
                  lang={displayLang}
                  onClick={() => openCategory(category)}
                />
              ))}
            </div>
            {/* Bottom row: 2 columns centered under the 3 above */}
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-6">
              {CATEGORIES.slice(3).map((category, index) => (
                <div key={category.id} className="w-full sm:w-[calc((100%-3rem)/3)]">
                  <CategoryCard
                    category={category}
                    index={index + 3}
                    inView={inView}
                    lang={displayLang}
                    onClick={() => openCategory(category)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CategoryModal category={activeCategory} onClose={closeCategory} />
    </>
  )
}
