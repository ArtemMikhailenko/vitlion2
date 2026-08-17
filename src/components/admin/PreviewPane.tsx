'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Editors announce a successful save on the window; the preview listens.
 *
 * A context would have to be threaded through server components that sit
 * between the pane and the forms, for one boolean. An event keeps the two
 * sides ignorant of each other.
 */
export const SAVED_EVENT = 'vitlion:saved'

export function announceSaved() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SAVED_EVENT))
}

type Device = 'desktop' | 'mobile'

const FRAME_WIDTH: Record<Device, number> = { desktop: 1280, mobile: 390 }

/**
 * The real page, beside the form that edits it.
 *
 * This is the answer to "which text is «Надпись над заголовком»?" — the label
 * stops mattering once the page is visible next to it. The frame renders at a
 * real viewport width and is scaled down to fit, so the layout is the one
 * visitors get rather than a squeezed column.
 */
export default function PreviewPane({ path, className = '' }: { path: string; className?: string }) {
  const [device, setDevice] = useState<Device>('desktop')
  const [lang, setLang] = useState<'he' | 'ru'>('he')
  const [nonce, setNonce] = useState(0)
  const [scale, setScale] = useState(0.3)

  const boxRef = useRef<HTMLDivElement>(null)

  const url = `${lang === 'ru' ? '/ru' : ''}${path === '/' ? '' : path}` || '/'

  const reload = useCallback(() => setNonce(n => n + 1), [])

  useEffect(() => {
    window.addEventListener(SAVED_EVENT, reload)
    return () => window.removeEventListener(SAVED_EVENT, reload)
  }, [reload])

  // Measured rather than assumed: the pane's width depends on the sidebar, the
  // window and the breakpoint, none of which are known at render time.
  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return

    const fit = () => setScale(box.clientWidth / FRAME_WIDTH[device])
    fit()

    const observer = new ResizeObserver(fit)
    observer.observe(box)
    return () => observer.disconnect()
  }, [device])

  const frameHeight = boxRef.current ? boxRef.current.clientHeight / scale : 900

  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border border-[#23263A] bg-[#0F1118] ${className}`}>
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1C1F2C] px-3 py-2">
        <span className="me-auto text-[11px] font-semibold uppercase tracking-wider text-[#42465C]">
          Как это выглядит
        </span>

        <Toggle
          options={[
            { id: 'he', label: 'Иврит' },
            { id: 'ru', label: 'Рус' },
          ]}
          value={lang}
          onChange={v => setLang(v as 'he' | 'ru')}
        />
        <Toggle
          options={[
            { id: 'desktop', label: 'ПК' },
            { id: 'mobile', label: 'Телефон' },
          ]}
          value={device}
          onChange={v => setDevice(v as Device)}
        />

        <button
          type="button"
          onClick={reload}
          title="Обновить"
          className="rounded border border-[#23263A] px-2 py-1 text-[11px] text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
        >
          ↻
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          title="Открыть в новой вкладке"
          className="rounded border border-[#23263A] px-2 py-1 text-[11px] text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
        >
          ↗
        </a>
      </div>

      <div ref={boxRef} className="relative min-h-0 flex-1 overflow-hidden bg-[#0A0C12]">
        <iframe
          key={`${url}-${nonce}`}
          src={url}
          title="Предпросмотр сайта"
          className="absolute left-0 top-0 origin-top-left border-0 bg-white"
          style={{
            width: FRAME_WIDTH[device],
            height: frameHeight,
            transform: `scale(${scale})`,
          }}
        />
      </div>

      <p className="border-t border-[#1C1F2C] px-3 py-1.5 text-[10px] text-[#42465C]">
        Обновляется после сохранения. Уменьшено до {Math.round(scale * 100)}%.
      </p>
    </div>
  )
}

function Toggle({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex overflow-hidden rounded border border-[#23263A]">
      {options.map(option => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`px-2 py-1 text-[11px] transition-colors ${
            option.id === value
              ? 'bg-[#C4983A] font-semibold text-[#0C0E14]'
              : 'text-[#8C90A8] hover:text-[#E4E0D8]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
