import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceRoute } from '@/components/routes/Routes'
import { allServiceParams } from '@/lib/catalog'
import { findServiceLive } from '@/lib/content/catalog'
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
  const entry = await findServiceLive(category, service)
  if (!entry) return {}

  return buildMetadata({
    lang: 'ru',
    path: `${category}/${service}`,
    title: `${entry.service.name.ru} | ${entry.category.name.ru} | Vitlion`,
    description: entry.service.short.ru,
    indexable: true,
  })
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { category, service } = await params
  if (!(await findServiceLive(category, service))) notFound()

  return <ServiceRoute lang="ru" categorySlug={category} serviceSlug={service} />
}
