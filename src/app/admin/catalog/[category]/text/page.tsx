import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import SplitEditor from '@/components/admin/SplitEditor'
import { isDbConfigured } from '@/db'
import { loadEntity } from '@/lib/admin/catalog'
import { getCategoryBlocks } from '@/lib/content'
import { getCurrentUser } from '@/lib/session'
import BlocksEditor from '../../BlocksEditor'

export const dynamic = 'force-dynamic'

export default async function CategoryTextPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const { category } = await params
  const entity = await loadEntity('category', category)
  if (!entity) notFound()

  const [he, ru] = await Promise.all([
    getCategoryBlocks(category, 'he'),
    getCategoryBlocks(category, 'ru'),
  ])

  return (
    <AdminShell
      title={`Текст: ${entity.name.ru || category}`}
      description="Основной текст на странице категории — то, что читают посетители и индексируют поисковики."
      userEmail={user.email}
      wide
      crumbs={[
        { label: 'Обзор', href: '/admin' },
        { label: 'Каталог', href: '/admin/catalog' },
        { label: entity.name.ru || category, href: `/admin/catalog/${category}` },
        { label: 'Текст' },
      ]}
      actions={
        <Link
          href={`/admin/catalog/${category}`}
          className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
        >
          ← К категории
        </Link>
      }
    >
      <SplitEditor path={`/${category}`}>
        <BlocksEditor
          ownerType="category"
          ownerSlug={category}
          categorySlug={category}
          initial={{ he, ru }}
          canSave={isDbConfigured()}
        />
      </SplitEditor>
    </AdminShell>
  )
}
