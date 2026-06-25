import { useRef, useEffect, useState } from 'react'

interface Props {
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  children: React.ReactNode
  delay?: number
}

export default function ShimmerHeading({ as: Tag = 'h2', className = '', children, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [shimmer, setShimmer] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisible(true)
            setTimeout(() => setShimmer(true), 200)
          }, delay)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={`relative overflow-hidden ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
      {/* Gold shimmer sweep */}
      {shimmer && (
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(232,197,104,0.45) 50%, transparent 70%)',
            backgroundSize: '250% 100%',
            animation: 'shimmerSweep 0.9s ease-out forwards',
          }}
        />
      )}
    </Tag>
  )
}
