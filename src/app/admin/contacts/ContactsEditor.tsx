'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Card, Notice, SaveBar, inputClass } from '@/components/admin/fields'
import { useSaveEffect } from '@/components/admin/useSaveEffect'
import type { ContactInfo } from '@/lib/content/contact'
import { saveContacts, type ContactState } from './actions'

function Bar({ dirty, disabled }: { dirty: boolean; disabled: boolean }) {
  const { pending } = useFormStatus()
  return <SaveBar dirty={dirty} disabled={disabled} pending={pending} />
}

interface FieldSpec {
  name: keyof ContactInfo
  label: string
  hint?: string
  dir?: 'rtl'
  placeholder?: string
}

const GROUPS: { title: string; hint: string; fields: FieldSpec[] }[] = [
  {
    title: 'Связь',
    hint: 'Показывается в шапке, в подвале и в блоке контактов. Отсюда же берётся кнопка WhatsApp и разметка для Google.',
    fields: [
      {
        name: 'phone',
        label: 'Телефон',
        hint: 'В международном формате, начиная с +972 — иначе звонок с телефона не сработает.',
        placeholder: '+97237630508',
      },
      {
        name: 'whatsapp',
        label: 'WhatsApp',
        hint: 'Может отличаться от основного номера.',
        placeholder: '+97237630499',
      },
      { name: 'email', label: 'Почта', placeholder: 'office@vitlion.co.il' },
    ],
  },
  {
    title: 'Адреса',
    hint: 'Два офиса. Первый — на русском, второй — на иврите, как они сейчас выводятся на сайте.',
    fields: [
      { name: 'address', label: 'Офис 1' },
      { name: 'address2', label: 'Офис 2', dir: 'rtl' },
    ],
  },
  {
    title: 'Соцсети',
    hint: 'Полные адреса со https://. Пустое поле убирает иконку из подвала.',
    fields: [
      { name: 'instagram', label: 'Instagram' },
      { name: 'facebook', label: 'Facebook' },
      { name: 'tiktok', label: 'TikTok' },
      { name: 'youtube', label: 'YouTube' },
    ],
  },
]

export default function ContactsEditor({
  values,
  canSave,
}: {
  values: ContactInfo
  canSave: boolean
}) {
  const [state, formAction] = useActionState<ContactState, FormData>(saveContacts, {})
  const [dirty, setDirty] = useState(false)

  useSaveEffect(state, () => setDirty(false))

  return (
    <form action={formAction} onChange={() => setDirty(true)}>
      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && !dirty && (
        <Notice kind="ok">Сохранено. Новые контакты уже на всех страницах сайта.</Notice>
      )}

      <div className="space-y-5">
        {GROUPS.map(group => (
          <Card key={group.title} title={group.title} hint={group.hint}>
            <div className="space-y-4">
              {group.fields.map(field => (
                <label key={field.name} className="block">
                  <span className="mb-1.5 block text-xs text-[#8C90A8]">{field.label}</span>
                  <input
                    name={field.name}
                    defaultValue={values[field.name]}
                    placeholder={field.placeholder}
                    dir={field.dir ?? 'ltr'}
                    className={inputClass}
                  />
                  {field.hint && (
                    <span className="mt-1 block text-[11px] leading-relaxed text-[#585C78]">
                      {field.hint}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Bar dirty={dirty} disabled={!canSave} />
    </form>
  )
}
