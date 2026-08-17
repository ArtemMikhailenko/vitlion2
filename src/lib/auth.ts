import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>

/**
 * Password hashing and session signing on Node's built-in crypto.
 *
 * bcrypt and argon2 both ship native binaries, which are a common source of
 * install failures on shared hosting — the same class of problem that has
 * already bitten this deployment. scrypt is in the standard library, is a
 * memory-hard KDF, and needs nothing compiled.
 */

const KEY_LENGTH = 64
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // one week

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derived = await scrypt(password, salt, KEY_LENGTH)
  return `${salt}:${derived.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(':')
  if (!salt || !key) return false

  const derived = await scrypt(password, salt, KEY_LENGTH)
  const expected = Buffer.from(key, 'hex')

  // Length must match before timingSafeEqual, which throws on a mismatch.
  if (expected.length !== derived.length) return false
  return timingSafeEqual(expected, derived)
}

/**
 * Key used to sign session cookies.
 *
 * Prefers an explicit AUTH_SECRET. Falls back to deriving one from
 * DATABASE_URL, which is already present and already a secret — the Hostinger
 * panel would not accept a sixth environment variable, and there is no reason
 * to let that block logging in.
 *
 * The derivation is domain-separated by a fixed label so the resulting key is
 * unrelated to the connection string itself, and it is stable across restarts
 * and deploys, which a random per-boot key would not be. Rotating the database
 * password invalidates existing sessions; everyone simply logs in again.
 *
 * An explicit AUTH_SECRET is still preferable — it keeps the two concerns
 * independent — so set one whenever the platform allows it.
 */
function secret(): string {
  const explicit = process.env.AUTH_SECRET
  if (explicit && explicit.length >= 32) return explicit

  const derived = deriveFromDatabaseUrl()
  if (derived) return derived

  throw new Error('Neither AUTH_SECRET nor DATABASE_URL is set — admin auth is disabled.')
}

function deriveFromDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL
  if (!url) return null
  return createHmac('sha256', url).update('vitlion:admin-session:v1').digest('hex')
}

export const isAuthConfigured = () =>
  Boolean(
    (process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32) || process.env.DATABASE_URL,
  )

interface SessionPayload {
  userId: number
  email: string
  expiresAt: number
}

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64url')

/** Signed, self-contained session token — no server-side session store needed. */
export function createSessionToken(userId: number, email: string): string {
  const payload: SessionPayload = {
    userId,
    email,
    expiresAt: Date.now() + SESSION_TTL_MS,
  }
  const body = b64url(JSON.stringify(payload))
  const signature = createHmac('sha256', secret()).update(body).digest('base64url')
  return `${body}.${signature}`
}

export function readSessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null

  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  const expected = createHmac('sha256', secret()).update(body).digest('base64url')
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload
    if (!payload.expiresAt || payload.expiresAt < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export const SESSION_COOKIE = 'vitlion_admin'
export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000
