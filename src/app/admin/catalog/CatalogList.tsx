'use client'

import Link from 'next/link'
import { useActionState, useState, useTransition } from 'react'
import { Notice } from '@/components/admin/fields'
import type { AdminEntry } from '@/lib/admin/catalog'
import { saveOrder, togglePublished, type SaveState } from './actions'

/**
 * The list of categories, or of models inside one.
 *
 * Order is edited locally and written on "сохранить порядок" rather than on
 * every arrow press: moving an item three places is three clicks, and three
 * round trips with a page refresh between each would make it feel broken.
 */
export default function CatalogList({
  kind,
  entries,
  categorySlug = '',
  hrefBase,
  canEdit,
}: {
  kind: 'category' | 'model'
  entries: AdminEntry[]
  categorySlug?: string
  /** Item links are `${hrefBase}/${slug}` — a string, because a function cannot cross into a client component. */
  hrefBase: string
  canEdit: boolean
}) {
  const [order, setOrder] = useState(entries)
  const [dirty, setDirty] = useState(false)
  const [orderState, orderAction] = useActionState<SaveState, FormData>(saveOrder, {})
  const [visibility, visibilityAction] = useActionState<SaveState, FormData>(togglePublished, {})
  const [, startTransition] = useTransition()

  const move = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= order.length) return
    setOrder(current => {
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setDirty(true)
  }

  const hidden = order.filter(e => !e.published).length

  return (
    <div>
      {orderState.error && <Notice kind="error">{orderState.error}</Notice>}
      {visibility.error && <Notice kind="error">{visibility.error}</Notice>}
      {orderState.ok && !dirty && <Notice kind="ok">Порядок сохранён.</Notice>}

      {hidden > 0 && (
        <p className="mb-4 text-xs text-[#8C90A8]">
          Скрыто: {hidden}. Скрытое не показывается на сайте и не попадает в карту сайта, но
          остаётся здесь и включается обратно одной кнопкой.
        </p>
      )}

      <div className="space-y-2">
        {order.map((entry, index) => (
          <div
            key={entry.slug}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
              entry.published
                ? 'border-[#23263A] bg-[#13161F]'
                : 'border-[#1C1F2C] bg-[#0F1118] opacity-60'
            }`}
          >
            <div className="flex shrink-0 flex-col gap-0.5">
              <Arrow onClick={() => move(index, -1)} disabled={!canEdit || index === 0} label="↑" />
              <Arrow
                onClick={() => move(index, 1)}
                disabled={!canEdit || index === order.length - 1}
                label="↓"
              />
            </div>

            <img
              src={entry.mainImage}
              alt=""
              className="h-12 w-16 shrink-0 rounded object-cover"
              loading="lazy"
            />

            <Link href={`${hrefBase}/${entry.slug}`} className="group min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#E4E0D8] group-hover:text-[#C4983A]">
                {entry.name.ru}
              </p>
              <p className="truncate text-xs text-[#585C78]">
                {entry.modelCount !== undefined ? `${entry.modelCount} ${plural(entry.modelCount)} · ` : ''}
                {entry.slug}
              </p>
            </Link>

            <form action={visibilityAction} className="shrink-0">
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="slug" value={entry.slug} />
              <input type="hidden" name="categorySlug" value={categorySlug} />
              <input type="hidden" name="published" value={String(entry.published)} />
              <button
                type="submit"
                disabled={!canEdit}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors disabled:opacity-40 ${
                  entry.published
                    ? 'border-[#23263A] text-[#8C90A8] hover:border-[#5A2A2A] hover:text-[#E5A0A0]'
                    : 'border-[#2A4A32] text-[#9BE5B4] hover:bg-[#16301E]'
                }`}
              >
                {entry.published ? 'Скрыть' : 'Показать'}
              </button>
            </form>
          </div>
        ))}
      </div>

      {dirty && (
        <form
          action={formData => startTransition(() => {
            orderAction(formData)
            setDirty(false)
          })}
          className="mt-4 flex items-center gap-3"
        >
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="categorySlug" value={categorySlug} />
          <input type="hidden" name="order" value={JSON.stringify(order.map(e => e.slug))} />
          <button
            type="submit"
            className="rounded-lg bg-[#C4983A] px-5 py-2 text-sm font-bold text-[#0C0E14] transition-opacity hover:opacity-90"
          >
            Сохранить порядок
          </button>
          <button
            type="button"
            onClick={() => {
              setOrder(entries)
              setDirty(false)
            }}
            className="text-sm text-[#8C90A8] hover:text-[#E4E0D8]"
          >
            Отменить
          </button>
        </form>
      )}
    </div>
  )
}

function plural(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'модель'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'модели'
  return 'моделей'
}

function Arrow({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void
  disabled: boolean
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded border border-[#23263A] px-1.5 text-[10px] leading-4 text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8] disabled:opacity-25"
    >
      {label}
    </button>
  )
}
