import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Volume2, VolumeX } from 'lucide-react'

export default function FloatingVideo() {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage === 'ru' ? 'ru' : 'he'
  const [visible, setVisible] = useState(!sessionStorage.getItem('dominika-dismissed'))
  const [muted, setMuted] = useState(true)
  const [ended, setEnded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem('dominika-dismissed', '1')
  }

  const toggleMute = () => {
    setMuted(v => {
      if (videoRef.current) videoRef.current.muted = !v
      return !v
    })
  }

  if (!visible) return null

  const src = lang === 'ru' ? '/media/dominika-ru.mp4' : '/media/dominika-he.mp4'
  const name = lang === 'ru' ? 'Доминика' : 'דומיניקה'
  const title = lang === 'ru' ? 'Менеджер Vitlion Group' : 'מנהלת Vitlion Group'
  const ctaText = lang === 'ru' ? 'Готовы обсудить ваш проект?' : 'מוכנים לדון בפרויקט שלכם?'
  const ctaBtn = lang === 'ru' ? 'Оставить заявку' : 'השאירו פרטים'

  return (
    <div
      className="fixed bottom-44 end-4 z-[80] w-36 sm:w-52 rounded-2xl overflow-hidden shadow-2xl"
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
      <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
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
            onClick={toggleMute}
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
          onClick={dismiss}
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
  )
}
