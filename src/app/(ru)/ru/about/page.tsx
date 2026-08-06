import type { Metadata } from 'next'
import { AboutRoute } from '@/components/routes/Routes'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ lang: 'ru', path: 'about' })

export default function Page() {
  return <AboutRoute lang="ru" />
}
