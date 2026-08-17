'use client'

import { useActionState } from 'react'
import { toggleHandled, type LeadState } from './actions'

export interface Lead {
  id: number
  name: string
  phone: string
  shape: string | null
  area: string | null
  service: string | null
  lang: string | null
  page: string | null
  handled: boolean
  createdAt: string
}

/** Formatted on the client so the timestamp shows in the operator's timezone. */
function when(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function LeadRow({ lead }: { lead: Lead }) {
  const [, action] = useActionState<LeadState, FormData>(toggleHandled, {})

  const details = [lead.service, lead.shape, lead.area && `${lead.area} м²`].filter(Boolean)

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        lead.handled ? 'border-[#1C1F2C] bg-[#0F1118] opacity-60' : 'border-[#23263A] bg-[#13161F]'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-semibold text-[#E4E0D8]">{lead.name}</p>
            {/* A phone link rather than plain text — one tap to call from a phone. */}
            <a
              href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
              dir="ltr"
              className="text-[#C4983A] hover:underline"
            >
              {lead.phone}
            </a>
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-[#23263A] px-2 py-0.5 text-[11px] text-[#8C90A8] transition-colors hover:border-[#25D366] hover:text-[#9BE5B4]"
            >
              WhatsApp
            </a>
          </div>

          {details.length > 0 && (
            <p className="mt-1.5 text-sm text-[#8C90A8]">{details.join(' · ')}</p>
          )}

          <p className="mt-1 text-xs text-[#585C78]">
            {when(lead.createdAt)}
            {lead.lang && ` · ${lead.lang === 'ru' ? 'русская версия' : 'иврит'}`}
            {lead.page && lead.page !== '/' && ` · ${lead.page}`}
          </p>
        </div>

        <form action={action}>
          <input type="hidden" name="id" value={lead.id} />
          <input type="hidden" name="handled" value={String(lead.handled)} />
          <button
            type="submit"
            className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              lead.handled
                ? 'border-[#23263A] text-[#585C78] hover:text-[#8C90A8]'
                : 'border-[#2A4A32] text-[#9BE5B4] hover:bg-[#16301E]'
            }`}
          >
            {lead.handled ? 'Вернуть в работу' : 'Обработана'}
          </button>
        </form>
      </div>
    </div>
  )
}
