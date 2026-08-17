'use client'

import { useActionState, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { Card, Notice, SaveBar, inputClass } from '@/components/admin/fields'
import { useSaveEffect } from '@/components/admin/useSaveEffect'
import { saveNotify, testNotify, type NotifyState } from './actions'

function Bar({ dirty, disabled }: { dirty: boolean; disabled: boolean }) {
  const { pending } = useFormStatus()
  return <SaveBar dirty={dirty} disabled={disabled} pending={pending} />
}

export default function NotifyEditor({
  enabled,
  chatId,
  hasToken,
  canSave,
}: {
  enabled: boolean
  chatId: string
  /** The token itself is never sent to the browser — only whether one is stored. */
  hasToken: boolean
  canSave: boolean
}) {
  const [state, formAction] = useActionState<NotifyState, FormData>(saveNotify, {})
  const [dirty, setDirty] = useState(false)
  const [test, setTest] = useState<NotifyState>({})
  const [testing, startTest] = useTransition()

  useSaveEffect(state, () => setDirty(false))

  return (
    <form action={formAction} onChange={() => setDirty(true)}>
      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && !dirty && <Notice kind="ok">Сохранено.</Notice>}

      <div className="space-y-5">
        <Card
          title="Как это настроить"
          hint="Пять минут один раз. Дальше каждая заявка приходит на телефон."
        >
          <ol className="space-y-2.5 text-sm leading-relaxed text-[#8C90A8]">
            <li>
              <span className="font-semibold text-[#E4E0D8]">1.</span> В Telegram найдите{' '}
              <code className="text-[#E8C568]">@BotFather</code>, отправьте{' '}
              <code className="text-[#E8C568]">/newbot</code> и придумайте имя. В ответ придёт токен
              — длинная строка вида <code className="text-[#E8C568]">8123456789:AAF…</code>
            </li>
            <li>
              <span className="font-semibold text-[#E4E0D8]">2.</span> Найдите своего нового бота и
              нажмите «Начать». Без этого Telegram не даст ему вам писать.
            </li>
            <li>
              <span className="font-semibold text-[#E4E0D8]">3.</span> Найдите{' '}
              <code className="text-[#E8C568]">@userinfobot</code>, нажмите «Начать» — он пришлёт ваш
              ID. Это число и есть «ID чата».
            </li>
            <li>
              <span className="font-semibold text-[#E4E0D8]">4.</span> Вставьте оба значения ниже,
              сохраните и нажмите «Отправить проверочное».
            </li>
          </ol>
          <p className="mt-3 border-t border-[#1C1F2C] pt-3 text-xs leading-relaxed text-[#585C78]">
            Чтобы заявки видела вся команда — создайте группу, добавьте туда бота, и укажите ID
            группы вместо своего. У групп ID отрицательный, с минусом.
          </p>
        </Card>

        <Card title="Настройки" hint="Токен хранится в базе и обратно в браузер не выдаётся.">
          <div className="space-y-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="enabled"
                defaultChecked={enabled}
                className="mt-0.5 h-4 w-4 accent-[#C4983A]"
              />
              <span>
                <span className="block text-sm text-[#E4E0D8]">Присылать уведомления о заявках</span>
                <span className="mt-0.5 block text-xs text-[#585C78]">
                  Выключите, если нужно временно замолчать — настройки сохранятся.
                </span>
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs text-[#8C90A8]">Токен бота</span>
              <input
                name="token"
                type="password"
                autoComplete="off"
                placeholder={hasToken ? '•••••••• — сохранён, оставьте пустым' : '8123456789:AAF…'}
                dir="ltr"
                className={inputClass}
              />
              <span className="mt-1 block text-[11px] text-[#585C78]">
                {hasToken
                  ? 'Токен уже сохранён. Заполняйте это поле, только если меняете его.'
                  : 'Скопируйте целиком, вместе с двоеточием и цифрами до него.'}
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs text-[#8C90A8]">ID чата</span>
              <input
                name="chatId"
                defaultValue={chatId}
                placeholder="123456789"
                dir="ltr"
                className={inputClass}
              />
            </label>
          </div>
        </Card>

        <Card title="Проверка" hint="Отправляет настоящее сообщение — сразу видно, работает ли.">
          {test.error && <Notice kind="error">{test.error}</Notice>}
          {test.tested && <Notice kind="ok">{test.tested}</Notice>}

          <button
            type="button"
            disabled={testing || !canSave}
            onClick={() => startTest(async () => setTest(await testNotify()))}
            className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8] disabled:opacity-40"
          >
            {testing ? 'Отправляю…' : 'Отправить проверочное'}
          </button>
          {dirty && (
            <p className="mt-2 text-[11px] text-[#585C78]">
              Сначала сохраните — проверка берёт значения из базы, а не из полей.
            </p>
          )}
        </Card>
      </div>

      <Bar dirty={dirty} disabled={!canSave} />
    </form>
  )
}
