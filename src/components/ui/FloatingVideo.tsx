'use client'

import { useRef, useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/client'
import { readStorage, writeStorage } from '@/lib/safeStorage'
import { X, Volume2, VolumeX } from 'lucide-react'

export default function FloatingVideo() {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage === 'ru' ? 'ru' : 'he'
  const [visible, setVisible] = useState(() =>
    !readStorage('session', 'dominika-dismissed')
  )
  const [muted, setMuted] = useState(true)
  const [ended, setEnded] = useState(false)
  const [expanded, setExpanded] = useState(false)
  // Deferred so this marketing clip never competes with the hero video for
  // bandwidth during first paint — it only starts downloading once the browser
  // goes idle.
  const [deferredIn, setDeferredIn] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const expandedVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const idle = window.requestIdleCallback
    if (idle) {
      const id = idle(() => setDeferredIn(true), { timeout: 5000 })
      return () => window.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(() => setDeferredIn(true), 3000)
    return () => window.clearTimeout(id)
  }, [])

  const dismiss = () => {
    setVisible(false)
    writeStorage('session', 'dominika-dismissed', '1')
  }

  const toggleMute = () => {
    setMuted(v => {
      const next = !v
      if (videoRef.current) videoRef.current.muted = next
      if (expandedVideoRef.current) expandedVideoRef.current.muted = next
      return next
    })
  }

  // Pause when any video modal opens, resume when it closes
  useEffect(() => {
    const onOpen  = () => { videoRef.current?.pause(); expandedVideoRef.current?.pause() }
    const onClose = () => { if (!expanded && !ended) videoRef.current?.play().catch(() => {}) }
    window.addEventListener('ext-video-open',  onOpen)
    window.addEventListener('ext-video-close', onClose)
    return () => {
      window.removeEventListener('ext-video-open',  onOpen)
      window.removeEventListener('ext-video-close', onClose)
    }
  }, [expanded, ended])

  const openExpanded = () => {
    if (videoRef.current) videoRef.current.pause()
    setExpanded(true)
  }

  const closeExpanded = () => {
    setExpanded(false)
    if (expandedVideoRef.current && videoRef.current) {
      videoRef.current.currentTime = expandedVideoRef.current.currentTime
      videoRef.current.play().catch(() => {})
    }
  }

  if (!visible || !deferredIn) return null

  const src = lang === 'ru' ? '/media/dominika-ru.mp4' : '/media/dominika-he.mp4'
  const name = lang === 'ru' ? 'Доминика' : 'דומיניקה'
  const title = lang === 'ru' ? 'Менеджер Vitlion Group' : 'מנהלת Vitlion Group'
  const ctaText = lang === 'ru' ? 'Готовы обсудить ваш проект?' : 'מוכנים לדון בפרויקט שלכם?'
  const ctaBtn = lang === 'ru' ? 'Оставить заявку' : 'השאירו פרטים'

  return (
    <>
      {/* Expanded fullscreen overlay */}
      {expanded && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90"
          onClick={closeExpanded}
        >
          <div
            className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden"
            style={{ aspectRatio: '9/16', maxHeight: '90dvh' }}
            onClick={e => e.stopPropagation()}
          >
            <video
              ref={expandedVideoRef}
              src={src}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted={muted}
              onEnded={() => setEnded(true)}
            />
            <button
              onClick={closeExpanded}
              className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-white transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.25)' }}
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={toggleMute}
              className="absolute bottom-3 start-3 flex h-9 w-9 items-center justify-center rounded-full text-white transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.25)' }}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX className="h-4 w-4" strokeWidth={2.5} /> : <Volume2 className="h-4 w-4" strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      )}

      {/* Mini floating card */}
      <div
        className="fixed bottom-36 end-4 z-[80] w-32 sm:w-44 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: '#13161F',
          border: '1px solid #23263A',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          animation: 'fadeInUp 0.4s ease both',
        }}
      >
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Video area */}
        <div
          className="relative w-full cursor-pointer"
          style={{ aspectRatio: '3/4' }}
          onClick={openExpanded}
        >
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover object-top"
            playsInline
            autoPlay
            muted
            onEnded={() => setEnded(true)}
          />

          {/* Mute toggle */}
          {!ended && (
            <button
              onClick={e => { e.stopPropagation(); toggleMute() }}
              className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full text-white transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX className="h-3 w-3" strokeWidth={2.5} /> : <Volume2 className="h-3 w-3" strokeWidth={2.5} />}
            </button>
          )}

          {/* CTA overlay after video ends */}
          {ended && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center"
              style={{ background: 'rgba(12,14,20,0.88)' }}
              onClick={e => e.stopPropagation()}
            >
              <p className="text-xs font-semibold text-white leading-snug">{ctaText}</p>
              <a
                href="#contact"
                onClick={dismiss}
                className="mt-1 rounded-lg px-4 py-2 text-[11px] font-bold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #C4983A, #E8C568)', color: '#1C1F26' }}
              >
                {ctaBtn}
              </a>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={e => { e.stopPropagation(); dismiss() }}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white transition-all hover:scale-110"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
            aria-label="Close"
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
          </button>
        </div>

        {/* Name / title */}
        <div className="px-2.5 py-2 sm:px-3 sm:py-2.5" style={{ borderTop: '1px solid #23263A' }}>
          <p className="text-[11px] sm:text-[13px] font-bold text-ink">{name}</p>
          <p className="text-[9px] sm:text-[11px] text-ink-mid">{title}</p>
        </div>
      </div>
    </>
  )
}
