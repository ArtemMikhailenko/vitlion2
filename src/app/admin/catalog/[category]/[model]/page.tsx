import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { isDbConfigured } from '@/db'
import { loadEntity, modelBelongsTo } from '@/lib/admin/catalog'
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

  return (
    <AdminShell
      title={entity.name.ru || model}
      description="Поля модели. Эта страница есть на сайте по собственному адресу и индексируется отдельно."
      userEmail={user.email}
      actions={
        <div className="flex gap-2">
          <Link
            href={`/admin/catalog/${category}`}
            className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
          >
            ← К категории
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
      <EntityEditor kind="model" entity={entity} categorySlug={category} canSave={isDbConfigured()} />
    </AdminShell>
  )
}
