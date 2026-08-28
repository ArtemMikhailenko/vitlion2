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

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
}

export default function RussianRootLayout({ children }: { children: ReactNode }) {
  return <RootShell lang="ru">{children}</RootShell>
}
