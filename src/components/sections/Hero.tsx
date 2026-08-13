'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/client'

const VIDEO_UNBLUR_MS = 900
const PANEL_ENTER_MS = 480
const TEXT_INTRO_GAP_MS = 60
const TEXT_CHAR_STAGGER_MS = 30
const TEXT_LINE_GAP_MS = 60
const HERO_EASE = [0.16, 1, 0.3, 1] as const
const VIDEO_INITIAL_BLUR = 'blur(10px)'
const VIDEO_SHARP_BLUR = 'blur(0px)'
const VIDEO_INITIAL_SCALE = 1.025
const VIDEO_SHARP_SCALE = 1
const HERO_CURSOR_REVEAL_RADIUS = 150
const HERO_CURSOR_REVEAL_FEATHER = 52
const HERO_BUTTON_REVEAL_PADDING_X = 10
const HERO_BUTTON_REVEAL_PADDING_Y = 8
const HERO_BUTTON_REVEAL_MASK = 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27 preserveAspectRatio=%27none%27%3E%3Crect x=%270%27 y=%270%27 width=%27100%27 height=%27100%27 rx=%2718%27 ry=%2718%27 fill=%27black%27/%3E%3C/svg%3E")'

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}


function SparkyLine({ text, delay, color = 'ink' }: { text: string; delay: number; color?: 'ink' | 'gold' }) {
  const [revealed, setRevealed] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const start = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(start)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (revealed >= text.length) return
    const id = setTimeout(() => setRevealed(r => r + 1), TEXT_CHAR_STAGGER_MS)
    return () => clearTimeout(id)
  }, [started, revealed, text.length])

  return (
    <span className="inline">
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={
            i < revealed
              ? {
                  animation: `spark 0.4s ease-out both`,
                  animationDelay: `0ms`,
                  color: color === 'gold' ? undefined : '#1A1D24',
                }
              : { opacity: 0 }
          }
          className={color === 'gold' ? 'text-gold' : ''}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [cursorRevealState, setCursorRevealState] = useState({ x: -1000, y: -1000, width: HERO_CURSOR_REVEAL_RADIUS * 2, height: HERO_CURSOR_REVEAL_RADIUS * 2, radius: HERO_CURSOR_REVEAL_RADIUS, progress: 0 })
  const heroStageRef = useRef<HTMLDivElement | null>(null)
  const mainVideoRef = useRef<HTMLVideoElement | null>(null)
  const panelVideoRef = useRef<HTMLVideoElement | null>(null)
  const primaryCtaRef = useRef<HTMLAnchorElement | null>(null)
  const secondaryCtaRef = useRef<HTMLAnchorElement | null>(null)
  const cursorRevealTargetRef = useRef({ x: -1000, y: -1000, width: HERO_CURSOR_REVEAL_RADIUS * 2, height: HERO_CURSOR_REVEAL_RADIUS * 2, radius: HERO_CURSOR_REVEAL_RADIUS, active: false, mode: 'circle' as 'circle' | 'button' })
  const cursorRevealCurrentRef = useRef({ x: -1000, y: -1000, width: HERO_CURSOR_REVEAL_RADIUS * 2, height: HERO_CURSOR_REVEAL_RADIUS * 2, radius: HERO_CURSOR_REVEAL_RADIUS, progress: 0 })
  const cursorRevealFrameRef = useRef<number | null>(null)
  const videoControls = useAnimationControls()
  const panelControls = useAnimationControls()
  const accentControls = useAnimationControls()
  const mobilePanelControls = useAnimationControls()
  const shouldReduceMotion = useReducedMotion()
  // Desktop stretches the background to 1920px and wider, where the phone-sized
  // encode visibly softens once the intro blur clears. Resolved after mount so
  // phones are not made to download the heavy file; the poster covers the gap.
  const [heroVideoSrc, setHeroVideoSrc] = useState<string | null>(null)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)').matches
    setHeroVideoSrc(wide ? '/media/hero-bg-hd.mp4' : '/media/hero-bg.mp4')
  }, [])

  const isHebrew = (i18n.resolvedLanguage ?? i18n.language).startsWith('he')
  const titleText: string = t('hero.title')
  const titleLines = isHebrew
    ? (() => {
        const normalizedTitle = titleText.replace(/\s*\n\s*/g, ' ').trim()
        const lastSpaceIndex = normalizedTitle.lastIndexOf(' ')

        if (lastSpaceIndex === -1) return [normalizedTitle]

        return [
          normalizedTitle.slice(0, lastSpaceIndex),
          normalizedTitle.slice(lastSpaceIndex + 1),
        ]
      })()
    : titleText.split('\n')
  const primaryButtonClass = isHebrew
    ? 'inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-[#111] shadow-lg shadow-gold/25 transition-all duration-200 hover:scale-105 hover:bg-gold-light hover:shadow-gold/45 active:scale-95 sm:px-8 sm:py-4 sm:text-base'
    : 'inline-flex w-full sm:w-auto justify-center min-h-11 items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-[#111] transition-colors duration-200 hover:bg-gold-light active:scale-[0.98]'
  const secondaryButtonClass = isHebrew
    ? 'inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl border border-white/60 bg-white/85 backdrop-blur-sm px-5 py-3 text-sm font-semibold text-[#1C1F26] transition-all duration-200 hover:bg-white hover:border-white active:scale-95 sm:px-8 sm:py-4 sm:text-base'
    : 'inline-flex w-full sm:w-auto justify-center min-h-11 items-center gap-2 rounded-lg border border-white/60 bg-white/85 backdrop-blur-sm px-5 py-3 text-sm font-medium text-[#1C1F26] transition-colors duration-200 hover:bg-white hover:border-white active:scale-[0.98]'
  const cursorRevealMask = cursorRevealState.progress > 0.01
    ? (cursorRevealTargetRef.current.mode === 'button'
        ? `linear-gradient(black, black), ${HERO_BUTTON_REVEAL_MASK}`
        : `radial-gradient(circle ${HERO_CURSOR_REVEAL_RADIUS}px at ${cursorRevealState.x}px ${cursorRevealState.y}px, rgba(0, 0, 0, ${1 - cursorRevealState.progress}) 0, rgba(0, 0, 0, ${1 - cursorRevealState.progress}) ${Math.max(0, HERO_CURSOR_REVEAL_RADIUS - HERO_CURSOR_REVEAL_FEATHER)}px, rgba(0, 0, 0, 1) ${HERO_CURSOR_REVEAL_RADIUS}px)`)
    : undefined
  const cursorRevealMaskExtraStyles = cursorRevealState.progress > 0.01 && cursorRevealTargetRef.current.mode === 'button'
    ? {
        WebkitMaskComposite: 'source-out',
        maskComposite: 'exclude',
        WebkitMaskMode: `alpha, alpha`,
        maskMode: `alpha, alpha`,
        WebkitMaskOpacity: `1, ${cursorRevealState.progress}`,
        WebkitMaskPosition: `0 0, ${cursorRevealState.x - cursorRevealState.width / 2}px ${cursorRevealState.y - cursorRevealState.height / 2}px`,
        maskPosition: `0 0, ${cursorRevealState.x - cursorRevealState.width / 2}px ${cursorRevealState.y - cursorRevealState.height / 2}px`,
        WebkitMaskSize: `100% 100%, ${cursorRevealState.width}px ${cursorRevealState.height}px`,
        maskSize: `100% 100%, ${cursorRevealState.width}px ${cursorRevealState.height}px`,
        WebkitMaskRepeat: 'no-repeat, no-repeat',
        maskRepeat: 'no-repeat, no-repeat',
      }
    : undefined

  useEffect(() => {
    const animateCursorReveal = () => {
      const current = cursorRevealCurrentRef.current
      const target = cursorRevealTargetRef.current

      const positionLerp = target.active ? 0.18 : 0.12
      const progressLerp = target.active ? 0.18 : 0.24
      current.x += (target.x - current.x) * positionLerp
      current.y += (target.y - current.y) * positionLerp
      current.width += (target.width - current.width) * positionLerp
      current.height += (target.height - current.height) * positionLerp
      current.radius += (target.radius - current.radius) * positionLerp
      current.progress += ((target.active ? 1 : 0) - current.progress) * progressLerp

      if (!target.active && current.progress < 0.02) {
        current.progress = 0
      }

      setCursorRevealState({ x: current.x, y: current.y, width: current.width, height: current.height, radius: current.radius, progress: current.progress })
      cursorRevealFrameRef.current = window.requestAnimationFrame(animateCursorReveal)
    }

    if (shouldReduceMotion) {
      setCursorRevealState({ x: -1000, y: -1000, width: HERO_CURSOR_REVEAL_RADIUS * 2, height: HERO_CURSOR_REVEAL_RADIUS * 2, radius: HERO_CURSOR_REVEAL_RADIUS, progress: 0 })
      return
    }

    cursorRevealFrameRef.current = window.requestAnimationFrame(animateCursorReveal)

    return () => {
      if (cursorRevealFrameRef.current !== null) {
        window.cancelAnimationFrame(cursorRevealFrameRef.current)
      }
    }
  }, [shouldReduceMotion])

  const handleDesktopRevealMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return

    const heroBounds = heroStageRef.current?.getBoundingClientRect()
    if (!heroBounds) return

    if (window.innerWidth < 1024) {
      cursorRevealTargetRef.current.active = false
      return
    }

    if (cursorRevealTargetRef.current.mode === 'button') return

    const relativeX = event.clientX - heroBounds.left
    const relativeY = event.clientY - heroBounds.top
    const revealBoundary = isHebrew ? heroBounds.width * 0.42 : heroBounds.width * 0.58
    const isOnInteractiveSide = isHebrew ? relativeX >= revealBoundary : relativeX <= revealBoundary

    if (!isOnInteractiveSide) {
      cursorRevealTargetRef.current.active = false
      return
    }

    cursorRevealTargetRef.current = {
      x: relativeX,
      y: relativeY,
      width: HERO_CURSOR_REVEAL_RADIUS * 2,
      height: HERO_CURSOR_REVEAL_RADIUS * 2,
      radius: HERO_CURSOR_REVEAL_RADIUS,
      active: true,
      mode: 'circle',
    }
  }

  const handleDesktopRevealEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return

    handleDesktopRevealMove(event)
  }

  const handleDesktopRevealLeave = () => {
    cursorRevealTargetRef.current.active = false
  }

  const setButtonRevealTarget = (button: HTMLAnchorElement) => {
    if (shouldReduceMotion) return

    const heroBounds = heroStageRef.current?.getBoundingClientRect()
    const buttonBounds = button.getBoundingClientRect()
    if (!heroBounds) return

    cursorRevealTargetRef.current = {
      x: buttonBounds.left - heroBounds.left + buttonBounds.width / 2,
      y: buttonBounds.top - heroBounds.top + buttonBounds.height / 2,
      width: buttonBounds.width + HERO_BUTTON_REVEAL_PADDING_X * 2,
      height: buttonBounds.height + HERO_BUTTON_REVEAL_PADDING_Y * 2,
      radius: 14,
      active: true,
      mode: 'button',
    }
  }

  const handleButtonGroupRevealMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return

    const buttons = [primaryCtaRef.current, secondaryCtaRef.current].filter(Boolean) as HTMLAnchorElement[]
    if (buttons.length === 0) return

    const nearestButton = buttons.reduce((nearest, button) => {
      const nearestBounds = nearest.getBoundingClientRect()
      const buttonBounds = button.getBoundingClientRect()
      const nearestDistance = Math.hypot(
        event.clientX - (nearestBounds.left + nearestBounds.width / 2),
        event.clientY - (nearestBounds.top + nearestBounds.height / 2)
      )
      const buttonDistance = Math.hypot(
        event.clientX - (buttonBounds.left + buttonBounds.width / 2),
        event.clientY - (buttonBounds.top + buttonBounds.height / 2)
      )

      return buttonDistance < nearestDistance ? button : nearest
    }, buttons[0])

    setButtonRevealTarget(nearestButton)
  }

  const handleButtonGroupRevealLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return

    const heroBounds = heroStageRef.current?.getBoundingClientRect()
    if (!heroBounds) return

    const relativeX = event.clientX - heroBounds.left
    const relativeY = event.clientY - heroBounds.top
    const revealBoundary = isHebrew ? heroBounds.width * 0.42 : heroBounds.width * 0.58
    const isOnInteractiveSide = isHebrew ? relativeX >= revealBoundary : relativeX <= revealBoundary

    if (!isOnInteractiveSide) {
      cursorRevealTargetRef.current.active = false
      return
    }

    cursorRevealTargetRef.current = {
      x: relativeX,
      y: relativeY,
      width: HERO_CURSOR_REVEAL_RADIUS * 2,
      height: HERO_CURSOR_REVEAL_RADIUS * 2,
      radius: HERO_CURSOR_REVEAL_RADIUS,
      active: true,
      mode: 'circle',
    }
  }

  useEffect(() => {
    const mainVideo = mainVideoRef.current
    const panelVideo = panelVideoRef.current

    if (!mainVideo || !panelVideo) return

    const syncPanelVideo = () => {
      if (Math.abs(panelVideo.currentTime - mainVideo.currentTime) > 0.08) {
        panelVideo.currentTime = mainVideo.currentTime
      }

      if (panelVideo.playbackRate !== mainVideo.playbackRate) {
        panelVideo.playbackRate = mainVideo.playbackRate
      }
    }

    const handlePlay = () => {
      syncPanelVideo()
      void panelVideo.play().catch(() => {})
    }

    const handlePause = () => {
      panelVideo.pause()
    }

    const handleLoadedData = () => {
      syncPanelVideo()

      if (!mainVideo.paused) {
        void panelVideo.play().catch(() => {})
      }
    }

    mainVideo.addEventListener('play', handlePlay)
    mainVideo.addEventListener('pause', handlePause)
    mainVideo.addEventListener('seeking', syncPanelVideo)
    mainVideo.addEventListener('timeupdate', syncPanelVideo)
    mainVideo.addEventListener('ratechange', syncPanelVideo)
    panelVideo.addEventListener('loadeddata', handleLoadedData)

    syncPanelVideo()

    return () => {
      mainVideo.removeEventListener('play', handlePlay)
      mainVideo.removeEventListener('pause', handlePause)
      mainVideo.removeEventListener('seeking', syncPanelVideo)
      mainVideo.removeEventListener('timeupdate', syncPanelVideo)
      mainVideo.removeEventListener('ratechange', syncPanelVideo)
      panelVideo.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [])

  useLayoutEffect(() => {
    const animationsDisabled = shouldReduceMotion || document.documentElement.classList.contains('acc-no-anim')
    const panelOrigin = isHebrew ? 1 : 0

    if (animationsDisabled) {
      videoControls.set({ filter: VIDEO_SHARP_BLUR, scale: VIDEO_SHARP_SCALE })
      panelControls.set({ opacity: 1, scaleX: 1, originX: panelOrigin })
      accentControls.set({ opacity: 1, scaleX: 1, originX: panelOrigin })
      mobilePanelControls.set({ opacity: 1, scaleX: 1, originX: panelOrigin })
      setMounted(true)
      return
    }

    setMounted(false)

    videoControls.set({ filter: VIDEO_INITIAL_BLUR, scale: VIDEO_INITIAL_SCALE })
    panelControls.set({ opacity: 0, scaleX: 0, originX: panelOrigin })
    accentControls.set({ opacity: 0, scaleX: 0, originX: panelOrigin })
    mobilePanelControls.set({ opacity: 0, scaleX: 0, originX: panelOrigin })

    let cancelled = false

    const runIntro = async () => {
      await wait(40)
      if (cancelled) return

      const videoPromise = videoControls.start({
        filter: VIDEO_SHARP_BLUR,
        scale: VIDEO_SHARP_SCALE,
        transition: {
          duration: VIDEO_UNBLUR_MS / 1000,
          ease: HERO_EASE,
        },
      })

      const panelsPromise = Promise.all([
        panelControls.start({
          opacity: 1,
          scaleX: 1,
          originX: panelOrigin,
          transition: {
            duration: PANEL_ENTER_MS / 1000,
            ease: HERO_EASE,
          },
        }),
        accentControls.start({
          opacity: 1,
          scaleX: 1,
          originX: panelOrigin,
          transition: {
            duration: PANEL_ENTER_MS / 1000,
            ease: HERO_EASE,
            delay: 0.04,
          },
        }),
        mobilePanelControls.start({
          opacity: 1,
          scaleX: 1,
          originX: panelOrigin,
          transition: {
            duration: PANEL_ENTER_MS / 1000,
            ease: HERO_EASE,
          },
        }),
      ])

      // Kick off the text reveal as soon as the video starts showing through,
      // instead of waiting for the panel/video animations to finish.
      await wait(TEXT_INTRO_GAP_MS)
      if (!cancelled) setMounted(true)

      await Promise.all([videoPromise, panelsPromise])
    }

    runIntro()

    return () => {
      cancelled = true
    }
  }, [accentControls, isHebrew, mobilePanelControls, panelControls, shouldReduceMotion, titleText, videoControls])

  return (
    <section id="home" className="relative min-h-screen pt-16 md:pt-20 bg-dark overflow-hidden">
      <div
        ref={heroStageRef}
        className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] overflow-hidden"
        dir="ltr"
        onMouseEnter={handleDesktopRevealEnter}
        onMouseMove={handleDesktopRevealMove}
        onMouseLeave={handleDesktopRevealLeave}
        style={{ cursor: cursorRevealState.progress > 0.01 ? 'none' : undefined }}
      >
        <div className="absolute inset-0 bg-[#0F1118]">
          <motion.video
            ref={mainVideoRef}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ filter: VIDEO_INITIAL_BLUR, scale: VIDEO_INITIAL_SCALE }}
            animate={videoControls}
            autoPlay muted loop playsInline poster="/media/hero-bg.webp"
            src={heroVideoSrc ?? undefined}
          />
          <div
            className={`absolute inset-0 ${isHebrew ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-[#0A0A0A]/15 via-[#0A0A0A]/10 to-[#0A0A0A]/45`}
            style={cursorRevealMask ? { WebkitMaskImage: cursorRevealMask, maskImage: cursorRevealMask, ...cursorRevealMaskExtraStyles } : undefined}
          />
        </div>

        <motion.div
          className="absolute inset-y-0 left-0 hidden w-full overflow-hidden lg:block"
          initial={{ opacity: 0, scaleX: 0, originX: isHebrew ? 1 : 0 }}
          animate={panelControls}
          style={{
            clipPath: isHebrew ? 'polygon(24% 0, 100% 0, 100% 100%, 62% 100%)' : 'polygon(0 0, 76% 0, 38% 100%, 0 100%)',
            WebkitMaskImage: cursorRevealMask,
            maskImage: cursorRevealMask,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            ...cursorRevealMaskExtraStyles,
          }}
          aria-hidden="true"
        >
          <video
            ref={panelVideoRef}
            className="absolute inset-0 h-full w-full scale-[1.08] object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/media/hero-bg.webp"
            style={{ filter: 'blur(20px) brightness(0.32) saturate(0.82)' }}
            // Same file as the main background so the browser serves it from
            // cache — this panel is blurred to 20px, so it costs nothing extra
            // and adds no second download.
            src={heroVideoSrc ?? undefined}
          />
          <div className="absolute inset-0 bg-[#0C0E14]/22" />
        </motion.div>

        {cursorRevealState.progress > 0.01 && !shouldReduceMotion && (
          <div
            className="pointer-events-none absolute hidden rounded-full lg:block"
            aria-hidden="true"
            style={{
              left: cursorRevealState.x,
              top: cursorRevealState.y,
              width: cursorRevealState.width,
              height: cursorRevealState.height,
              transform: 'translate(-50%, -50%)',
              borderRadius: cursorRevealState.radius,
              border: cursorRevealTargetRef.current.mode === 'button' ? '1px solid rgba(232,197,104,0.95)' : '1px solid rgba(255,255,255,0.78)',
              opacity: cursorRevealState.progress,
              boxShadow: cursorRevealTargetRef.current.mode === 'button'
                ? '0 0 0 1px rgba(196,152,58,0.4), 0 0 26px rgba(232,197,104,0.34), inset 0 0 18px rgba(232,197,104,0.08)'
                : '0 0 0 1px rgba(196,152,58,0.35), 0 0 34px rgba(255,255,255,0.22), inset 0 0 26px rgba(255,255,255,0.08)',
              background: cursorRevealTargetRef.current.mode === 'button'
                ? 'linear-gradient(135deg, rgba(232,197,104,0.18), rgba(255,255,255,0.05))'
                : 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 38%, transparent 70%)',
            }}
          />
        )}

        <motion.div
          className={`absolute inset-y-0 hidden w-[38%] shadow-[24px_0_50px_rgba(15,17,23,0.18)] lg:block ${isHebrew ? 'left-[24%]' : 'left-[38%]'}`}
          initial={{ opacity: 0, scaleX: 0, originX: isHebrew ? 1 : 0 }}
          animate={accentControls}
          style={{
            clipPath: isHebrew ? 'polygon(0 0, 2.5% 0, 100% 100%, 97.5% 100%)' : 'polygon(0 100%, 2.5% 100%, 100% 0, 97.5% 0)',
            background: 'linear-gradient(90deg, rgba(196,152,58,0.08), rgba(255,255,255,0.9), rgba(196,152,58,0.18))',
          }}
          aria-hidden="true"
        />

        <motion.div
          className="absolute inset-0 bg-black/60 lg:hidden"
          initial={{ opacity: 0, scaleX: 0, originX: isHebrew ? 1 : 0 }}
          animate={mobilePanelControls}
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-[#0F1118]/20 lg:hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/35 to-transparent" />
        </div>

        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] items-center">
          <div className={`w-full px-4 pb-16 pt-10 sm:px-6 sm:pb-24 md:pt-16 lg:px-8 lg:pb-20 lg:pt-20 ${isHebrew ? 'lg:ml-auto lg:w-[58%]' : 'lg:w-[45%]'}`}>
            <div
              className={isHebrew ? 'mx-auto max-w-[980px] lg:ml-auto lg:mr-14' : 'mx-auto max-w-xl text-left lg:ml-16 lg:mr-auto'}
              dir="ltr"
            >
              <div className={isHebrew ? 'text-right' : 'text-left'} dir={isHebrew ? 'rtl' : 'ltr'}>
                <span
                  className="mb-5 inline-block text-sm font-semibold uppercase tracking-widest text-gold"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(14px)',
                    transition: 'opacity 0.55s ease, transform 0.55s ease',
                  }}
                >
                  {t('hero.badge')}
                </span>

                <h1 className={`mb-6 font-bold tracking-tight text-white ${isHebrew ? 'max-w-[820px] text-[2.2rem] leading-tight sm:text-[3rem] md:text-[4rem] lg:text-[5.6rem] xl:text-[6.3rem]' : 'text-4xl leading-tight sm:text-5xl lg:text-7xl xl:text-8xl'}`}>
                  {titleLines.map((line, i) => (
                    <span key={i} className="block">
                      {/* The plain text is rendered until `mounted` flips, so the
                          heading exists in the server HTML. Previously this was
                          gated behind `mounted &&`, which left the homepage <h1>
                          completely empty for crawlers. `mounted` is set from a
                          layout effect, so the swap happens before paint. */}
                      {mounted ? (
                        <SparkyLine
                          text={line}
                          delay={i * (line.length * TEXT_CHAR_STAGGER_MS) + i * TEXT_LINE_GAP_MS}
                          color={i === 1 ? 'gold' : 'ink'}
                        />
                      ) : (
                        line
                      )}
                    </span>
                  ))}
                  <span
                    className={`block font-semibold text-white/80 ${
                      isHebrew
                        ? 'mt-3 text-[1.05rem] sm:text-[1.3rem] md:text-[1.6rem] lg:text-[2rem]'
                        : 'mt-3 text-lg sm:text-xl lg:text-2xl'
                    }`}
                  >
                    {t('hero.titleSuffix')}
                  </span>
                </h1>

                <p
                  className={`mb-6 sm:mb-10 text-base leading-relaxed sm:text-lg lg:text-xl ${isHebrew ? 'max-w-2xl text-white/72' : 'max-w-lg text-white/72'}`}
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.7s ease, transform 0.7s ease',
                    transitionDelay: mounted ? `${titleLines.join('').length * TEXT_CHAR_STAGGER_MS + 250}ms` : '0ms',
                  }}
                >
                  {t('hero.subtitle')}
                </p>

                <div
                  className="relative -m-4 inline-flex flex-col sm:flex-row gap-3 p-4 items-stretch sm:items-center"
                  onMouseEnter={handleButtonGroupRevealMove}
                  onMouseMove={handleButtonGroupRevealMove}
                  onMouseLeave={handleButtonGroupRevealLeave}
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.7s ease, transform 0.7s ease',
                    transitionDelay: mounted ? `${titleLines.join('').length * TEXT_CHAR_STAGGER_MS + 350}ms` : '0ms',
                  }}
                >
                  <a
                    ref={primaryCtaRef}
                    href="/contact"
                    className={primaryButtonClass}
                  >
                    {t('hero.cta')}
                    <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a
                    ref={secondaryCtaRef}
                    href="/projects"
                    className={secondaryButtonClass}
                  >
                    {t('hero.ctaSecondary')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
