'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { SearchEntry } from '@/lib/admin/searchIndex'

/**
 * "Где поменять телефон?" — typed, not hunted for.
 *
 * The sidebar names eight sections; the things an operator actually looks for
 * are the fields inside them. This searches both, so the answer is one line of
 * typing rather than a tour of every screen.
 */
export default function AdminSearch({ entries }: { entries: SearchEntry[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries.slice(0, 8)
    return entries
      .filter(e => `${e.label} ${e.context} ${e.keywords ?? ''}`.toLowerCase().includes(q))
      .slice(0, 12)
  }, [entries, query])

  useEffect(() => setCursor(0), [query])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-[#1C1F2C] bg-[#0F1118] px-3 py-2 text-start text-sm text-[#42465C] transition-colors hover:border-[#23263A] hover:text-[#8C90A8]"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16 16l4.5 4.5" strokeLinecap="round" />
        </svg>
        Что нужно найти?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[10vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#23263A] bg-[#13161F] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setCursor(c => Math.min(c + 1, results.length - 1))
                }
                if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setCursor(c => Math.max(c - 1, 0))
                }
                if (e.key === 'Enter' && results[cursor]) go(results[cursor].href)
              }}
              placeholder="Телефон, заголовок, название модели…"
              className="w-full border-b border-[#23263A] bg-transparent px-4 py-3.5 text-sm text-[#E4E0D8] outline-none placeholder:text-[#42465C]"
            />

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.map((entry, i) => (
                <button
                  key={`${entry.href}-${entry.label}`}
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => go(entry.href)}
                  className={`flex w-full flex-col items-start rounded-lg px-3 py-2 text-start transition-colors ${
                    i === cursor ? 'bg-[#C4983A]/12' : ''
                  }`}
                >
                  <span className="text-sm text-[#E4E0D8]">{entry.label}</span>
                  <span className="text-[11px] text-[#585C78]">{entry.context}</span>
                </button>
              ))}

              {results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-[#585C78]">
                  Ничего не нашлось. Попробуйте другое слово — например «телефон» или «заголовок».
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
