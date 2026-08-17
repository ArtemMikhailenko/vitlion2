'use client'

import { useMemo, useState } from 'react'
import type { PickableImage } from '@/lib/admin/images'
import { inputClass } from './fields'

/**
 * Picks an image from the library instead of pasting a URL by hand.
 *
 * The text field stays and stays authoritative — an address can still be typed
 * or pasted, which matters for an image that lives somewhere the library does
 * not know about. The picker is a faster route to the same value, not a
 * replacement for it.
 */
export function ImageField({
  name,
  defaultValue,
  images,
  onChanged,
}: {
  name: string
  defaultValue: string
  images: PickableImage[]
  onChanged?: () => void
}) {
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)

  const choose = (url: string) => {
    setValue(url)
    setOpen(false)
    onChanged?.()
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      {value ? (
        <img
          src={value}
          alt=""
          className="h-24 w-32 shrink-0 rounded-lg border border-[#23263A] object-cover"
        />
      ) : (
        <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#23263A] text-xs text-[#585C78]">
          нет фото
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-2">
        <input
          name={name}
          value={value}
          onChange={e => {
            setValue(e.target.value)
            onChanged?.()
          }}
          dir="ltr"
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-[#23263A] px-3 py-1.5 text-xs text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
        >
          Выбрать из библиотеки
        </button>
      </div>

      {open && <ImageLibrary images={images} onPick={choose} onClose={() => setOpen(false)} />}
    </div>
  )
}

/** The library modal on its own, for callers that manage their own value. */
export function ImageLibrary({
  images,
  onPick,
  onClose,
}: {
  images: PickableImage[]
  onPick: (url: string) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return images
    return images.filter(i => `${i.url} ${i.label}`.toLowerCase().includes(q))
  }, [images, query])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#23263A] bg-[#13161F]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#23263A] p-4">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по названию файла"
            className={inputClass}
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-[#23263A] px-3 py-2 text-sm text-[#8C90A8] hover:text-[#E4E0D8]"
          >
            Закрыть
          </button>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-4 sm:grid-cols-4 lg:grid-cols-5">
          {filtered.map(image => (
            <button
              key={image.url}
              type="button"
              onClick={() => onPick(image.url)}
              className="group overflow-hidden rounded-lg border border-[#23263A] text-start transition-colors hover:border-[#C4983A]"
            >
              <img
                src={image.url}
                alt=""
                className="aspect-[4/3] w-full bg-[#0F1118] object-cover"
                loading="lazy"
              />
              <p className="truncate px-2 py-1.5 text-[11px] text-[#8C90A8] group-hover:text-[#E4E0D8]">
                {image.label}
              </p>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-[#585C78]">Ничего не найдено.</p>
          )}
        </div>
      </div>
    </div>
  )
}
