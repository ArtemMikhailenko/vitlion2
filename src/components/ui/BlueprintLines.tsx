import { useEffect, useRef } from 'react'

export default function BlueprintLines() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.querySelectorAll('path, line, rect').forEach((p, i) => {
          const el = p as SVGElement
          el.style.animationDelay = `${i * 180}ms`
          el.style.animationPlayState = 'running'
        })
      }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <svg
      ref={ref}
      viewBox="0 0 900 120"
      className="w-full h-16 sm:h-20 pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <style>{`
          .bp-path {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: blueprintDraw 1.8s cubic-bezier(0.4,0,0.2,1) forwards paused;
          }
        `}</style>
      </defs>

      {/* Horizontal main rail */}
      <line className="bp-path" x1="0" y1="60" x2="900" y2="60"
        stroke="rgba(196,152,58,0.3)" strokeWidth="1" />

      {/* Vertical ticks */}
      {[100, 200, 300, 450, 600, 700, 800].map((x, i) => (
        <line key={i} className="bp-path" x1={x} y1="48" x2={x} y2="72"
          stroke="rgba(196,152,58,0.5)" strokeWidth="1.5" />
      ))}

      {/* Corner brackets left */}
      <path className="bp-path" d="M 40 20 L 20 20 L 20 100"
        stroke="rgba(196,152,58,0.4)" strokeWidth="1.5" fill="none" />
      {/* Corner brackets right */}
      <path className="bp-path" d="M 860 20 L 880 20 L 880 100"
        stroke="rgba(196,152,58,0.4)" strokeWidth="1.5" fill="none" />

      {/* Small cross markers */}
      {[240, 450, 660].map((x, i) => (
        <g key={i}>
          <line className="bp-path" x1={x - 8} y1="60" x2={x + 8} y2="60"
            stroke="rgba(196,152,58,0.6)" strokeWidth="1.5" />
          <line className="bp-path" x1={x} y1="52" x2={x} y2="68"
            stroke="rgba(196,152,58,0.6)" strokeWidth="1.5" />
          <rect className="bp-path" x={x - 3} y="57" width="6" height="6"
            stroke="rgba(196,152,58,0.4)" strokeWidth="1" fill="none"
            transform={`rotate(45 ${x} 60)`} />
        </g>
      ))}

      {/* Dimension arc */}
      <path className="bp-path" d="M 100 60 Q 450 10 800 60"
        stroke="rgba(196,152,58,0.15)" strokeWidth="1" fill="none" strokeDasharray="4 6" />
    </svg>
  )
}
