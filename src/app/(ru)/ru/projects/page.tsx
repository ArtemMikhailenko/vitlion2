import type { Metadata } from 'next'
import { ProjectsRoute } from '@/components/routes/Routes'
import { buildMetadata } from '@/lib/seo'

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ lang: 'ru', path: 'projects' })
}

export default function Page() {
  return <ProjectsRoute lang="ru" />
}
