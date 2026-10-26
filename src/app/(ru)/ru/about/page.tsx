import type { Metadata } from 'next'
import { AboutRoute } from '@/components/routes/Routes'
import { buildMetadata } from '@/lib/seo'

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ lang: 'ru', path: 'about' })
}

export default function Page() {
  return <AboutRoute lang="ru" />
}
