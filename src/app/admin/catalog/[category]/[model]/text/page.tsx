import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import SplitEditor from '@/components/admin/SplitEditor'
import { isDbConfigured } from '@/db'
import { loadEntity, modelBelongsTo } from '@/lib/admin/catalog'
import { getModelBlocks } from '@/lib/content'
import { getCurrentUser } from '@/lib/session'
import BlocksEditor from '../../../BlocksEditor'

export const dynamic = 'force-dynamic'

export default async function ModelTextPage({
  params,
}: {
  params: Promise<{ category: string; model: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const { category, model } = await params
  if (!modelBelongsTo(category, model)) notFound()

  const entity = await loadEntity('model', model)
  if (!entity) notFound()

  const [he, ru] = await Promise.all([getModelBlocks(model, 'he'), getModelBlocks(model, 'ru')])

  return (
    <AdminShell
      title={`Текст: ${entity.name.ru || model}`}
      description="Основной текст на странице модели — то, что читают посетители и индексируют поисковики."
      userEmail={user.email}
      wide
      crumbs={[
        { label: 'Обзор', href: '/admin' },
        { label: 'Каталог', href: '/admin/catalog' },
        { label: category, href: `/admin/catalog/${category}` },
        { label: entity.name.ru || model, href: `/admin/catalog/${category}/${model}` },
        { label: 'Текст' },
      ]}
      actions={
        <Link
          href={`/admin/catalog/${category}/${model}`}
          className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
        >
          ← К модели
        </Link>
      }
    >
      <SplitEditor path={`/${category}/${model}`}>
        <BlocksEditor
          ownerType="model"
          ownerSlug={model}
          categorySlug={category}
          initial={{ he, ru }}
          canSave={isDbConfigured()}
        />
      </SplitEditor>
    </AdminShell>
  )
}
