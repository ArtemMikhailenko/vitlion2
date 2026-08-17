/**
 * Prints a scrypt hash for the admin password.
 *
 *   node --experimental-strip-types scripts/hash-password.ts "your password"
 *
 * Put the result in ADMIN_PASSWORD_HASH, or into the users table. The password
 * itself is never stored anywhere.
 */

import { randomBytes, scryptSync } from 'node:crypto'

const password = process.argv[2]
if (!password) {
  console.error('Usage: node --experimental-strip-types scripts/hash-password.ts "password"')
  process.exit(1)
}

const salt = randomBytes(16).toString('hex')
const hash = scryptSync(password, salt, 64).toString('hex')
console.log(`${salt}:${hash}`)
