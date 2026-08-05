import { useRef, useCallback } from 'react'

export function useHoloTilt<T extends HTMLElement>(maxDeg = 14) {
  const ref = useRef<T>(null)

  const onMove = useCallback((e: React.MouseEvent<T>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width   // 0–1
    const y = (e.clientY - rect.top) / rect.height    // 0–1
    const rotX = (y - 0.5) * -maxDeg
    const rotY = (x - 0.5) * maxDeg

    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`
    el.style.transition = 'transform 0.08s ease'

    // Holographic light reflection follows cursor
    const shine = el.querySelector<HTMLElement>('[data-shine]')
    if (shine) {
      shine.style.opacity = '1'
      shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(232,197,104,0.22) 0%, rgba(139,143,168,0.10) 40%, transparent 65%)`
    }
  }, [maxDeg])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    el.style.transition = 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)'
    const shine = el.querySelector<HTMLElement>('[data-shine]')
    if (shine) {
      shine.style.opacity = '0'
      shine.style.transition = 'opacity 0.4s ease'
    }
  }, [])

  return { ref, onMove, onLeave }
}
