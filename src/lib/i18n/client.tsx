'use client'

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createT, type Dictionary, type Lang, type TFunction } from './index'

interface I18nValue {
  lang: Lang
  t: TFunction
}

const I18nContext = createContext<I18nValue | null>(null)

/**
 * Supplies the active language + dictionary to Client Components.
 * The dictionary is resolved on the server (in the root layout) and passed
 * down, so there is exactly one source of truth for the language: the URL.
 */
export function I18nProvider({
  lang,
  dictionary,
  children,
}: {
  lang: Lang
  dictionary: Dictionary
  children: ReactNode
}) {
  const value = useMemo<I18nValue>(() => ({ lang, t: createT(dictionary) }), [lang, dictionary])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation/useLanguage must be used inside <I18nProvider>')
  return ctx
}

/**
 * Drop-in replacement for react-i18next's `useTranslation()`.
 * Keeps the `{ t, i18n }` shape so ported components need only change the
 * import path. `i18n.resolvedLanguage` is the route language — it can no
 * longer drift out of sync with the URL the way the i18next instance could.
 */
export function useTranslation() {
  const { lang, t } = useI18n()
  return useMemo(
    () => ({ t, i18n: { language: lang, resolvedLanguage: lang, dir: () => (lang === 'he' ? 'rtl' : 'ltr') } }),
    [t, lang],
  )
}

/** Route-derived language plus a switcher that preserves the current path. */
export function useLanguage() {
  const { lang } = useI18n()
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = useCallback(
    (next: Lang) => {
      const bare = (pathname || '/').replace(/^\/ru(?=\/|$)/, '') || '/'
      const target = next === 'he' ? bare : bare === '/' ? '/ru' : `/ru${bare}`
      router.push(target)
    },
    [pathname, router],
  )

  return { lang, switchLanguage, isRTL: lang === 'he' }
}
