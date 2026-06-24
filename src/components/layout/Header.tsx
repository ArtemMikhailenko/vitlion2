import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import type { Language } from '../../types'

interface Props {
  lang: Language
  onSwitchLang: (lang: Language) => void
}

export default function Header({ lang, onSwitchLang }: Props) {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const langParam = `?lang=${lang}`
  const navItems = [
    { key: 'services', href: `/services${langParam}` },
    { key: 'about', href: `/${langParam}#why-us` },
    { key: 'gallery', href: `/projects${langParam}` },
    { key: 'contact', href: `/contact${langParam}` },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark/95 backdrop-blur-md border-b border-dark-border shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#">
            <img src="/logo.svg" alt="Vitlion Group" className="h-9 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-gray-300 hover:text-gold transition-colors duration-200 text-sm font-medium tracking-wide"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher lang={lang} onSwitch={onSwitchLang} />
            <a
              href={`/contact${langParam}`}
              className="hidden md:inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-dark font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 text-sm"
            >
              {t('nav.callUs')}
            </a>
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-dark-card border-t border-dark-border">
          <nav className="px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-gray-300 hover:text-gold py-2 text-base font-medium border-b border-dark-border"
                onClick={() => setMenuOpen(false)}
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
            <a
              href={`/contact${langParam}`}
              className="inline-flex items-center justify-center bg-gold text-dark font-semibold px-5 py-3 rounded-lg mt-2"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.callUs')}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
