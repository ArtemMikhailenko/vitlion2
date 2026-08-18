'use client'

import { useActionState, useState } from 'react'
import { Notice } from '@/components/admin/fields'
import { restoreVersion, type RestoreState } from './actions'

export interface HistoryItem {
  id: number
  key: string
  label: string
  lang: string
  preview: string
  isCurrent: boolean
  author: string | null
  createdAt: string
}

function when(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HistoryRow({ item }: { item: HistoryItem }) {
  const [state, action] = useActionState<RestoreState, FormData>(restoreVersion, {})
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="rounded-xl border border-[#23263A] bg-[#13161F] p-4">
      {state.error && <Notice kind="error">{state.error}</Notice>}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-[#E4E0D8]">{item.label}</p>
            <span className="rounded border border-[#23263A] px-1.5 py-0.5 text-[10px] text-[#585C78]">
              {item.lang === 'he' ? 'иврит' : 'рус'}
            </span>
            {item.isCurrent && (
              <span className="rounded border border-[#2A4A32] bg-[#16301E] px-1.5 py-0.5 text-[10px] text-[#9BE5B4]">
                сейчас на сайте
              </span>
            )}
          </div>

          <p
            className="mt-1.5 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-[#8C90A8]"
            dir={item.lang === 'he' ? 'rtl' : 'ltr'}
          >
            {item.preview || <span className="text-[#42465C]">— пусто —</span>}
          </p>

          <p className="mt-1.5 text-xs text-[#42465C]">
            {when(item.createdAt)}
            {item.author && ` · ${item.author}`}
          </p>
        </div>

        {!item.isCurrent &&
          (confirming ? (
            <form action={action} className="flex shrink-0 items-center gap-2">
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className="rounded-lg bg-[#C4983A] px-3 py-1.5 text-xs font-bold text-[#0C0E14]"
              >
                Да, вернуть
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-xs text-[#8C90A8] hover:text-[#E4E0D8]"
              >
                Отмена
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="shrink-0 rounded-lg border border-[#23263A] px-3 py-1.5 text-xs text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
            >
              Вернуть эту версию
            </button>
          ))}
      </div>
    </div>
  )
}
