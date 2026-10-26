'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Full-screen viewer for a model's photographs.
 *
 * This existed in the old ServiceDetailModal and was lost when the models moved
 * from a modal onto pages of their own — the modal became dead code and its
 * image viewer went with it, so the gallery on a model page had been plain
 * images that did nothing when tapped.
 *
 * The images themselves stay server-rendered in the page: this wraps them
 * rather than replacing them, so the markup a crawler sees is unchanged and the
 * photographs still appear with JavaScript disabled.
 */
export default function Lightbox({
  images,
  alt,
  children,
}: {
  /** Same order as the thumbnails this wraps. */
  images: string[]
  alt: string
  children: React.ReactNode
}) {
  const [index, setIndex] = useState<number | null>(null)
  const open = index !== null

  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (delta: number) =>
      setIndex(current =>
        current === null ? null : (current + delta + images.length) % images.length,
      ),
    [images.length],
  )

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      // Arrows follow the screen, not the text: the page is RTL in Hebrew, but
      // the right-hand arrow should still move to the picture on the right.
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)

    // The page behind must not scroll while the viewer is over it.
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [open, close, step])

  /**
   * Clicks are caught on the way down rather than bound to each image: the
   * thumbnails are rendered on the server and passed in as children, so there
   * is nothing here to attach a handler to.
   */
  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest('img')
    if (!target) return

    const found = images.indexOf(target.getAttribute('src') ?? '')
    if (found === -1) return

    event.preventDefault()
    setIndex(found)
  }

  return (
    <>
      <div onClickCapture={onClickCapture} className="[&_img]:cursor-zoom-in">
        {children}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/95 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <img
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={event => event.stopPropagation()}
          />

          <button
            type="button"
            onClick={close}
            aria-label="סגור / Закрыть"
            className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition-colors hover:bg-white/20"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <Arrow side="left" onClick={() => step(-1)} />
              <Arrow side="right" onClick={() => step(1)} />
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm tabular-nums text-white">
                {index + 1} / {images.length}
              </p>
            </>
          )}
        </div>
      )}
    </>
  )
}

function Arrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={event => {
        event.stopPropagation()
        onClick()
      }}
      aria-label={side === 'left' ? 'הקודם / Предыдущее' : 'הבא / Следующее'}
      // Positioned by physical side, so the controls do not swap places when
      // the surrounding page is right-to-left.
      className={`absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl leading-none text-white transition-colors hover:bg-white/20 ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
      style={{ [side]: '0.75rem' }}
    >
      {side === 'left' ? '‹' : '›'}
    </button>
  )
}
