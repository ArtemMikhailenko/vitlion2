'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Card, Notice, SaveBar, inputClass } from '@/components/admin/fields'
import { focusPreview } from '@/components/admin/PreviewPane'
import { useSaveEffect } from '@/components/admin/useSaveEffect'
import type { EditableList } from '@/lib/admin/lists'
import { saveList, type ListState } from './actions'

type Lang = 'he' | 'ru'
type Item = Record<string, unknown> | string

function Bar({ dirty, disabled }: { dirty: boolean; disabled: boolean }) {
  const { pending } = useFormStatus()
  return <SaveBar dirty={dirty} disabled={disabled} pending={pending} />
}

/**
 * Editor for a repeating block — advantages, reviews, team members.
 *
 * Entries are added, removed and moved for both languages at once. The two
 * versions are translations of the same list: an entry that exists in Hebrew
 * and not in Russian is a mistake, and keeping them in step makes it one that
 * cannot happen by accident.
 */
export default function ListEditor({
  list,
  initial,
  canSave,
}: {
  list: EditableList
  initial: Record<Lang, Item[]>
  canSave: boolean
}) {
  const [state, formAction] = useActionState<ListState, FormData>(saveList, {})
  const [value, setValue] = useState(initial)
  const [dirty, setDirty] = useState(false)

  useSaveEffect(state, () => setDirty(false))

  const count = Math.max(value.he.length, value.ru.length)
  const blank = (): Item =>
    list.fields ? Object.fromEntries(list.fields.map(f => [f.name, f.kind === 'number' ? 5 : ''])) : ''

  const patch = (lang: Lang, index: number, field: string | null, raw: string) => {
    setDirty(true)
    setValue(current => {
      const next = [...current[lang]]
      while (next.length <= index) next.push(blank())

      if (field === null) {
        next[index] = raw
      } else {
        const spec = list.fields?.find(f => f.name === field)
        const parsed = spec?.kind === 'number' ? Number(raw) || 0 : raw
        next[index] = { ...(next[index] as Record<string, unknown>), [field]: parsed }
      }
      return { ...current, [lang]: next }
    })
  }

  const add = () => {
    setDirty(true)
    setValue(c => ({ he: [...c.he, blank()], ru: [...c.ru, blank()] }))
  }

  const remove = (index: number) => {
    setDirty(true)
    setValue(c => ({
      he: c.he.filter((_, i) => i !== index),
      ru: c.ru.filter((_, i) => i !== index),
    }))
  }

  const move = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= count) return
    setDirty(true)
    setValue(c => {
      const swap = (items: Item[]) => {
        const next = [...items]
        while (next.length <= Math.max(index, target)) next.push(blank())
        ;[next[index], next[target]] = [next[target], next[index]]
        return next
      }
      return { he: swap(c.he), ru: swap(c.ru) }
    })
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={list.id} />
      <input type="hidden" name="value" value={JSON.stringify(value)} />

      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && !dirty && <Notice kind="ok">Сохранено. Страница обновлена.</Notice>}

      <div className="mb-5 rounded-xl border border-[#1C1F2C] bg-[#0F1118] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#E4E0D8]">{list.title}</p>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#8C90A8]">
              {list.description}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-[#23263A] px-2.5 py-1 text-[11px] text-[#585C78]">
            {list.where}
          </span>
        </div>
        {list.anchor && (
          <button
            type="button"
            onClick={() => focusPreview(list.anchor)}
            className="mt-3 hidden rounded border border-[#23263A] px-2.5 py-1 text-[11px] text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8] xl:block"
          >
            ↓ Показать этот блок в предпросмотре
          </button>
        )}
      </div>

      <div className="space-y-4">
        {Array.from({ length: count }, (_, index) => (
          <Card
            key={index}
            title={`${list.itemLabel} ${index + 1}`}
            actions={
              <div className="flex gap-1">
                <Mini onClick={() => move(index, -1)} disabled={index === 0} label="↑" />
                <Mini onClick={() => move(index, 1)} disabled={index === count - 1} label="↓" />
                <Mini onClick={() => remove(index)} label="Удалить" danger />
              </div>
            }
          >
            <div className="grid gap-5 lg:grid-cols-2">
              {(['he', 'ru'] as Lang[]).map(lang => (
                <div key={lang} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#585C78]">
                    {lang === 'he' ? 'Иврит' : 'Русский'}
                  </p>

                  {list.fields ? (
                    list.fields.map(field => {
                      const item = (value[lang][index] ?? {}) as Record<string, unknown>
                      const raw = item[field.name]
                      const Tag = field.kind === 'multiline' ? 'textarea' : 'input'
                      return (
                        <label key={field.name} className="block">
                          <span className="mb-1 block text-[11px] text-[#8C90A8]">
                            {field.label}
                          </span>
                          <Tag
                            value={raw === undefined || raw === null ? '' : String(raw)}
                            onChange={e => patch(lang, index, field.name, e.target.value)}
                            type={field.kind === 'number' ? 'number' : undefined}
                            rows={field.kind === 'multiline' ? 3 : undefined}
                            dir={lang === 'he' ? 'rtl' : 'ltr'}
                            className={`${inputClass} ${field.kind === 'multiline' ? 'resize-y leading-relaxed' : ''}`}
                          />
                          {field.hint && (
                            <span className="mt-1 block text-[11px] text-[#585C78]">
                              {field.hint}
                            </span>
                          )}
                        </label>
                      )
                    })
                  ) : (
                    <input
                      value={String(value[lang][index] ?? '')}
                      onChange={e => patch(lang, index, null, e.target.value)}
                      dir={lang === 'he' ? 'rtl' : 'ltr'}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}

        <button
          type="button"
          onClick={add}
          className="w-full rounded-xl border border-dashed border-[#23263A] py-3 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
        >
          + Добавить
        </button>
      </div>

      <Bar dirty={dirty} disabled={!canSave} />
    </form>
  )
}

function Mini({
  onClick,
  label,
  disabled,
  danger,
}: {
  onClick: () => void
  label: string
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded border border-[#23263A] px-2 py-1 text-[11px] transition-colors disabled:opacity-30 ${
        danger
          ? 'text-[#8C90A8] hover:border-[#5A2A2A] hover:text-[#E5A0A0]'
          : 'text-[#8C90A8] hover:border-[#C4983A] hover:text-[#E4E0D8]'
      }`}
    >
      {label}
    </button>
  )
}
