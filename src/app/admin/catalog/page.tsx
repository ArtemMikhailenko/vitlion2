import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { Notice } from '@/components/admin/fields'
import { isDbConfigured } from '@/db'
import { listCategoriesAdmin } from '@/lib/admin/catalog'
import { getCurrentUser } from '@/lib/session'
import CatalogList from './CatalogList'

export const dynamic = 'force-dynamic'

export default async function CatalogIndex() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const categories = await listCategoriesAdmin()

  return (
    <AdminShell
      title="Каталог"
      description="Порядок стрелками, «Скрыть» убирает категорию с сайта. Нажмите на название, чтобы править тексты и фото."
      userEmail={user.email}
      crumbs={[{ label: 'Обзор', href: '/admin' }, { label: 'Каталог' }]}
    >
      {!isDbConfigured() && (
        <Notice kind="warn">
          Без <code className="text-[#E8C568]">DATABASE_URL</code> порядок и видимость менять
          нельзя.
        </Notice>
      )}

      <CatalogList
        kind="category"
        entries={categories}
        hrefBase="/admin/catalog"
        canEdit={isDbConfigured()}
      />
    </AdminShell>
  )
}
