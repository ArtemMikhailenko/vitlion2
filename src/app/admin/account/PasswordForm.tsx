'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Card, Notice, inputClass } from '@/components/admin/fields'
import { changePassword, type PasswordState } from './actions'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[#C4983A] px-5 py-2.5 text-sm font-semibold text-[#12141C] transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Сохраняю…' : 'Сменить пароль'}
    </button>
  )
}

export default function PasswordForm() {
  const [state, action] = useActionState<PasswordState, FormData>(changePassword, {})

  return (
    <form action={action} className="max-w-md">
      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && <Notice kind="ok">Пароль изменён. В следующий раз входите с новым.</Notice>}

      <Card title="Смена пароля" hint="Минимум 10 символов. Старый пароль нужен для подтверждения.">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs text-[#8C90A8]">Текущий пароль</span>
            <input
              type="password"
              name="current"
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-[#8C90A8]">Новый пароль</span>
            <input
              type="password"
              name="next"
              autoComplete="new-password"
              minLength={10}
              required
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-[#8C90A8]">Повторите новый пароль</span>
            <input
              type="password"
              name="repeat"
              autoComplete="new-password"
              minLength={10}
              required
              className={inputClass}
            />
          </label>
        </div>
      </Card>

      <div className="mt-5">
        <Submit />
      </div>
    </form>
  )
}
