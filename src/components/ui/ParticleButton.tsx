import { useRef, useCallback } from 'react'

interface Props {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
}

const COLORS = ['#E8C568', '#C4983A', '#F5F0E8', '#9B7420', '#FFE08A']

export default function ParticleButton({ href, onClick, children, className = '', target, rel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const burst = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top

    for (let i = 0; i < 22; i++) {
      const span = document.createElement('span')
      const angle = (i / 22) * Math.PI * 2
      const dist = 40 + Math.random() * 60
      const dx = Math.cos(angle) * dist
      const dy = Math.sin(angle) * dist
      const size = 3 + Math.random() * 4

      span.style.cssText = `
        position:absolute;left:${cx}px;top:${cy}px;
        width:${size}px;height:${size}px;border-radius:50%;
        background:${COLORS[i % COLORS.length]};pointer-events:none;
        --dx:${dx}px;--dy:${dy}px;
        animation:particleFly ${0.5 + Math.random() * 0.4}s ease-out forwards;
        transform:translate(-50%,-50%);z-index:50;
      `

      container.appendChild(span)
      setTimeout(() => span.remove(), 1000)
    }
  }, [])

  const cls = `relative overflow-hidden ${className}`

  if (href) {
    return (
      <div ref={containerRef} className="relative">
        <a
          href={href}
          target={target}
          rel={rel}
          className={cls}
          onMouseDown={burst}
          onClick={onClick}
        >
          {children}
        </a>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <button type="button" className={cls} onMouseDown={burst} onClick={onClick}>
        {children}
      </button>
    </div>
  )
}
