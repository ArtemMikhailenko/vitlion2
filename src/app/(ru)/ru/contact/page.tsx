import type { Metadata } from 'next'
import { ContactRoute } from '@/components/routes/Routes'
import { buildMetadata } from '@/lib/seo'

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ lang: 'ru', path: 'contact' })
}

export default function Page() {
  return <ContactRoute lang="ru" />
}
