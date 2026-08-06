import type { Metadata } from 'next'
import { ServicesRoute } from '@/components/routes/Routes'
import { SEO_PAGES } from '@/data/seoContent'
import { buildMetadata } from '@/lib/seo'

const seo = SEO_PAGES.services['he']

export const metadata: Metadata = buildMetadata({
  lang: 'he',
  path: 'services',
  title: seo.title,
  description: seo.description,
  indexable: true,
})

export default function Page() {
  return <ServicesRoute lang="he" />
}
