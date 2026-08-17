import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Vitlion — панель управления',
  // The panel must never reach search results, independently of robots.txt.
  robots: { index: false, follow: false },
}

/**
 * Root layout for the admin panel.
 *
 * The public site has one root layout per language; this is a third, so the
 * panel gets its own <html> and does not inherit the site's RTL direction or
 * its fonts. It is always LTR and always in Russian — one operator, no need
 * to translate the tooling.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" dir="ltr">
      <body className="min-h-screen bg-[#0C0E14] text-[#E4E0D8] antialiased">{children}</body>
    </html>
  )
}
