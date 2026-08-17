'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { authenticate } from '@/lib/session'
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  isAuthConfigured,
} from '@/lib/auth'

export interface LoginState {
  error?: string
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { error: 'AUTH_SECRET не задан на сервере — вход недоступен.' }
  }

  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Введите почту и пароль.' }
  }

  const user = await authenticate(email, password)
  if (!user) {
    // Deliberately the same message for an unknown account and a wrong
    // password, so the form cannot be used to discover which emails exist.
    return { error: 'Неверная почта или пароль.' }
  }

  const store = await cookies()
  store.set(SESSION_COOKIE, createSessionToken(user.id, user.email), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  redirect('/admin')
}

export async function logout() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect('/admin/login')
}
