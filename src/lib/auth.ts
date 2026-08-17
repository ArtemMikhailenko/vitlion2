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

function secret(): string {
  const value = process.env.AUTH_SECRET
  if (!value || value.length < 32) {
    throw new Error('AUTH_SECRET is missing or shorter than 32 characters — admin auth is disabled.')
  }
  return value
}

export const isAuthConfigured = () => Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32)

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
