'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Notice, SaveBar, inputClass } from '@/components/admin/fields'
import { focusPreview } from '@/components/admin/PreviewPane'
import { useSaveEffect } from '@/components/admin/useSaveEffect'
import type { EditableField, FieldGroup } from '@/lib/admin/fields'
import type { TranslationMap } from '@/lib/content/translations'
import { saveTexts, type SaveState } from './actions'

function Bar({ dirty, disabled }: { dirty: boolean; disabled: boolean }) {
  const { pending } = useFormStatus()
  return <SaveBar dirty={dirty} disabled={disabled} pending={pending} />
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

  // Switching sections moves the preview to the matching block. Without this
  // the operator edits the footer strip while looking at the hero.
  useEffect(() => {
    focusPreview(active?.anchor)
  }, [active?.anchor])

  return (
    <form action={formAction} onChange={() => setDirty(true)}>
      {/* Every field of every group stays mounted so switching sections never
          discards edits — only the inactive ones are hidden. */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {groups.map((group, i) => (
          <button
            key={group.id}
            type="button"
            onClick={() => setActiveId(group.id)}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              group.id === active?.id
                ? 'bg-[#C4983A] font-semibold text-[#0C0E14]'
                : 'border border-[#23263A] text-[#8C90A8] hover:border-[#C4983A]/50 hover:text-[#E4E0D8]'
            }`}
          >
            <span className={group.id === active?.id ? 'opacity-60' : 'text-[#42465C]'}>
              {i + 1}.
            </span>{' '}
            {group.title}
          </button>
        ))}
      </div>

      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && !dirty && <Notice kind="ok">Сохранено. Страницы сайта обновлены.</Notice>}

      {groups.map(group => (
        <section key={group.id} hidden={group.id !== active?.id}>
          <div className="mb-5 rounded-xl border border-[#1C1F2C] bg-[#0F1118] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#E4E0D8]">{group.title}</p>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#8C90A8]">
                  {group.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-[#23263A] px-2.5 py-1 text-[11px] text-[#585C78]">
                {group.where}
              </span>
            </div>

            {group.invisibleNote ? (
              <p className="mt-3 border-t border-[#1C1F2C] pt-3 text-[11px] leading-relaxed text-[#585C78]">
                {group.invisibleNote}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => focusPreview(group.anchor)}
                className="mt-3 hidden rounded border border-[#23263A] px-2.5 py-1 text-[11px] text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8] xl:block"
              >
                ↓ Показать этот блок в предпросмотре
              </button>
            )}
          </div>

          <div className="space-y-4">
            {group.fields.map(field => (
              <FieldCard
                key={field.key}
                field={field}
                value={values[field.key] ?? { he: '', ru: '' }}
              />
            ))}
          </div>
        </section>
      ))}

      <Bar dirty={dirty} disabled={!canSave} />
    </form>
  )
}

function FieldCard({ field, value }: { field: EditableField; value: { he: string; ru: string } }) {
  return (
    <div className="rounded-xl border border-[#23263A] bg-[#13161F] p-4 sm:p-5">
      <div className="mb-3">
        <p className="text-sm font-semibold text-[#E4E0D8]">{field.label}</p>
        {field.hint && <p className="mt-1 text-xs leading-relaxed text-[#585C78]">{field.hint}</p>}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {(['he', 'ru'] as const).map(lang => (
          <LangInput
            key={lang}
            name={`${field.key}::${lang}`}
            lang={lang}
            defaultValue={value[lang]}
            multiline={field.kind === 'multiline'}
            limit={field.limit}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * One language of one field.
 *
 * Controlled rather than uncontrolled so the character count and the "пусто"
 * marker react as you type — both are warnings about a state you would
 * otherwise only discover on the live site.
 */
function LangInput({
  name,
  lang,
  defaultValue,
  multiline,
  limit,
}: {
  name: string
  lang: 'he' | 'ru'
  defaultValue: string
  multiline?: boolean
  limit?: number
}) {
  const [text, setText] = useState(defaultValue)
  const Tag = multiline ? 'textarea' : 'input'
  const over = limit !== undefined && text.length > limit

  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-xs uppercase tracking-wider text-[#585C78]">
          {lang === 'he' ? 'עברית' : 'Русский'}
        </span>
        {limit !== undefined ? (
          <span className={`text-[11px] tabular-nums ${over ? 'text-[#E5A0A0]' : 'text-[#42465C]'}`}>
            {text.length}/{limit}
          </span>
        ) : (
          !text.trim() && <span className="text-[11px] text-[#E5A0A0]">пусто</span>
        )}
      </span>
      <Tag
        name={name}
        value={text}
        onChange={e => setText(e.target.value)}
        dir={lang === 'he' ? 'rtl' : 'ltr'}
        rows={multiline ? 4 : undefined}
        className={`${inputClass} ${multiline ? 'resize-y leading-relaxed' : ''} ${
          over ? 'border-[#5A2A2A]' : ''
        }`}
      />
    </label>
  )
}
