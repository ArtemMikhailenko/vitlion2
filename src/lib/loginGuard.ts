import 'server-only'

/**
 * Slows down password guessing against /admin/login.
 *
 * The login form was unthrottled: a script could try passwords as fast as the
 * server would answer, and scrypt makes each attempt cheap for the attacker and
 * expensive for us. This caps a single address at a handful of tries.
 *
 * State lives in module memory rather than the database. That is a deliberate
 * trade: it costs no query on the hot path, it cannot fail the login when the
 * database is down, and a restart or a second instance simply resets the count
 * — which matters far less than the fact that a sustained attack from one
 * address now takes hours instead of minutes. The panel has one user; a
 * distributed attack against it is not the threat model.
 */

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8

interface Bucket {
  count: number
  firstAt: number
}

const buckets = new Map<string, Bucket>()

/** Keeps the map from growing without bound on a long-lived process. */
function sweep(now: number) {
  if (buckets.size < 500) return
  for (const [key, bucket] of buckets) {
    if (now - bucket.firstAt > WINDOW_MS) buckets.delete(key)
  }
}

export interface GuardResult {
  allowed: boolean
  /** Minutes until the block lifts, when blocked. */
  retryInMinutes: number
}

export function checkLoginAllowed(key: string): GuardResult {
  const now = Date.now()
  sweep(now)

  const bucket = buckets.get(key)
  if (!bucket || now - bucket.firstAt > WINDOW_MS) {
    return { allowed: true, retryInMinutes: 0 }
  }

  if (bucket.count < MAX_ATTEMPTS) return { allowed: true, retryInMinutes: 0 }

  return {
    allowed: false,
    retryInMinutes: Math.max(1, Math.ceil((WINDOW_MS - (now - bucket.firstAt)) / 60000)),
  }
}

export function recordFailedLogin(key: string): void {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.firstAt > WINDOW_MS) {
    buckets.set(key, { count: 1, firstAt: now })
    return
  }
  bucket.count += 1
}

/** A success clears the counter, so a typo does not linger against the owner. */
export function clearLoginAttempts(key: string): void {
  buckets.delete(key)
}
