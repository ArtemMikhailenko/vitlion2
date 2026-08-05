import { useEffect, useRef, useState } from 'react'

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 })
  const target = useRef({ x: -1000, y: -1000 })
  const current = useRef({ x: -1000, y: -1000 })
  const frame = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      const lerp = 0.065
      current.current = {
        x: current.current.x + (target.current.x - current.current.x) * lerp,
        y: current.current.y + (target.current.y - current.current.y) * lerp,
      }
      setPos({ x: current.current.x, y: current.current.y })
      frame.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    frame.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none hidden lg:block"
      aria-hidden="true"
      style={{
        background: `radial-gradient(700px circle at ${pos.x}px ${pos.y}px, rgba(196,152,58,0.045), transparent 65%)`,
      }}
    />
  )
}
