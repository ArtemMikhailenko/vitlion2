'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Notice, inputClass } from '@/components/admin/fields'
import { removeMedia, uploadMedia, type MediaState } from './actions'

export interface MediaRow {
  id: number
  path: string
  originalName: string | null
  width: number | null
  height: number | null
  bytes: number | null
}

function UploadButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[#C4983A] px-6 py-2.5 text-sm font-bold text-[#0C0E14] transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Загружаем…' : 'Загрузить'}
    </button>
  )
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          // Clipboard access can be blocked; the address is selectable anyway.
        }
      }}
      className="rounded border border-[#23263A] px-2 py-1 text-[11px] text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
    >
      {copied ? 'Скопировано' : 'Копировать адрес'}
    </button>
  )
}

export default function MediaManager({
  items,
  canUpload,
}: {
  items: MediaRow[]
  canUpload: boolean
}) {
  const [uploadState, uploadAction] = useActionState<MediaState, FormData>(uploadMedia, {})
  const [deleteState, deleteAction] = useActionState<MediaState, FormData>(removeMedia, {})

  return (
    <>
      {(uploadState.error || deleteState.error) && (
        <Notice kind="error">{uploadState.error ?? deleteState.error}</Notice>
      )}
      {(uploadState.ok || deleteState.ok) && <Notice kind="ok">{uploadState.ok ?? deleteState.ok}</Notice>}

      <form
        action={uploadAction}
        className="mb-8 rounded-xl border border-[#23263A] bg-[#13161F] p-5"
      >
        <p className="mb-1 text-sm font-semibold text-[#E4E0D8]">Загрузить фотографии</p>
        <p className="mb-4 text-xs leading-relaxed text-[#585C78]">
          JPEG, PNG, WebP или AVIF, до 12 МБ каждая. Можно выбрать сразу несколько. Размер и формат
          под устройство посетителя подбираются автоматически — сжимать заранее не нужно.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="file"
            name="files"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            required
            disabled={!canUpload}
            className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-[#23263A] file:px-3 file:py-1.5 file:text-xs file:text-[#E4E0D8]`}
          />
          {canUpload && <UploadButton />}
        </div>
      </form>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#23263A] px-5 py-10 text-center text-sm text-[#585C78]">
          Пока ничего не загружено. Фотографии, которые уже на сайте, лежат в коде — их видно в
          полях каталога.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(item => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-[#23263A] bg-[#13161F]">
              <img
                src={item.path}
                alt={item.originalName ?? ''}
                className="aspect-[4/3] w-full bg-[#0F1118] object-cover"
                loading="lazy"
              />
              <div className="space-y-2 p-3">
                <p className="truncate text-xs text-[#8C90A8]" title={item.originalName ?? ''}>
                  {item.originalName ?? 'без имени'}
                </p>
                <p className="text-[11px] text-[#585C78]">
                  {item.width}×{item.height}
                  {item.bytes ? ` · ${Math.round(item.bytes / 1024)} КБ` : ''}
                </p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <CopyButton value={item.path} />
                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="rounded border border-transparent px-2 py-1 text-[11px] text-[#8C5A5A] transition-colors hover:border-[#5A2A2A] hover:text-[#FFB4B4]"
                    >
                      Удалить
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
