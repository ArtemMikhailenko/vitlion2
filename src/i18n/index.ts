import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './ru'
import he from './he'

export type Language = 'he' | 'ru'
export const SUPPORTED_LANGUAGES: Language[] = ['he', 'ru']
export const DEFAULT_LANGUAGE: Language = 'he'

export function getLanguageFromUrl(): Language {
  const params = new URLSearchParams(window.location.search)
  const lang = params.get('lang') as Language
  return SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE
}

export function setLanguageInUrl(lang: Language) {
  const url = new URL(window.location.href)
  url.searchParams.set('lang', lang)
  window.history.replaceState({}, '', url.toString())
}

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    he: { translation: he },
  },
  lng: getLanguageFromUrl(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
})

export default i18n
