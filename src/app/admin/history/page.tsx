import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { Notice } from '@/components/admin/fields'
import { isDbConfigured } from '@/db'
import { FIELD_GROUPS } from '@/lib/admin/fields'
import { currentValue, listHistory } from '@/lib/admin/history'
import { EDITABLE_LISTS } from '@/lib/admin/lists'
import { getCurrentUser } from '@/lib/session'
import HistoryRow, { type HistoryItem } from './HistoryRow'

export const dynamic = 'force-dynamic'

/** Dictionary paths mean nothing to an operator; these are the panel's own labels. */
const LABELS: Record<string, string> = {
  ...Object.fromEntries(
    FIELD_GROUPS.flatMap(group =>
      group.fields.map(field => [field.key, `${group.title} · ${field.label}`]),
    ),
  ),
  ...Object.fromEntries(EDITABLE_LISTS.map(list => [list.key, `Блоки · ${list.title}`])),
}

/** Arrays and objects have no useful toString; show something legible instead. */
function preview(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value
      .map(item =>
        typeof item === 'string'
          ? item
          : Object.values(item as Record<string, unknown>)
              .filter(v => typeof v === 'string')
              .join(' — '),
      )
      .join('\n')
  }
  return JSON.stringify(value)
}

export default async function HistoryPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const entries = await listHistory()

  const items: HistoryItem[] = await Promise.all(
    entries.map(async entry => {
      const now = await currentValue(entry.key, entry.lang)
      return {
        id: entry.id,
        key: entry.key,
        label: LABELS[entry.key] ?? entry.key,
        lang: entry.lang,
        preview: preview(entry.value).slice(0, 400),
        isCurrent: JSON.stringify(now) === JSON.stringify(entry.value),
        author: entry.author,
        createdAt: entry.createdAt.toISOString(),
      }
    }),
  )

  return (
    <AdminShell
      title="История правок"
      description="Каждое сохранение запоминает, каким текст был до него. Любую версию можно вернуть — и этот возврат тоже запомнится."
      userEmail={user.email}
      crumbs={[{ label: 'Обзор', href: '/admin' }, { label: 'История правок' }]}
    >
      {!isDbConfigured() && (
        <Notice kind="warn">
          Без <code className="text-[#E8C568]">DATABASE_URL</code> история не ведётся.
        </Notice>
      )}

      <Notice kind="warn">
        История ведётся для «Главной страницы» и «Блоков на страницах» — там, где текст правят чаще
        всего. Каталог, вопросы-ответы и контакты сюда пока не попадают.
      </Notice>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#23263A] px-5 py-12 text-center">
          <p className="text-sm text-[#8C90A8]">Пока пусто.</p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#585C78]">
            Первая запись появится после первого сохранения — и это будет тот текст, который был на
            сайте до правки.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <HistoryRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </AdminShell>
  )
}
