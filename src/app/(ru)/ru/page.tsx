import type { Metadata } from 'next'
import { HomeRoute } from '@/components/routes/Routes'
import { buildMetadata } from '@/lib/seo'

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ lang: 'ru' })
}

export default function Page() {
  return <HomeRoute lang="ru" />
}
