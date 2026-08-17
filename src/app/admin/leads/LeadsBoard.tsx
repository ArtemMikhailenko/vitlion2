'use client'

import { useMemo, useState } from 'react'
import { LEAD_STATUSES, OPEN_STATUSES } from '@/lib/admin/leadStatus'
import { inputClass } from '@/components/admin/fields'
import LeadRow, { type Lead } from './LeadRow'

type Filter = 'open' | 'all' | (typeof LEAD_STATUSES)[number]['id']

/**
 * Filtering happens here rather than in a query.
 *
 * The list is capped at 500 rows, which is a few years of enquiries for this
 * business and nothing for a browser. Doing it client-side means typing a phone
 * number filters as you type, with no round trip and no loading state.
 */
export default function LeadsBoard({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<Filter>('open')
  const [query, setQuery] = useState('')

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: leads.length, open: 0 }
    for (const lead of leads) {
      map[lead.status] = (map[lead.status] ?? 0) + 1
      if (OPEN_STATUSES.includes(lead.status)) map.open += 1
    }
    return map
  }, [leads])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const digits = q.replace(/\D/g, '')

    return leads.filter(lead => {
      if (filter === 'open' && !OPEN_STATUSES.includes(lead.status)) return false
      if (filter !== 'open' && filter !== 'all' && lead.status !== filter) return false
      if (!q) return true

      // Phone matching ignores formatting: "0541234567" finds "+972-54-123-4567".
      if (digits.length >= 3 && lead.phone.replace(/\D/g, '').includes(digits)) return true
      return `${lead.name} ${lead.service ?? ''} ${lead.note ?? ''}`.toLowerCase().includes(q)
    })
  }, [leads, filter, query])

  const tabs: { id: Filter; label: string }[] = [
    { id: 'open', label: 'Требуют внимания' },
    ...LEAD_STATUSES.map(s => ({ id: s.id as Filter, label: s.label })),
    { id: 'all', label: 'Все' },
  ]

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tabs.map(tab => {
          const count = counts[tab.id] ?? 0
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                filter === tab.id
                  ? 'bg-[#C4983A] font-semibold text-[#0C0E14]'
                  : 'border border-[#23263A] text-[#8C90A8] hover:border-[#C4983A]/50 hover:text-[#E4E0D8]'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={filter === tab.id ? 'opacity-60' : 'text-[#42465C]'}> {count}</span>
              )}
            </button>
          )
        })}
      </div>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Поиск по имени, телефону или заметке"
        className={`${inputClass} mb-5`}
      />

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#23263A] px-5 py-12 text-center">
          <p className="text-sm text-[#8C90A8]">
            {query.trim()
              ? 'Ничего не нашлось.'
              : filter === 'open'
                ? 'Все заявки разобраны.'
                : 'В этой группе пусто.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(lead => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </>
  )
}
