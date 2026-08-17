'use client'

import type { ReactNode } from 'react'

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
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-[#23263A] bg-[#13161F] p-4 sm:p-5">
      <div className="mb-3">
        <p className="text-sm font-semibold text-[#E4E0D8]">{title}</p>
        {hint && <p className="mt-1 text-xs leading-relaxed text-[#585C78]">{hint}</p>}
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
}: {
  name: string
  values: { he: string; ru: string }
  multiline?: boolean
  rows?: number
}) {
  const Tag = multiline ? 'textarea' : 'input'

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {(['he', 'ru'] as const).map(lang => (
        <label key={lang} className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-[#585C78]">
            {lang === 'he' ? 'עברית' : 'Русский'}
          </span>
          <Tag
            name={`${name}::${lang}`}
            defaultValue={values[lang]}
            dir={lang === 'he' ? 'rtl' : 'ltr'}
            rows={multiline ? rows : undefined}
            className={`${inputClass} ${multiline ? 'resize-y leading-relaxed' : ''}`}
          />
        </label>
      ))}
    </div>
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
