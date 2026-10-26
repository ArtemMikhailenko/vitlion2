import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryRoute } from '@/components/routes/Routes'
import { INDEXABLE_CATEGORY_SLUGS, SEO_PAGES } from '@/data/seoContent'
import { getPageSeo } from '@/lib/content'
import { findCategoryLive } from '@/lib/content/catalog'
import { buildMetadata } from '@/lib/seo'

type Params = { category: string }

// Known slugs are prerendered; an unknown one still 404s, because the page
// below checks the slug itself. `dynamicParams = false` used to say the same
// thing declaratively, but it also meant a page whose prerender had been
// invalidated — which an admin save does, site-wide — had nothing left to fall
// back to and answered 404 until the next deploy.

export function generateStaticParams(): Params[] {
  return INDEXABLE_CATEGORY_SLUGS.map(category => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category } = await params
  if (!SEO_PAGES[category]) return {}
  const seo = await getPageSeo(category, 'ru')
  if (!seo) return {}

  return buildMetadata({
    lang: 'ru',
    path: category,
    title: seo.title,
    description: seo.description,
    indexable: true,
  })
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { category } = await params
  if (!SEO_PAGES[category] || !(await findCategoryLive(category))) notFound()

  return <CategoryRoute lang="ru" slug={category} />
}
