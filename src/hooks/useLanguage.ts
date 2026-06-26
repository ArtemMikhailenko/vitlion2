import { useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { type Language, getLanguageFromUrl, setLanguageInUrl } from '../i18n'

export function useLanguage() {
  const { i18n } = useTranslation()

  // Use i18n.language as single source of truth — reactive across all components.
  // useState per-component caused stale lang in Footer when Header switched language.
  const lang = (i18n.resolvedLanguage ?? i18n.language) as Language

  const switchLanguage = useCallback(
    (newLang: Language) => {
      setLanguageInUrl(newLang)
      i18n.changeLanguage(newLang)
    },
    [i18n]
  )

  useEffect(() => {
    const dir = lang === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  // Sync i18n with URL on mount (handles direct URL navigation)
  useEffect(() => {
    const urlLang = getLanguageFromUrl()
    if (urlLang !== i18n.resolvedLanguage) {
      i18n.changeLanguage(urlLang)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { lang, switchLanguage, isRTL: lang === 'he' }
}
