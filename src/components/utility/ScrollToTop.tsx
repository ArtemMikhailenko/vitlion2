'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Resets scroll position to the top on every route change.
 * Temporarily disables the global `scroll-behavior: smooth` so the jump is instant.
 */
export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    const html = document.documentElement
    const previousScrollBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    html.style.scrollBehavior = previousScrollBehavior
  }, [pathname])

  return null
}
