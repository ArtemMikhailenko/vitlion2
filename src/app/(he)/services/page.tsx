import type { Metadata } from 'next'
import { ServicesRoute } from '@/components/routes/Routes'
import { getPageSeo } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('services', 'he')
  return buildMetadata({
    lang: 'he',
    path: 'services',
    title: seo?.title,
    description: seo?.description,
    indexable: true,
  })
}

export default function Page() {
  return <ServicesRoute lang="he" />
}
