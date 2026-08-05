import type { Language } from '../../types'

interface Props {
  lang: Language
  onSwitch: (lang: Language) => void
}

export default function LanguageSwitcher({ lang, onSwitch }: Props) {
  return (
    <div className="flex items-center gap-1 bg-dark-elevated rounded-full p-1">
      <button
        onClick={() => onSwitch('he')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
          lang === 'he'
            ? 'bg-gold text-dark font-bold'
            : 'text-ink-mid hover:text-ink'
        }`}
        aria-label="Switch to Hebrew"
      >
        עב
      </button>
      <button
        onClick={() => onSwitch('ru')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
          lang === 'ru'
            ? 'bg-gold text-dark font-bold'
            : 'text-ink-mid hover:text-ink'
        }`}
        aria-label="Switch to Russian"
      >
        RU
      </button>
    </div>
  )
}
