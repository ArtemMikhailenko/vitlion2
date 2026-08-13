/**
 * Storage access that never throws.
 *
 * Browsers reject localStorage/sessionStorage outright in several ordinary
 * situations — third-party cookies blocked, private windows, embedded frames,
 * quota exhausted — and the failure is a thrown SecurityError, not a null
 * return. A `typeof storage === 'undefined'` check does not help, because the
 * object exists and only the access throws.
 *
 * That mattered here: an unguarded `setItem` ran inside a hydration effect, and
 * a throw there tears down the whole React tree, leaving the page rendered but
 * unstyled and non-interactive.
 */

type StorageKind = 'local' | 'session'

function store(kind: StorageKind): Storage | null {
  try {
    const s = kind === 'local' ? window.localStorage : window.sessionStorage
    // Touching a property is enough to trigger the SecurityError when blocked.
    void s.length
    return s
  } catch {
    return null
  }
}

export function readStorage(kind: StorageKind, key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return store(kind)?.getItem(key) ?? null
  } catch {
    return null
  }
}

export function writeStorage(kind: StorageKind, key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    store(kind)?.setItem(key, value)
  } catch {
    // Persisting a UI preference is best-effort; losing it must never break the page.
  }
}
