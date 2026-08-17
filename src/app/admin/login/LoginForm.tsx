'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { login, type LoginState } from '../actions'

const field =
  'w-full rounded-xl border border-[#23263A] bg-[#0F1118] px-4 py-3 text-[#E4E0D8] outline-none transition-colors placeholder:text-[#585C78] focus:border-[#C4983A]'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-[#C4983A] px-4 py-3 font-bold text-[#0C0E14] transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? 'Проверяем…' : 'Войти'}
    </button>
  )
}

export default function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {})

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-[#23263A] bg-[#13161F] p-6">
      <input
        name="email"
        type="email"
        autoComplete="username"
        required
        placeholder="Почта"
        className={field}
      />
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="Пароль"
        className={field}
      />

      {state.error && (
        <p className="rounded-lg bg-[#3A1D1D] px-3 py-2 text-sm text-[#FFB4B4]">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  )
}
