'use server'

import { revalidatePath } from 'next/cache'
import { asc, eq } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { hashPassword } from '@/lib/auth'
import { getCurrentUser } from '@/lib/session'

export interface UsersState {
  ok?: boolean
  error?: string
  /** Shown once, right after creation — the password is never recoverable later. */
  created?: { email: string; password: string }
}

export interface AdminAccount {
  id: number
  email: string
  name: string | null
  createdAt: string
}

export async function listUsers(): Promise<AdminAccount[]> {
  const db = getDb()
  if (!db) return []
  try {
    const rows = await db.select().from(schema.users).orderBy(asc(schema.users.id))
    return rows.map(r => ({
      id: r.id,
      email: r.email,
      name: r.name,
      createdAt: r.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error('[admin] users list failed', error)
    return []
  }
}

/**
 * Generates the password rather than accepting one.
 *
 * The person creating the account is not the person who will use it, so a typed
 * password would have to travel to them anyway — and in practice it would be a
 * weak one reused from somewhere else. A generated passphrase is shown once,
 * handed over, and changed by its owner on the account screen.
 */
function generatePassword(): string {
  const words = [
    'pergola', 'aluminum', 'shutter', 'glazing', 'terrace', 'canopy',
    'louvre', 'awning', 'balcony', 'skylight',
  ]
  const pick = () => words[Math.floor(Math.random() * words.length)]
  const number = String(Math.floor(1000 + Math.random() * 9000))
  return `${pick()}-${pick()}-${number}`
}

export async function createUser(_prev: UsersState, formData: FormData): Promise<UsersState> {
  const current = await getCurrentUser()
  if (!current) return { error: 'Сессия истекла. Войдите заново.' }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена.' }

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim() || null

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: 'Введите корректный адрес почты.' }
  }

  const password = generatePassword()

  try {
    const existing = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1)

    if (existing.length) return { error: 'Такая почта уже заведена.' }

    await db.insert(schema.users).values({
      email,
      name,
      passwordHash: await hashPassword(password),
    })
  } catch (error) {
    console.error('[admin] createUser failed', error)
    return { error: 'Не удалось создать учётную запись.' }
  }

  revalidatePath('/admin/account')
  return { ok: true, created: { email, password } }
}

export async function deleteUser(_prev: UsersState, formData: FormData): Promise<UsersState> {
  const current = await getCurrentUser()
  if (!current) return { error: 'Сессия истекла. Войдите заново.' }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена.' }

  const id = Number(formData.get('id'))
  if (!id) return { error: 'Не удалось удалить.' }

  // Deleting yourself would lock you out of the panel that manages accounts.
  if (id === current.id) return { error: 'Нельзя удалить учётную запись, под которой вы вошли.' }

  try {
    const rows = await db.select({ id: schema.users.id }).from(schema.users)
    if (rows.length <= 1) return { error: 'Это последняя учётная запись — её нельзя удалить.' }

    await db.delete(schema.users).where(eq(schema.users.id, id))
  } catch (error) {
    console.error('[admin] deleteUser failed', error)
    return { error: 'Не удалось удалить.' }
  }

  revalidatePath('/admin/account')
  return { ok: true }
}
