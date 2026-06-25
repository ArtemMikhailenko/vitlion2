import { useEffect, useRef, useState } from 'react'

const TRAIL_COUNT = 8

export default function LiquidCursor() {
  const dot = useRef({ x: -200, y: -200 })
  const ring = useRef({ x: -200, y: -200 })
  const target = useRef({ x: -200, y: -200 })
  const frame = useRef(0)
  const trail = useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -200, y: -200 }))
  )
  const [dotPos, setDotPos] = useState({ x: -200, y: -200 })
  const [ringPos, setRingPos] = useState({ x: -200, y: -200 })
  const [trailPos, setTrailPos] = useState<Array<{ x: number; y: number }>>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -200, y: -200 }))
  )
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
      dot.current = { x: e.clientX, y: e.clientY }
      setDotPos({ x: e.clientX, y: e.clientY })
    }

    const onDown = () => setClicked(true)
    const onUp = () => setClicked(false)

    const onEnter = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a,button,[role="button"]')) setHovered(true)
    }
    const onLeave = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a,button,[role="button"]')) setHovered(false)
    }

    const animate = () => {
      const lerp = 0.08
      ring.current = {
        x: ring.current.x + (target.current.x - ring.current.x) * lerp,
        y: ring.current.y + (target.current.y - ring.current.y) * lerp,
      }
      setRingPos({ ...ring.current })

      // Trail: each dot chases the one before it with decreasing lerp
      const prev = [...trail.current]
      for (let i = TRAIL_COUNT - 1; i >= 1; i--) {
        const lag = 0.14 - i * 0.012
        prev[i] = {
          x: prev[i].x + (prev[i - 1].x - prev[i].x) * lag,
          y: prev[i].y + (prev[i - 1].y - prev[i].y) * lag,
        }
      }
      prev[0] = { ...dot.current }
      trail.current = prev
      setTrailPos([...prev])

      frame.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onEnter)
    window.addEventListener('mouseout', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    frame.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onEnter)
      window.removeEventListener('mouseout', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(frame.current)
    }
  }, [])

  const ringSize = hovered ? 56 : clicked ? 28 : 40
  const dotSize = hovered ? 4 : clicked ? 10 : 6

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none hidden lg:block" aria-hidden="true">
      {/* Trail dots */}
      {trailPos.map((pos, i) => {
        const t = (TRAIL_COUNT - i) / TRAIL_COUNT
        const size = Math.max(1, 4 * t)
        return (
          <div
            key={i}
            style={{
              position: 'fixed',
              width: size,
              height: size,
              left: pos.x - size / 2,
              top: pos.y - size / 2,
              borderRadius: '50%',
              background: `rgba(196,152,58,${0.55 * t * t})`,
              pointerEvents: 'none',
            }}
          />
        )
      })}

      {/* Outer ring */}
      <div
        style={{
          position: 'fixed',
          width: ringSize,
          height: ringSize,
          left: ringPos.x - ringSize / 2,
          top: ringPos.y - ringSize / 2,
          borderRadius: '50%',
          border: '1.5px solid',
          borderColor: hovered ? 'rgba(196,152,58,0.9)' : 'rgba(196,152,58,0.5)',
          background: hovered
            ? 'radial-gradient(circle, rgba(196,152,58,0.12) 0%, transparent 70%)'
            : 'transparent',
          boxShadow: hovered ? '0 0 20px rgba(196,152,58,0.25)' : '0 0 8px rgba(196,152,58,0.12)',
          transition: 'width 0.35s cubic-bezier(0.34,1.56,0.64,1), height 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Inner dot */}
      <div
        style={{
          position: 'fixed',
          width: dotSize,
          height: dotSize,
          left: dotPos.x - dotSize / 2,
          top: dotPos.y - dotSize / 2,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #E8C568, #C4983A)',
          boxShadow: '0 0 6px rgba(196,152,58,0.7)',
          transition: 'width 0.2s ease, height 0.2s ease',
        }}
      />
    </div>
  )
}
