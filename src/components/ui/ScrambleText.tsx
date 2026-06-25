import { useEffect, useRef } from 'react'
import { useInView } from '../../hooks/useInView'

const GLYPHS = '╬╪╫◆▓█░▒╠■◈●▪◉╦╩╣╠═'

interface Props {
  children: string
  className?: string
  delay?: number
  speed?: number
}

export default function ScrambleText({ children, className = '', delay = 0, speed = 1 }: Props) {
  const [wrapRef, inView] = useInView({ threshold: 0.25 })
  const elRef = useRef<HTMLSpanElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!inView || hasRun.current) return
    hasRun.current = true
    const el = elRef.current
    if (!el) return

    const text = children
    const len = text.length
    let frame = 0
    const settle = len * (2 / speed)

    const tick = setTimeout(() => {
      let raf: number
      const animate = () => {
        el.textContent = text
          .split('')
          .map((char, i) => {
            if (char === ' ' || char === '\n') return char
            const progress = frame / settle
            if (progress > i / len + 0.15) return char
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join('')
        frame += 0.9
        if (frame < settle + len) {
          raf = requestAnimationFrame(animate)
        } else {
          el.textContent = text
        }
      }
      raf = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(raf)
    }, delay)

    return () => clearTimeout(tick)
  }, [inView, children, delay, speed])

  return (
    <span ref={wrapRef as React.RefObject<HTMLSpanElement>} className={className}>
      <span ref={elRef}>{children}</span>
    </span>
  )
}
