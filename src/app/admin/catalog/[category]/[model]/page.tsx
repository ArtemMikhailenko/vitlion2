import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import SplitEditor from '@/components/admin/SplitEditor'
import { isDbConfigured } from '@/db'
import { loadEntity, modelBelongsTo } from '@/lib/admin/catalog'
import { listPickableImages } from '@/lib/admin/images'
import { getCurrentUser } from '@/lib/session'
import EntityEditor from '../../EntityEditor'

export const dynamic = 'force-dynamic'

export default async function ModelPage({
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

  const images = await listPickableImages()

  return (
    <AdminShell
      title={entity.name.ru || model}
      description="Поля модели. Эта страница есть на сайте по собственному адресу и индексируется отдельно."
      userEmail={user.email}
      wide
      crumbs={[
        { label: 'Обзор', href: '/admin' },
        { label: 'Каталог', href: '/admin/catalog' },
        { label: category, href: `/admin/catalog/${category}` },
        { label: entity.name.ru || model },
      ]}
      actions={
        <div className="flex gap-2">
          <Link
            href={`/admin/catalog/${category}`}
            className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
          >
            ← К категории
          </Link>
          <Link
            href={`/admin/catalog/${category}/${model}/text`}
            className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
          >
            Текст на странице
          </Link>
          <a
            href={`/${category}/${model}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
          >
            Открыть на сайте ↗
          </a>
        </div>
      }
    >
      <SplitEditor path={`/${category}/${model}`}>
        <EntityEditor
          kind="model"
          entity={entity}
          categorySlug={category}
          canSave={isDbConfigured()}
          images={images}
        />
      </SplitEditor>
    </AdminShell>
  )
}
