import Link from 'next/link'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { Notice } from '@/components/admin/fields'
import SplitEditor from '@/components/admin/SplitEditor'
import { isDbConfigured } from '@/db'
import { EDITABLE_LISTS, findList } from '@/lib/admin/lists'
import { getListValues } from '@/lib/content/translations'
import { getCurrentUser } from '@/lib/session'
import ListEditor from './ListEditor'

export const dynamic = 'force-dynamic'

export default async function ListsPage({
  searchParams,
}: {
  searchParams: Promise<{ block?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const { block } = await searchParams
  const active = findList(block ?? '') ?? EDITABLE_LISTS[0]
  const values = await getListValues([active.key])

  return (
    <AdminShell
      title="Блоки на страницах"
      description="Преимущества, отзывы, команда — то, что повторяется карточками. Добавляйте и убирайте записи, порядок задаётся стрелками."
      userEmail={user.email}
      crumbs={[{ label: 'Обзор', href: '/admin' }, { label: 'Блоки на страницах' }]}
      wide
    >
      {!isDbConfigured() && (
        <Notice kind="warn">
          Без <code className="text-[#E8C568]">DATABASE_URL</code> правки не сохранятся.
        </Notice>
      )}

      <div className="mb-5 flex flex-wrap gap-1.5">
        {EDITABLE_LISTS.map(list => (
          <Link
            key={list.id}
            href={`/admin/lists?block=${list.id}`}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              list.id === active.id
                ? 'bg-[#C4983A] font-semibold text-[#0C0E14]'
                : 'border border-[#23263A] text-[#8C90A8] hover:border-[#C4983A]/50 hover:text-[#E4E0D8]'
            }`}
          >
            {list.title}
          </Link>
        ))}
      </div>

      <SplitEditor path={active.path ?? '/'}>
        <ListEditor
          key={active.id}
          list={active}
          initial={
            values[active.key] as {
              he: (Record<string, unknown> | string)[]
              ru: (Record<string, unknown> | string)[]
            }
          }
          canSave={isDbConfigured()}
        />
      </SplitEditor>
    </AdminShell>
  )
}
