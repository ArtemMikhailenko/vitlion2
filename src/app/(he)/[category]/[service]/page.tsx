import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceRoute } from '@/components/routes/Routes'
import { allServiceParams, findService } from '@/lib/catalog'
import { buildMetadata } from '@/lib/seo'

type Params = { category: string; service: string }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return allServiceParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { category, service } = await params
  const entry = findService(category, service)
  if (!entry) return {}

  return buildMetadata({
    lang: 'he',
    path: `${category}/${service}`,
    title: `${entry.service.name.he} | ${entry.category.name.he} | Vitlion`,
    description: entry.service.short.he,
    indexable: true,
  })
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { category, service } = await params
  if (!findService(category, service)) notFound()

  return <ServiceRoute lang="he" categorySlug={category} serviceSlug={service} />
}
