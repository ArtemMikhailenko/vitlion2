'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Form primitives shared by every admin screen.
 *
 * They exist so the panel reads as one product rather than a pile of separate
 * forms, and so the bilingual pattern — Hebrew and Russian side by side, Hebrew
 * right-aligned — is applied identically everywhere instead of being
 * reinvented per screen.
 */

export const inputClass =
  'w-full rounded-lg border border-[#23263A] bg-[#0F1118] px-3 py-2.5 text-sm text-[#E4E0D8] outline-none transition-colors placeholder:text-[#4A4E66] focus:border-[#C4983A] disabled:opacity-60'

export function Card({
  title,
  hint,
  actions,
  children,
}: {
  title: string
  hint?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-[#23263A] bg-[#13161F] p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#E4E0D8]">{title}</p>
          {hint && <p className="mt-1 text-xs leading-relaxed text-[#585C78]">{hint}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}

/** One value in both languages, Hebrew on the left and right-aligned. */
export function LangPair({
  name,
  values,
  multiline,
  rows = 4,
  limit,
}: {
  name: string
  values: { he: string; ru: string }
  multiline?: boolean
  rows?: number
  /** Shows a live character count, and warns past this many. */
  limit?: number
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {(['he', 'ru'] as const).map(lang => (
        <CountedInput
          key={lang}
          name={`${name}::${lang}`}
          label={lang === 'he' ? 'עברית' : 'Русский'}
          defaultValue={values[lang]}
          dir={lang === 'he' ? 'rtl' : 'ltr'}
          multiline={multiline}
          rows={rows}
          limit={limit}
        />
      ))}
    </div>
  )
}

/**
 * One field that counts itself.
 *
 * The counter exists for the two fields where length has a consequence the
 * operator cannot see: a title over ~60 characters and a description over ~155
 * get cut off in Google, and nothing in the panel would otherwise say so.
 */
function CountedInput({
  name,
  label,
  defaultValue,
  dir,
  multiline,
  rows,
  limit,
}: {
  name: string
  label: string
  defaultValue: string
  dir: 'rtl' | 'ltr'
  multiline?: boolean
  rows?: number
  limit?: number
}) {
  const [value, setValue] = useState(defaultValue)
  const Tag = multiline ? 'textarea' : 'input'
  const over = limit !== undefined && value.length > limit

  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-xs uppercase tracking-wider text-[#585C78]">{label}</span>
        {limit !== undefined && (
          <span className={`text-[11px] tabular-nums ${over ? 'text-[#E5A0A0]' : 'text-[#42465C]'}`}>
            {value.length}/{limit}
          </span>
        )}
      </span>
      <Tag
        name={name}
        value={value}
        onChange={e => setValue(e.target.value)}
        dir={dir}
        rows={multiline ? rows : undefined}
        className={`${inputClass} ${multiline ? 'resize-y leading-relaxed' : ''} ${
          over ? 'border-[#5A2A2A]' : ''
        }`}
      />
    </label>
  )
}

/**
 * A fixed-length list of lines in both languages — used for the six feature
 * bullets each model carries. One textarea per language, one line per bullet:
 * far quicker to edit than six separate inputs, and reordering is just moving
 * a line.
 */
export function LangLines({
  name,
  values,
  rows = 7,
}: {
  name: string
  values: { he: string[]; ru: string[] }
  rows?: number
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {(['he', 'ru'] as const).map(lang => (
        <label key={lang} className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-[#585C78]">
            {lang === 'he' ? 'עברית' : 'Русский'}
          </span>
          <textarea
            name={`${name}::${lang}`}
            defaultValue={(values[lang] ?? []).join('\n')}
            dir={lang === 'he' ? 'rtl' : 'ltr'}
            rows={rows}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </label>
      ))}
    </div>
  )
}

export function SaveBar({
  dirty,
  disabled,
  pending,
  message,
}: {
  dirty: boolean
  disabled: boolean
  pending: boolean
  message?: string
}) {
  // Closing the tab mid-edit used to lose the work silently. The browser's own
  // confirmation is the only thing that can interrupt that, and it only appears
  // while there is something to lose.
  useEffect(() => {
    if (!dirty || disabled) return

    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty, disabled])

  return (
    <div className="sticky bottom-0 -mx-5 mt-8 border-t border-[#23263A] bg-[#0C0E14]/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[#8C90A8]">
          {message ??
            (disabled
              ? 'Сохранение недоступно — база не подключена.'
              : dirty
                ? 'Есть несохранённые изменения.'
                : 'Все изменения сохранены.')}
        </p>
        <button
          type="submit"
          disabled={pending || disabled || !dirty}
          className="rounded-lg bg-[#C4983A] px-6 py-2.5 text-sm font-bold text-[#0C0E14] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? 'Сохраняем…' : 'Сохранить'}
        </button>
      </div>
    </div>
  )
}

export function Notice({ kind, children }: { kind: 'error' | 'ok' | 'warn'; children: ReactNode }) {
  const styles = {
    error: 'bg-[#3A1D1D] text-[#FFB4B4]',
    ok: 'bg-[#16301E] text-[#9BE5B4]',
    warn: 'border border-[#4A3A1A] bg-[#1F1810] text-[#B8A98A]',
  }[kind]

  return <div className={`mb-5 rounded-lg px-4 py-3 text-sm leading-relaxed ${styles}`}>{children}</div>
}
