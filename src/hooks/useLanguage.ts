import { useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { type Language } from '../i18n'

export function useLanguage() {
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const lang: Language = location.pathname.startsWith('/ru') ? 'ru' : 'he'

  useEffect(() => {
    if (lang !== i18n.resolvedLanguage) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  const switchLanguage = useCallback(
    (newLang: Language) => {
      const cleanPath = location.pathname.replace(/^\/ru/, '') || '/'
      const newPath = newLang === 'he' ? cleanPath : `/${newLang}${cleanPath}`
      navigate(newPath + location.search)
      i18n.changeLanguage(newLang)
    },
    [i18n, location, navigate]
  )

  return { lang, switchLanguage, isRTL: lang === 'he' }
}
