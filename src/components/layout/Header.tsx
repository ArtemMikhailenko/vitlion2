import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import AccessibilityWidget from '../ui/AccessibilityWidget'
import type { Language } from '../../types'

interface Props {
  lang: Language
  onSwitchLang: (lang: Language) => void
}

export default function Header({ lang, onSwitchLang }: Props) {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const prefix = lang === 'he' ? '' : `/${lang}`
  const basePath = location.pathname.replace(/^\/ru/, '') || '/'
  const isHome = basePath === '/'
  const solid = scrolled || !isHome

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  const navItems = [
    { key: 'home',     href: `${prefix}/` },
    { key: 'services', href: `${prefix}/services` },
    { key: 'about',    href: `${prefix}/about` },
    { key: 'gallery',  href: `${prefix}/projects` },
    { key: 'contact',  href: `${prefix}/contact` },
  ]

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={solid ? {
        backgroundColor: 'rgba(13, 15, 22, 0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #23263A',
        boxShadow: '0 2px 20px rgba(0,0,0,0.3), 0 1px 0 rgba(196,152,58,0.10)',
      } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href={`${prefix}/`} className="flex items-center gap-3 group">
            <img
              src="/vitlion-without-background.png"
              alt="Vitlion Group"
              className="h-10 w-auto"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-bold tracking-[0.18em] text-[14px] uppercase transition-colors duration-200 group-hover:text-gold text-ink">
                VITLION <span className="text-gold">GROUP</span>
              </span>
              <span className="text-gold/60 text-[9px] tracking-widest mt-0.5" dir="rtl">
                עבודות אלומיניום וזכוכית
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="transition-colors duration-200 text-sm font-medium tracking-wide text-ink hover:text-gold"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <AccessibilityWidget />
            <LanguageSwitcher lang={lang} onSwitch={onSwitchLang} />
            <a
              href={`${prefix}/contact`}
              className="hidden md:inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 text-sm hover:scale-105 active:scale-95"
            >
              {t('nav.callUs')}
            </a>
            <button
              className="md:hidden p-2 text-ink transition-colors duration-200 hover:text-gold"
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
        <div className="md:hidden shadow-lg" style={{ backgroundColor: '#13161F', borderTop: '1px solid #23263A' }}>
          <nav className="px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-ink-mid hover:text-gold py-3 px-2 text-base font-medium border-b border-dark-border/60 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
            <a
              href={`${prefix}/contact`}
              className="inline-flex items-center justify-center bg-gold hover:bg-gold-light text-ink font-semibold px-5 py-3 rounded-lg mt-3 transition-all duration-200"
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
