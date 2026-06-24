import { useTranslation } from 'react-i18next'

export default function GlassExplanation() {
  const { t } = useTranslation()

  const regularFeatures = t('glass.regularFeatures', { returnObjects: true }) as string[]
  const temperedFeatures = t('glass.temperedFeatures', { returnObjects: true }) as string[]

  return (
    <section className="py-24 lg:py-32 bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
            {t('glass.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            {t('glass.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('glass.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="relative rounded-2xl overflow-hidden bg-dark-card border border-dark-border min-h-64">
            <img
              src="/media/glass-comparison.webp"
              alt="Tempered vs Regular Glass"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <div className="grid grid-cols-2 gap-8 px-8 w-full">
                <div className="text-center">
                  <div className="text-5xl mb-3">💥</div>
                  <p className="text-red-400 text-sm font-medium">{t('glass.regularGlass')}</p>
                  <div className="mt-2 space-y-1">
                    {['⚠️', '⚠️', '⚠️'].map((e, i) => (
                      <div key={i} className="text-xs text-gray-500">{e}</div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-3">🛡️</div>
                  <p className="text-green-400 text-sm font-medium">{t('glass.temperedGlass')}</p>
                  <div className="mt-2 space-y-1">
                    {['✅', '✅', '✅'].map((e, i) => (
                      <div key={i} className="text-xs text-gray-500">{e}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-dark-card border border-red-900/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center">
                  <span className="text-red-400 text-lg">✕</span>
                </div>
                <h3 className="font-bold text-white">{t('glass.regularGlass')}</h3>
              </div>
              <ul className="space-y-3">
                {regularFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-dark-card border border-gold/30 rounded-2xl p-6 relative">
              <div className="absolute top-3 end-3">
                <span className="bg-gold/10 border border-gold/30 text-gold text-xs font-bold px-2 py-0.5 rounded-full">
                  Vitlion
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-gold text-lg">✓</span>
                </div>
                <h3 className="font-bold text-white">{t('glass.temperedGlass')}</h3>
              </div>
              <ul className="space-y-3">
                {temperedFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="sm:col-span-2">
              <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 text-center">
                <span className="text-gold font-semibold text-sm">✓ {t('glass.cta')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
