'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { SaveBar as SharedSaveBar } from '@/components/admin/fields'
import { useSaveEffect } from '@/components/admin/useSaveEffect'
import type { FieldGroup } from '@/lib/admin/fields'
import type { TranslationMap } from '@/lib/content/translations'
import { saveTexts, type SaveState } from './actions'

const inputBase =
  'w-full rounded-lg border border-[#23263A] bg-[#0F1118] px-3 py-2.5 text-sm text-[#E4E0D8] outline-none transition-colors placeholder:text-[#4A4E66] focus:border-[#C4983A] disabled:opacity-60'

function SaveBar({ dirty, disabled }: { dirty: boolean; disabled: boolean }) {
  const { pending } = useFormStatus()
  return <SharedSaveBar dirty={dirty} disabled={disabled} pending={pending} />
}

export default function TextsEditor({
  groups,
  values,
  canSave,
}: {
  groups: FieldGroup[]
  values: TranslationMap
  canSave: boolean
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(saveTexts, {})
  const [activeId, setActiveId] = useState(groups[0]?.id ?? '')
  const [dirty, setDirty] = useState(false)

  useSaveEffect(state, () => setDirty(false))

  const active = groups.find(g => g.id === activeId) ?? groups[0]

  return (
    <form action={formAction} onChange={() => setDirty(true)}>
      {/* Every field of every group stays mounted so switching sections never
          discards edits — only the inactive ones are hidden. */}
      <div className="mb-6 flex flex-wrap gap-2">
        {groups.map(group => (
          <button
            key={group.id}
            type="button"
            onClick={() => setActiveId(group.id)}
            className={`rounded-lg px-3.5 py-2 text-sm transition-colors ${
              group.id === active?.id
                ? 'bg-[#C4983A] font-semibold text-[#0C0E14]'
                : 'border border-[#23263A] text-[#8C90A8] hover:border-[#C4983A]/50 hover:text-[#E4E0D8]'
            }`}
          >
            {group.title}
          </button>
        ))}
      </div>

      {state.error && (
        <p className="mb-5 rounded-lg bg-[#3A1D1D] px-4 py-3 text-sm text-[#FFB4B4]">{state.error}</p>
      )}
      {state.ok && !dirty && (
        <p className="mb-5 rounded-lg bg-[#16301E] px-4 py-3 text-sm text-[#9BE5B4]">
          Сохранено. Страницы сайта обновлены.
        </p>
      )}

      {groups.map(group => (
        <section key={group.id} hidden={group.id !== active?.id}>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-[#8C90A8]">{group.description}</p>

          <div className="space-y-6">
            {group.fields.map(field => {
              const value = values[field.key] ?? { he: '', ru: '' }
              const Tag = field.kind === 'multiline' ? 'textarea' : 'input'

              return (
                <div
                  key={field.key}
                  className="rounded-xl border border-[#23263A] bg-[#13161F] p-4 sm:p-5"
                >
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-[#E4E0D8]">{field.label}</p>
                    {field.hint && (
                      <p className="mt-1 text-xs leading-relaxed text-[#585C78]">{field.hint}</p>
                    )}
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    {(['he', 'ru'] as const).map(lang => (
                      <label key={lang} className="block">
                        <span className="mb-1.5 block text-xs uppercase tracking-wider text-[#585C78]">
                          {lang === 'he' ? 'עברית' : 'Русский'}
                        </span>
                        <Tag
                          name={`${field.key}::${lang}`}
                          defaultValue={value[lang]}
                          dir={lang === 'he' ? 'rtl' : 'ltr'}
                          rows={field.kind === 'multiline' ? 4 : undefined}
                          className={`${inputBase} ${field.kind === 'multiline' ? 'resize-y leading-relaxed' : ''}`}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      <SaveBar dirty={dirty} disabled={!canSave} />
    </form>
  )
}
