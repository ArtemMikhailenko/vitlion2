import type { Metadata } from 'next'
import { ServicesRoute } from '@/components/routes/Routes'
import { SEO_PAGES } from '@/data/seoContent'
import { buildMetadata } from '@/lib/seo'

const seo = SEO_PAGES.services['ru']

export const metadata: Metadata = buildMetadata({
  lang: 'ru',
  path: 'services',
  title: seo.title,
  description: seo.description,
  indexable: true,
})

export default function Page() {
  return <ServicesRoute lang="ru" />
}
