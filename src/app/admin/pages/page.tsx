import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { Notice } from '@/components/admin/fields'
import { isDbConfigured } from '@/db'
import { SEO_PAGES } from '@/data/seoContent'
import { getPageSeo } from '@/lib/content'
import { getCurrentUser } from '@/lib/session'
import { localePath } from '@/lib/i18n'
import { SITE_URL } from '@/lib/site'
import PagesEditor, { type PageSeoValues } from './PagesEditor'

export const dynamic = 'force-dynamic'

const LABELS: Record<string, string> = {
  services: 'Услуги',
  'electric-pergolas': 'Электрические перголы',
  'static-pergolas': 'Статичные перголы',
  'zip-shutters': 'ZIP-шторы',
  glazing: 'Остекление',
  'glass-roofs': 'Стеклянные крыши',
}

export default async function PagesPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const slugs = Object.keys(SEO_PAGES)

  const pages: PageSeoValues[] = await Promise.all(
    slugs.map(async slug => {
      const [he, ru] = await Promise.all([getPageSeo(slug, 'he'), getPageSeo(slug, 'ru')])
      return {
        slug,
        label: LABELS[slug] ?? slug,
        url: `${SITE_URL}${localePath('he', slug)}`,
        title: { he: he?.title ?? '', ru: ru?.title ?? '' },
        description: { he: he?.description ?? '', ru: ru?.description ?? '' },
        h1: { he: he?.h1 ?? '', ru: ru?.h1 ?? '' },
        ctaLabel: { he: he?.ctaLabel ?? '', ru: ru?.ctaLabel ?? '' },
      }
    }),
  )

  return (
    <AdminShell
      title="Страницы"
      description="Заголовки и описания страниц — то, как они выглядят в результатах поиска."
      userEmail={user.email}
    >
      {!isDbConfigured() && (
        <Notice kind="warn">
          <p className="mb-1 font-semibold text-[#E8C568]">Режим только для чтения</p>
          <p>
            Задайте <code className="text-[#E8C568]">DATABASE_URL</code>, чтобы можно было
            сохранять.
          </p>
        </Notice>
      )}

      <PagesEditor pages={pages} canSave={isDbConfigured()} />
    </AdminShell>
  )
}
