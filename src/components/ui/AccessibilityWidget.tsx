import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Settings = {
  fontSize: 0 | 1 | 2
  contrast: boolean
  grayscale: boolean
  links: boolean
  noAnim: boolean
}

const DEFAULT: Settings = { fontSize: 0, contrast: false, grayscale: false, links: false, noAnim: false }

function applySettings(s: Settings) {
  const html = document.documentElement
  html.classList.toggle('acc-large', s.fontSize === 1)
  html.classList.toggle('acc-larger', s.fontSize === 2)
  html.classList.toggle('acc-contrast', s.contrast)
  html.classList.toggle('acc-grayscale', s.grayscale)
  html.classList.toggle('acc-links', s.links)
  html.classList.toggle('acc-no-anim', s.noAnim)
}

export default function AccessibilityWidget() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('acc')
      return saved ? { ...DEFAULT, ...JSON.parse(saved) } : DEFAULT
    } catch {
      return DEFAULT
    }
  })

  useEffect(() => {
    applySettings(settings)
    localStorage.setItem('acc', JSON.stringify(settings))
  }, [settings])

  const toggle = (key: keyof Omit<Settings, 'fontSize'>) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))

  const reset = () => setSettings(DEFAULT)

  const fontSizeLabels = ['A', 'A+', 'A++']

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-24 start-4 z-[90] w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-dark"
        aria-label={t('accessibility.label')}
        aria-expanded={open}
      >
        <svg viewBox="0 0 100 100" className="w-7 h-7" fill="white" aria-hidden="true">
          <circle cx="67" cy="11" r="10"/>
          <path d="M58 20 L44 48 L54 48 L68 20 Z"/>
          <path d="M53 31 L27 43 L30 51 L58 39 Z"/>
          <rect x="62" y="20" width="8" height="32"/>
          <rect x="13" y="48" width="57" height="8"/>
          <rect x="13" y="56" width="8" height="20"/>
          <rect x="6" y="73" width="24" height="7" rx="2"/>
          <path fillRule="evenodd" d="M28,72 a28,28 0 1,0 56,0 a28,28 0 1,0 -56,0 M39,72 a17,17 0 1,1 34,0 a17,17 0 1,1 -34,0"/>
          <circle cx="17" cy="82" r="8"/>
        </svg>
      </button>

      {open && (
        <div
          className="fixed bottom-40 start-4 z-[91] w-72 bg-dark-card border border-dark-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-fade-in"
          role="dialog"
          aria-label={t('accessibility.title')}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border bg-dark-elevated">
            <span className="text-white font-semibold text-sm">{t('accessibility.title')}</span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors duration-150 p-1 rounded"
              aria-label={t('accessibility.close')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <p className="text-gray-400 text-xs mb-3">{t('accessibility.fontSize')}</p>
              <div className="flex gap-2">
                {([0, 1, 2] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setSettings(prev => ({ ...prev, fontSize: size }))}
                    className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all duration-200 ${
                      settings.fontSize === size
                        ? 'bg-gold border-gold text-dark'
                        : 'bg-dark-elevated border-dark-border text-white hover:border-gold/50'
                    }`}
                    aria-pressed={settings.fontSize === size}
                  >
                    {fontSizeLabels[size]}
                  </button>
                ))}
              </div>
            </div>

            {(
              [
                { key: 'contrast', label: t('accessibility.contrast') },
                { key: 'grayscale', label: t('accessibility.grayscale') },
                { key: 'links', label: t('accessibility.links') },
                { key: 'noAnim', label: t('accessibility.animations') },
              ] as { key: keyof Omit<Settings, 'fontSize'>; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  settings[key]
                    ? 'bg-gold/15 border-gold/50 text-gold'
                    : 'bg-dark-elevated border-dark-border text-gray-300 hover:border-gold/30'
                }`}
                aria-pressed={settings[key]}
              >
                <span>{label}</span>
                <div className={`w-10 h-5 rounded-full border-2 relative transition-all duration-200 ${
                  settings[key] ? 'bg-gold border-gold' : 'bg-dark border-gray-600'
                }`}>
                  <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200 ${
                    settings[key] ? 'start-5' : 'start-0.5'
                  }`} />
                </div>
              </button>
            ))}

            <button
              onClick={reset}
              className="w-full py-2.5 rounded-xl border border-dark-border text-gray-400 hover:text-white hover:border-gray-500 text-sm transition-all duration-200"
            >
              {t('accessibility.reset')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
