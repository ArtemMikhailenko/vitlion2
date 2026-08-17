import 'server-only'
import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import {
  SESSION_COOKIE,
  isAuthConfigured,
  readSessionToken,
  verifyPassword,
} from './auth'

export interface AdminUser {
  id: number
  email: string
  name?: string | null
}

/** The signed-in admin, or null. Safe to call from any Server Component. */
export async function getCurrentUser(): Promise<AdminUser | null> {
  if (!isAuthConfigured()) return null

  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const session = readSessionToken(token)
  if (!session) return null

  return { id: session.userId, email: session.email }
}

/**
 * Checks credentials against the database, falling back to a bootstrap account
 * held in environment variables.
 *
 * The bootstrap path exists so the panel is reachable before the database is
 * provisioned — otherwise setting the site up would be circular. It stores only
 * a scrypt hash, never a password; generate one with:
 *
 *   node -e "import('./src/lib/auth.ts')" — or the admin:hash script.
 */
export async function authenticate(email: string, password: string): Promise<AdminUser | null> {
  const normalised = email.trim().toLowerCase()

  const db = getDb()
  if (db) {
    try {
      const [row] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, normalised))
        .limit(1)

      if (row && (await verifyPassword(password, row.passwordHash))) {
        return { id: row.id, email: row.email, name: row.name }
      }
      // Fall through to the bootstrap account rather than failing outright,
      // so a database with no rows yet does not lock the owner out.
    } catch (error) {
      console.error('[auth] user lookup failed, trying bootstrap account', error)
    }
  }

  const bootstrapEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const bootstrapHash = process.env.ADMIN_PASSWORD_HASH
  if (bootstrapEmail && bootstrapHash && normalised === bootstrapEmail) {
    if (await verifyPassword(password, bootstrapHash)) {
      return { id: 0, email: bootstrapEmail, name: 'Bootstrap admin' }
    }
  }

  return null
}
