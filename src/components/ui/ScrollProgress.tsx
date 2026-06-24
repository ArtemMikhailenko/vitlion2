import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 h-[2px] z-[100] bg-dark-border pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
