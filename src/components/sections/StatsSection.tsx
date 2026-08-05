import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInView } from '../../hooks/useInView'

const FLOORS = 12
const SCRAMBLE_CHARS = '0123456789'

const STATS = [
  { target: 500, suffix: '+', labelKey: 'stats.projects.label' },
  { target: 10, suffix: '+', labelKey: 'stats.experience.label' },
  { target: 10, suffix: '', labelKey: 'stats.warranty.label' },
  { target: 20, suffix: '+', labelKey: 'stats.cities.label' },
]

function Building({ fill, done }: { fill: number; done: boolean }) {
  const filledFloors = Math.round(fill * FLOORS)

  return (
    <div className="flex items-end justify-center gap-px mb-5">
      {[3, 5, 7, 5, 3].map((height, col) => (
        <div key={col} className="flex flex-col-reverse gap-px" style={{ height: `${height * 8}px`, width: '10px' }}>
          {Array.from({ length: height }).map((_, row) => {
            const active = filledFloors > 0 && row < Math.ceil((filledFloors / FLOORS) * height)
            return (
              <div
                key={row}
                className="w-full rounded-sm"
                style={{
                  height: '6px',
                  background: active
                    ? (done ? 'rgba(196,152,58,0.9)' : 'rgba(196,152,58,0.7)')
                    : 'rgba(196,152,58,0.10)',
                  border: active ? '1px solid rgba(196,152,58,0.6)' : '1px solid rgba(196,152,58,0.15)',
                  transition: 'background 0.2s ease, border-color 0.2s ease',
                  transitionDelay: active ? `${row * 40}ms` : '0ms',
                  boxShadow: active && done ? '0 0 6px rgba(196,152,58,0.5)' : undefined,
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function StatCounter({ target, suffix, delay, active }: {
  target: number; suffix: string; delay: number; active: boolean
}) {
  const [display, setDisplay] = useState('0')
  const [fill, setFill] = useState(0)
  const [done, setDone] = useState(false)
  const raf = useRef(0)
  const t0 = useRef<number | null>(null)
  const DURATION = 2200

  useEffect(() => {
    if (!active) return
    t0.current = null
    setDisplay('0'); setFill(0); setDone(false)
    const targetStr = String(target)

    const tick = (now: number) => {
      if (t0.current === null) t0.current = now + delay
      if (now < t0.current) { raf.current = requestAnimationFrame(tick); return }

      const p = Math.min((now - t0.current) / DURATION, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setFill(e)

      const lockedDigits = Math.floor(p * (targetStr.length + 0.9))
      let scrambled = ''
      for (let i = 0; i < targetStr.length; i++) {
        scrambled += i < lockedDigits ? targetStr[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * 10)]
      }
      setDisplay(scrambled)

      if (p < 1) {
        raf.current = requestAnimationFrame(tick)
      } else {
        setDisplay(targetStr); setFill(1); setDone(true)
      }
    }
    raf.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf.current); t0.current = null }
  }, [active, target, delay])

  return (
    <div className="flex flex-col items-center">
      <Building fill={fill} done={done} />
      <div
        className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gold tabular-nums font-mono leading-none"
        style={{
          textShadow: done
            ? '0 0 30px rgba(196,152,58,0.2)'
            : `0 0 ${fill * 50}px rgba(196,152,58,${fill * 0.4})`,
        }}
      >
        {display}{suffix}
      </div>
    </div>
  )
}

export default function StatsSection() {
  const { t } = useTranslation()
  const [ref, inView] = useInView({ threshold: 0.3 })

  return (
    <section
      className="relative border-y border-dark-border overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1E2128 0%, #22252E 50%, #1E2128 100%)' }}
      aria-label="Statistics"
    >
      {/* Blueprint grid — subtler on light bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(196,152,58,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,152,58,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(196,152,58,0.06) 0%, transparent 70%)' }}
      />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-dark-border rtl:divide-x-reverse">
          {STATS.map(({ target, suffix, labelKey }, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center px-4 sm:px-8 py-4"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: inView ? `${i * 80}ms` : '0ms',
              }}
            >
              <StatCounter target={target} suffix={suffix} delay={i * 160} active={inView} />
              <p className="mt-4 text-xs text-ink-soft uppercase tracking-widest">{t(labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
