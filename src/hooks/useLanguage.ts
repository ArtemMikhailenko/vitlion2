import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { type Language, getLanguageFromUrl, setLanguageInUrl } from '../i18n'

export function useLanguage() {
  const { i18n } = useTranslation()
  const [lang, setLang] = useState<Language>(getLanguageFromUrl())

  const switchLanguage = useCallback(
    (newLang: Language) => {
      setLang(newLang)
      setLanguageInUrl(newLang)
      i18n.changeLanguage(newLang)
    },
    [i18n]
  )

  useEffect(() => {
    const currentLang = getLanguageFromUrl()
    const dir = currentLang === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = currentLang
    document.documentElement.dir = dir
    document.documentElement.setAttribute('data-lang', currentLang)
  }, [lang])

  return { lang, switchLanguage, isRTL: lang === 'he' }
}
