import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './ru'
import he from './he'

export type Language = 'he' | 'ru' | 'en'
export const SUPPORTED_LANGUAGES: Language[] = ['he', 'ru', 'en']
export const DEFAULT_LANGUAGE: Language = 'he'

export function getLanguageFromUrl(): Language {
  const path = window.location.pathname
  if (path.startsWith('/ru')) return 'ru'
  if (path.startsWith('/en')) return 'en'
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
