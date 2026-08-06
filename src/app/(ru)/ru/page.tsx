import type { Metadata } from 'next'
import { HomeRoute } from '@/components/routes/Routes'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ lang: 'ru' })

export default function Page() {
  return <HomeRoute lang="ru" />
}
