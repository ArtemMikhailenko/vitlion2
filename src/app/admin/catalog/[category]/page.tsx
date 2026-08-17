import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import SplitEditor from '@/components/admin/SplitEditor'
import { isDbConfigured } from '@/db'
import { listModels, loadEntity } from '@/lib/admin/catalog'
import { listPickableImages } from '@/lib/admin/images'
import { getCurrentUser } from '@/lib/session'
import EntityEditor from '../EntityEditor'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const { category } = await params
  const entity = await loadEntity('category', category)
  if (!entity) notFound()

  const models = listModels(category)
  const images = await listPickableImages()

  return (
    <AdminShell
      title={entity.name.ru || category}
      description="Поля категории и её модели. Изменения появляются на сайте сразу после сохранения."
      userEmail={user.email}
      wide
      crumbs={[
        { label: 'Обзор', href: '/admin' },
        { label: 'Каталог', href: '/admin/catalog' },
        { label: entity.name.ru || category },
      ]}
      actions={
        <div className="flex gap-2">
          <Link
            href="/admin/catalog"
            className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
          >
            ← К каталогу
          </Link>
          <Link
            href={`/admin/catalog/${category}/text`}
            className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
          >
            Текст на странице
          </Link>
        </div>
      }
    >
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold text-[#8C90A8]">Модели в этой категории</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {models.map(model => (
            <Link
              key={model.slug}
              href={`/admin/catalog/${category}/${model.slug}`}
              className="group flex items-center gap-3 rounded-lg border border-[#23263A] bg-[#13161F] p-2 transition-colors hover:border-[#C4983A]"
            >
              <img
                src={model.mainImage}
                alt=""
                className="h-12 w-14 shrink-0 rounded object-cover"
                loading="lazy"
              />
              <span className="min-w-0 truncate text-sm text-[#E4E0D8] group-hover:text-[#C4983A]">
                {model.name.ru}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <SplitEditor path={`/${category}`}>
        <EntityEditor
          kind="category"
          entity={entity}
          categorySlug={category}
          canSave={isDbConfigured()}
          images={images}
        />
      </SplitEditor>
    </AdminShell>
  )
}
