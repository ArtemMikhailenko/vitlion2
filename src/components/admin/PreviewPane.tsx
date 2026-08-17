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
const FOCUS_EVENT = 'vitlion:focus'

export function announceSaved() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SAVED_EVENT))
}

/**
 * Asks the preview to scroll to a block of the page.
 *
 * Sent when the operator switches sections, so editing "призыв к действию"
 * shows the call-to-action strip instead of leaving the preview parked on the
 * hero — the disconnect that made the labels feel abstract in the first place.
 */
export function focusPreview(selector: string | undefined) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(FOCUS_EVENT, { detail: selector ?? null }))
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
  const [wideEnough, setWideEnough] = useState(false)

  const boxRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  /** Remembered so a reload, or a section picked before the frame loaded, still lands right. */
  const anchorRef = useRef<string | null>(null)

  const url = `${lang === 'ru' ? '/ru' : ''}${path === '/' ? '' : path}` || '/'

  const reload = useCallback(() => setNonce(n => n + 1), [])

  // The pane is display:none below xl, but a hidden iframe still downloads the
  // whole site — including the hero video — on a phone. Mount it only when it
  // will actually be looked at.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1280px)')
    const sync = () => setWideEnough(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  /**
   * Scrolls the frame to the remembered block.
   *
   * Repeated rather than done once: the page lazy-loads images and reveals
   * sections on scroll, so it keeps growing under the target and a single jump
   * lands short.
   *
   * Every jump is explicitly instant. The site sets `scroll-behavior: smooth`
   * in CSS, which turns each call into an animation that the next retry
   * restarts from wherever it got to — the scroll never converged until this
   * was forced off.
   */
  const scrollToAnchor = useCallback(() => {
    let attempt = 0

    const step = () => {
      const selector = anchorRef.current
      const frame = frameRef.current
      if (!frame) return

      try {
        const win = frame.contentWindow
        const doc = win?.document
        if (!doc) return

        if (!selector) {
          win?.scrollTo({ top: 0, behavior: 'instant' })
          return
        }

        doc.querySelector(selector)?.scrollIntoView({ behavior: 'instant', block: 'start' })
      } catch {
        // Same origin in every deployment, so this should not happen — but a
        // cross-origin frame must not take the panel down with it.
      }

      attempt += 1
      if (attempt < 7) setTimeout(step, 400)
    }

    step()
  }, [])

  useEffect(() => {
    const onFocus = (event: Event) => {
      anchorRef.current = (event as CustomEvent<string | null>).detail
      scrollToAnchor()
    }

    window.addEventListener(SAVED_EVENT, reload)
    window.addEventListener(FOCUS_EVENT, onFocus)
    return () => {
      window.removeEventListener(SAVED_EVENT, reload)
      window.removeEventListener(FOCUS_EVENT, onFocus)
    }
  }, [reload, scrollToAnchor])

  // Measured rather than assumed: the pane's width depends on the sidebar, the
  // window and the breakpoint, none of which are known at render time.
  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return

    const fit = () => {
      // Below xl the pane is display:none and measures zero. Dividing by that
      // scale gave the iframe a height of NaN, which React rejects.
      const width = box.clientWidth
      if (width > 0) setScale(width / FRAME_WIDTH[device])
    }
    fit()

    const observer = new ResizeObserver(fit)
    observer.observe(box)
    return () => observer.disconnect()
  }, [device])

  const measuredHeight = boxRef.current && scale > 0 ? boxRef.current.clientHeight / scale : 0
  const frameHeight = measuredHeight > 0 ? measuredHeight : 900

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
        {wideEnough && (
          <iframe
            key={`${url}-${nonce}`}
            ref={frameRef}
            src={url}
            onLoad={scrollToAnchor}
            title="Предпросмотр сайта"
            className="absolute left-0 top-0 origin-top-left border-0 bg-white"
            style={{
              width: FRAME_WIDTH[device],
              height: frameHeight,
              transform: `scale(${scale})`,
            }}
          />
        )}
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
