'use server'

import { eq } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { getCurrentUser } from '@/lib/session'

export interface PasswordState {
  ok?: boolean
  error?: string
}

export async function changePassword(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const user = await getCurrentUser()
  if (!user) return { error: 'Сессия истекла. Войдите заново.' }

  const current = String(formData.get('current') ?? '')
  const next = String(formData.get('next') ?? '')
  const repeat = String(formData.get('repeat') ?? '')

  if (next.length < 10) return { error: 'Новый пароль должен быть не короче 10 символов.' }
  if (next !== repeat) return { error: 'Новый пароль и повтор не совпадают.' }
  if (next === current) return { error: 'Новый пароль совпадает со старым.' }

  // The bootstrap account lives in environment variables, not in the database,
  // so there is nothing here to write. Say so plainly instead of failing oddly.
  if (user.id === 0) {
    return {
      error:
        'Это резервная учётная запись из переменных окружения — её пароль меняется в панели хостинга.',
    }
  }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена.' }

  try {
    const [row] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, user.id))
      .limit(1)

    if (!row) return { error: 'Учётная запись не найдена.' }
    if (!(await verifyPassword(current, row.passwordHash))) {
      return { error: 'Текущий пароль введён неверно.' }
    }

    await db
      .update(schema.users)
      .set({ passwordHash: await hashPassword(next) })
      .where(eq(schema.users.id, user.id))

    // The session token carries only id and email, so it stays valid — the
    // operator is not logged out by changing their own password.
    return { ok: true }
  } catch (error) {
    console.error('[admin] password change failed', error)
    return { error: 'Не удалось сохранить пароль. Попробуйте ещё раз.' }
  }
}
