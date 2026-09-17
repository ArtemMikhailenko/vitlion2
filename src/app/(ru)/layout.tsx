import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '../globals.css'
import RootShell from '@/components/layout/RootShell'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/vitlion-favicon.png?v=4',
    apple: '/vitlion-favicon.png?v=4',
  },
  verification: {
    /*
     * Both codes stay. Google issues a separate one per property, and a site
     * can carry several at once — removing the old one to make room would
     * unverify whoever depends on it.
     */
    google: [
      'xF9KVq0a5POxVZgiEl5B-q6dmNSIdc068zRYtdt-Pk4',
      'Ku2jsc48Q00uAtHEESglg4vXZiZdDxPvXeMRfuzL-Kk',
    ],
  },
}

/*
 * HTML is cached for five minutes, not for a year.
 *
 * With no revalidate every page was fully static and Next sent
 * s-maxage=31536000. Hostinger's CDN honoured it, which had two costs. After a
 * deploy it kept serving HTML from the previous build, pointing at JavaScript
 * chunks that the new build had deleted — the page loaded, requested a chunk
 * that 404'd, and crashed with "Application error". And edits saved in the
 * admin panel regenerated the page on the server while the CDN went on handing
 * visitors its own copy, so they appeared to do nothing until the cache was
 * purged by hand.
 *
 * Five minutes bounds both. expireTime in next.config caps how long a stale
 * copy may still be served while a fresh one is fetched.
 */
export const revalidate = 300

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
}

export default function RussianRootLayout({ children }: { children: ReactNode }) {
  return <RootShell lang="ru">{children}</RootShell>
}
