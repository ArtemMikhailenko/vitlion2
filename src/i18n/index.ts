import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './ru'
import he from './he'

export type Language = 'he' | 'ru'
export const SUPPORTED_LANGUAGES: Language[] = ['he', 'ru']
export const DEFAULT_LANGUAGE: Language = 'he'

export function getLanguageFromUrl(): Language {
  // Guard for SSR / prerender (no `window` in Node).
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  const path = window.location.pathname
  if (path.startsWith('/ru')) return 'ru'
  return 'he'
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
