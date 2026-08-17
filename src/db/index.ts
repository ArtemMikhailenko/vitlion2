import { neon } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

export type Db = NeonHttpDatabase<typeof schema>

let cached: Db | null | undefined

/**
 * Returns the database handle, or null when DATABASE_URL is not set.
 *
 * Null is a supported state, not an error: the content layer falls back to the
 * TypeScript modules the site ships with, so the public pages render exactly as
 * they do today on an installation with no database. That keeps the admin panel
 * from being a single point of failure for the live site, and lets the whole
 * thing be deployed in stages.
 *
 * Neon's HTTP driver is used rather than a TCP pool: each query is a plain
 * request, so there is no long-lived connection for shared hosting to drop and
 * no pool to size. Connection limits stop being something to think about.
 */
export function getDb(): Db | null {
  if (cached !== undefined) return cached

  const url = process.env.DATABASE_URL
  if (!url) {
    cached = null
    return null
  }

  cached = drizzle(neon(url), { schema })
  return cached
}

export const isDbConfigured = () => Boolean(process.env.DATABASE_URL)

export { schema }
