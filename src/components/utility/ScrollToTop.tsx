import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll position to the top on every route change.
 * React Router does not do this automatically for client-side navigation,
 * so without it a new page (e.g. a category page) can render mid-scroll.
 * Temporarily disables the global `scroll-behavior: smooth` so the jump is instant.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const html = document.documentElement
    const previousScrollBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    html.style.scrollBehavior = previousScrollBehavior
  }, [pathname])

  return null
}
