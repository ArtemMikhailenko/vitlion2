import { useTranslation } from 'react-i18next'
import { useInView } from '../../hooks/useInView'

export default function Testimonials() {
  const { t } = useTranslation()
  const [gridRef, inView] = useInView({ threshold: 0.05 })
  const [headRef, headInView] = useInView({ threshold: 0.2 })

  const items = t('testimonials.items', { returnObjects: true }) as Array<{
    name: string
    city: string
    rating: number
    text: string
  }>

  return (
    <section className="py-24 lg:py-32 bg-dark-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headRef as React.RefObject<HTMLDivElement>}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4"
            style={{
              opacity: headInView ? 1 : 0,
              transform: headInView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            {t('testimonials.badge')}
          </span>
          <div className="overflow-hidden">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5"
              style={{
                opacity: headInView ? 1 : 0,
                transform: headInView ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
                transitionDelay: '100ms',
              }}
            >
              {t('testimonials.title')}
            </h2>
          </div>
          <p
            className="text-gray-400 text-lg max-w-xl mx-auto"
            style={{
              opacity: headInView ? 1 : 0,
              transform: headInView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '200ms',
            }}
          >
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {Array.isArray(items) && items.map((item, i) => (
            <div
              key={i}
              className="bg-dark-card border border-dark-border hover:border-gold/30 rounded-2xl p-6 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/5"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(32px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s',
                transitionDelay: inView ? `${i * 100}ms` : '0ms',
              }}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: item.rating }).map((_, s) => (
                  <svg key={s} className="w-4 h-4 text-gold fill-gold" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed flex-1">
                "{item.text}"
              </p>
              <div className="mt-5 pt-4 border-t border-dark-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{item.name}</div>
                  <div className="text-gray-500 text-xs">{item.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
