import { useRef, useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  before: string
  after: string
}

export default function BeforeAfterSlider({ before, after }: Props) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const animRef = useRef<number | null>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragMovedRef = useRef(false)
  const startXRef = useRef(0)
  const posRef = useRef(50)
  const firstMountRef = useRef(true)

  const getPos = (clientX: number) => {
    const el = containerRef.current
    if (!el) return 50
    const rect = el.getBoundingClientRect()
    return Math.min(97, Math.max(3, ((clientX - rect.left) / rect.width) * 100))
  }

  // Continuous slow oscillation: 25 ↔ 75, 5 seconds per half-cycle
  // Starts from current posRef so resuming after interaction feels smooth
  useEffect(() => {
    if (interacted) return

    const STEP_MS = 5000
    let fromPos = posRef.current
    let target = fromPos < 50 ? 75 : 25
    let startTime: number | null = null

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts
      const elapsed = ts - startTime
      const t = Math.min(elapsed / STEP_MS, 1)
      const eased = (1 - Math.cos(t * Math.PI)) / 2
      const next = fromPos + (target - fromPos) * eased
      posRef.current = next
      setPos(next)

      if (t >= 1) {
        fromPos = target
        target = target === 25 ? 75 : 25
        startTime = null
      }

      animRef.current = requestAnimationFrame(tick)
    }

    const delay = firstMountRef.current ? 800 : 0
    firstMountRef.current = false
    const timer = setTimeout(() => {
      animRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [interacted])

  const startDrag = useCallback((clientX: number) => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    startXRef.current = clientX
    dragMovedRef.current = false
    setInteracted(true)
    setDragging(true)
    const p = getPos(clientX)
    posRef.current = p
    setPos(p)
  }, [])

  const moveDrag = useCallback((clientX: number) => {
    if (!dragging) return
    if (Math.abs(clientX - startXRef.current) > 5) dragMovedRef.current = true
    const p = getPos(clientX)
    posRef.current = p
    setPos(p)
  }, [dragging])

  const endDrag = useCallback(() => {
    setDragging(false)
    // Resume auto-animation after 3 seconds of inactivity
    resumeTimerRef.current = setTimeout(() => {
      setInteracted(false)
    }, 3000)
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => moveDrag(e.clientX)
    const onUp = () => endDrag()
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging, moveDrag, endDrag])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 select-none"
      style={{ cursor: dragging ? 'col-resize' : 'ew-resize' }}
      onMouseDown={e => startDrag(e.clientX)}
      onTouchStart={e => startDrag(e.touches[0].clientX)}
      onTouchMove={e => {
        if (!dragging) return
        dragMovedRef.current = true
        const p = getPos(e.touches[0].clientX)
        posRef.current = p
        setPos(p)
      }}
      onTouchEnd={endDrag}
      onClick={e => { if (dragMovedRef.current) e.stopPropagation() }}
    >
      {/* After image — full width, bottom layer */}
      <img
        src={after}
        alt="after"
        className="absolute inset-0 w-full h-full object-cover object-top"
        draggable={false}
      />

      {/* Before image — clipped by clipPath to left portion */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={before}
          alt="before"
          className="absolute inset-0 w-full h-full object-cover object-top"
          draggable={false}
        />
      </div>

      {/* Divider line + handle */}
      <div
        className="absolute inset-y-0 z-10 flex items-center justify-center pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-0.5 h-full bg-white/70" />
        <div
          className="absolute flex h-9 w-9 items-center justify-center rounded-full"
          style={{
            background: 'linear-gradient(135deg, #ECC95E 0%, #C4983A 50%, #9B7420 100%)',
            boxShadow: '0 0 0 2px rgba(255,255,255,0.35), 0 4px 18px rgba(0,0,0,0.45)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" stroke="#1A1D24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels — physical left/right so they don't flip in RTL */}
      <span
        className="absolute left-2 bottom-2 z-10 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.6)' }}
      >
        {t('beforeAfter.labelBefore')}
      </span>
      <span
        className="absolute right-2 bottom-2 z-10 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white pointer-events-none"
        style={{ background: 'rgba(196,152,58,0.8)' }}
      >
        {t('beforeAfter.labelAfter')}
      </span>
    </div>
  )
}
