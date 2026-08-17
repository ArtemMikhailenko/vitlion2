import mysql from 'mysql2/promise'
import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2'
import * as schema from './schema'

export type Db = MySql2Database<typeof schema>

let cached: Db | null | undefined

/**
 * Returns the database handle, or null when DATABASE_URL is not set.
 *
 * Null is a supported state, not an error: the content layer falls back to the
 * TypeScript modules the site ships with, so the public pages render exactly as
 * they do today on an installation with no database. That keeps the admin panel
 * from being a single point of failure for the live site, and lets the whole
 * thing be developed and deployed in stages.
 */
export function getDb(): Db | null {
  if (cached !== undefined) return cached

  const url = process.env.DATABASE_URL
  if (!url) {
    cached = null
    return null
  }

  // A pool rather than a single connection: Next runs route handlers
  // concurrently, and shared hosting drops idle connections aggressively.
  const pool = mysql.createPool({
    uri: url,
    connectionLimit: 5,
    enableKeepAlive: true,
  })

  cached = drizzle(pool, { schema, mode: 'default' })
  return cached
}

export const isDbConfigured = () => Boolean(process.env.DATABASE_URL)

export { schema }
