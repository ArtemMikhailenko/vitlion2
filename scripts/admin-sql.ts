/**
 * Prints a ready INSERT for the admin account.
 *
 *   node --experimental-strip-types scripts/admin-sql.ts "email" "password"
 *
 * The password is hashed here and never leaves the machine — only the hash goes
 * into the database.
 */

import { randomBytes, scryptSync } from 'node:crypto'

const [email, password] = process.argv.slice(2)
if (!email || !password) {
  console.error('Usage: npm run admin:sql -- "email@example.com" "password"')
  process.exit(1)
}

const salt = randomBytes(16).toString('hex')
const hash = scryptSync(password, salt, 64).toString('hex')
const escaped = (v: string) => v.replace(/'/g, "''")

console.log(
  `INSERT INTO users (email, password_hash, name) VALUES ('${escaped(email.toLowerCase())}', '${salt}:${hash}', 'Админ')\n` +
    `  ON CONFLICT (email) DO UPDATE SET password_hash = excluded.password_hash;`,
)
