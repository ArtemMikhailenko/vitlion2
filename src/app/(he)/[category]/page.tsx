import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryRoute } from '@/components/routes/Routes'
import { INDEXABLE_CATEGORY_SLUGS, SEO_PAGES } from '@/data/seoContent'
import { buildMetadata } from '@/lib/seo'

type Params = { category: string }

// Only the known category slugs exist; anything else is a real 404 rather than
// the old SPA behaviour of silently rendering the homepage with a 200.
export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return INDEXABLE_CATEGORY_SLUGS.map(category => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category } = await params
  const seo = SEO_PAGES[category]?.['he']
  if (!seo) return {}

  return buildMetadata({
    lang: 'he',
    path: category,
    title: seo.title,
    description: seo.description,
    indexable: true,
  })
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { category } = await params
  if (!SEO_PAGES[category]) notFound()

  return <CategoryRoute lang="he" slug={category} />
}
