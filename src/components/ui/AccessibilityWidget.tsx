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
  document.querySelectorAll<HTMLVideoElement>('video').forEach(v => {
    s.noAnim ? v.pause() : v.play().catch(() => {})
  })
}

export default function AccessibilityWidget() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof localStorage === 'undefined') return DEFAULT // SSR / prerender guard
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
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-1 focus:ring-offset-dark"
        style={{ background: 'rgba(196,152,58,0.12)', border: '1.5px solid rgba(196,152,58,0.45)', color: '#C4983A' }}
        aria-label={t('accessibility.label')}
        aria-expanded={open}
      >
        <svg viewBox="0 0 100 100" className="h-5 w-5" fill="currentColor" aria-hidden="true">
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
          className="fixed left-2 right-2 top-16 sm:absolute sm:left-auto sm:right-auto sm:end-0 sm:top-full sm:mt-2 sm:w-72 z-[91] bg-dark-card border border-dark-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-fade-in"
          role="dialog"
          aria-label={t('accessibility.title')}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border bg-dark-section">
            <span className="text-ink font-semibold text-sm">{t('accessibility.title')}</span>
            <button
              onClick={() => setOpen(false)}
              className="text-ink-soft hover:text-ink transition-colors duration-150 p-1 rounded"
              aria-label={t('accessibility.close')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <p className="text-ink-soft text-xs mb-3">{t('accessibility.fontSize')}</p>
              <div className="flex gap-2">
                {([0, 1, 2] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setSettings(prev => ({ ...prev, fontSize: size }))}
                    className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all duration-200 ${
                      settings.fontSize === size
                        ? 'bg-gold border-gold text-dark'
                        : 'bg-dark-section border-dark-border text-ink-mid hover:border-gold/50'
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
                    ? 'bg-gold/12 border-gold/45 text-gold-dark'
                    : 'bg-white border-dark-border text-ink-mid hover:border-gold/35'
                }`}
                aria-pressed={settings[key]}
              >
                <span>{label}</span>
                <div className={`w-10 h-5 rounded-full border-2 relative transition-all duration-200 ${
                  settings[key] ? 'bg-gold border-gold' : 'bg-dark-section border-dark-border'
                }`}>
                  <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200 ${
                    settings[key] ? 'start-5 bg-white' : 'start-0.5 bg-ink-soft'
                  }`} />
                </div>
              </button>
            ))}

            <button
              onClick={reset}
              className="w-full py-2.5 rounded-xl border border-dark-border text-ink-mid hover:text-ink hover:border-ink-mid text-sm transition-all duration-200"
            >
              {t('accessibility.reset')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
