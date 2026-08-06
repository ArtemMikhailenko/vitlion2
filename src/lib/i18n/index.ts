import he from '@/i18n/he'
import ru from '@/i18n/ru'

export type Lang = 'he' | 'ru'

export const LANGS = ['he', 'ru'] as const satisfies readonly Lang[]
export const DEFAULT_LANG: Lang = 'he'

export type Dictionary = typeof he

const DICTIONARIES: Record<Lang, Dictionary> = { he, ru: ru as Dictionary }

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang]
}

/** Text direction for a language. Hebrew is RTL. */
export function dirOf(lang: Lang): 'rtl' | 'ltr' {
  return lang === 'he' ? 'rtl' : 'ltr'
}

/**
 * URL prefix for a language. Hebrew is the unprefixed default (`/services`),
 * Russian lives under `/ru` (`/ru/services`). Keep in sync with the app router
 * tree — these URLs are already indexed and must not change.
 */
export function prefixOf(lang: Lang): '' | '/ru' {
  return lang === 'he' ? '' : '/ru'
}

/** Absolute path for a route in a given language. `path` has no leading slash. */
export function localePath(lang: Lang, path = ''): string {
  const clean = path ? `/${path}` : ''
  return `${prefixOf(lang)}${clean}` || '/'
}

/**
 * Mirrors the react-i18next `t` signature closely enough to be a drop-in
 * replacement. Returns `any` because callers legitimately read strings,
 * string[] and object[] out of the dictionary (the old code passed
 * `{ returnObjects: true }` for those — that option is now accepted and
 * ignored, since a plain object lookup already returns the raw value).
 */
export type TFunction = (path: string, options?: unknown) => any

function lookup(dict: Dictionary, path: string): unknown {
  let node: unknown = dict
  for (const key of path.split('.')) {
    if (node === null || typeof node !== 'object') return undefined
    node = (node as Record<string, unknown>)[key]
  }
  return node
}

export function createT(dict: Dictionary): TFunction {
  return (path: string) => {
    const value = lookup(dict, path)
    // Same fallback behaviour as i18next: an unresolved key renders as itself,
    // which makes missing translations obvious instead of rendering blank.
    return value === undefined ? path : value
  }
}

/** Server-side translator. Use inside Server Components / generateMetadata. */
export function getT(lang: Lang): TFunction {
  return createT(getDictionary(lang))
}
