import { useEffect, useRef } from 'react'

interface Props {
  src: string
  onClose: () => void
}

export default function VideoModal({ src, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    videoRef.current?.play()
  }, [])

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <button
        className="absolute top-5 end-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={src}
          controls
          preload="none"
          className="w-full h-full object-contain bg-black"
          playsInline
        />
      </div>
    </div>
  )
}
