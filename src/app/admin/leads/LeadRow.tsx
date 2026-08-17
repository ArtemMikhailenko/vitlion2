'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { inputClass } from '@/components/admin/fields'
import { LEAD_STATUSES, STATUS_CLASS, statusOf } from '@/lib/admin/leadStatus'
import { saveNote, setStatus, type LeadState } from './actions'

export interface Lead {
  id: number
  name: string
  phone: string
  shape: string | null
  area: string | null
  service: string | null
  lang: string | null
  page: string | null
  status: string
  note: string | null
  createdAt: string
}

/** Formatted on the client so the timestamp shows in the operator's timezone. */
function when(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function LeadRow({ lead }: { lead: Lead }) {
  const [, statusAction] = useActionState<LeadState, FormData>(setStatus, {})
  const [noteState, noteAction] = useActionState<LeadState, FormData>(saveNote, {})
  const [note, setNote] = useState(lead.note ?? '')
  const [editingNote, setEditingNote] = useState(false)

  const current = statusOf(lead.status)
  const closed = lead.status === 'won' || lead.status === 'lost'
  const digits = lead.phone.replace(/\D/g, '')

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        closed ? 'border-[#1C1F2C] bg-[#0F1118]' : 'border-[#23263A] bg-[#13161F]'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_CLASS[current.tone]}`}
            >
              {current.short}
            </span>
            <p className={`font-semibold ${closed ? 'text-[#8C90A8]' : 'text-[#E4E0D8]'}`}>
              {lead.name}
            </p>
            {/* A phone link rather than plain text — one tap to call from a phone. */}
            <a href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`} dir="ltr" className="text-[#C4983A] hover:underline">
              {lead.phone}
            </a>
            <a
              href={`https://wa.me/${digits}`}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-[#23263A] px-2 py-0.5 text-[11px] text-[#8C90A8] transition-colors hover:border-[#25D366] hover:text-[#9BE5B4]"
            >
              WhatsApp
            </a>
          </div>

          {(lead.service || lead.shape || lead.area) && (
            <p className="mt-1.5 text-sm text-[#8C90A8]">
              {[lead.service, lead.shape, lead.area && `${lead.area} м²`].filter(Boolean).join(' · ')}
            </p>
          )}

          <p className="mt-1 text-xs text-[#585C78]">
            {when(lead.createdAt)}
            {lead.lang && ` · ${lead.lang === 'ru' ? 'русская версия' : 'иврит'}`}
            {lead.page && lead.page !== '/' && ` · ${lead.page}`}
          </p>
        </div>

        <form action={statusAction} className="flex flex-wrap gap-1">
          <input type="hidden" name="id" value={lead.id} />
          {LEAD_STATUSES.map(status => (
            <StatusButton
              key={status.id}
              id={status.id}
              label={status.short}
              active={status.id === lead.status}
              tone={status.tone}
            />
          ))}
        </form>
      </div>

      <div className="mt-3 border-t border-[#1C1F2C] pt-3">
        {editingNote ? (
          <form
            action={formData => {
              noteAction(formData)
              setEditingNote(false)
            }}
          >
            <input type="hidden" name="id" value={lead.id} />
            <textarea
              name="note"
              autoFocus
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              placeholder="О чём договорились, когда перезвонить…"
              className={`${inputClass} resize-y text-sm leading-relaxed`}
            />
            <div className="mt-2 flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-[#C4983A] px-3 py-1.5 text-xs font-bold text-[#0C0E14] transition-opacity hover:opacity-90"
              >
                Сохранить
              </button>
              <button
                type="button"
                onClick={() => {
                  setNote(lead.note ?? '')
                  setEditingNote(false)
                }}
                className="rounded-lg border border-[#23263A] px-3 py-1.5 text-xs text-[#8C90A8] hover:text-[#E4E0D8]"
              >
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setEditingNote(true)}
            className="w-full text-start text-sm text-[#8C90A8] transition-colors hover:text-[#E4E0D8]"
          >
            {note ? (
              <span className="whitespace-pre-wrap">{note}</span>
            ) : (
              <span className="text-[#42465C]">+ Добавить заметку</span>
            )}
          </button>
        )}

        {noteState.error && <p className="mt-2 text-xs text-[#E5A0A0]">{noteState.error}</p>}
      </div>
    </div>
  )
}

function StatusButton({
  id,
  label,
  active,
  tone,
}: {
  id: string
  label: string
  active: boolean
  tone: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      name="status"
      value={id}
      disabled={pending || active}
      className={`whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs transition-colors disabled:cursor-default ${
        active
          ? STATUS_CLASS[tone]
          : 'border-[#23263A] text-[#585C78] hover:border-[#C4983A] hover:text-[#E4E0D8]'
      }`}
    >
      {label}
    </button>
  )
}
