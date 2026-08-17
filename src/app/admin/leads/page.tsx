import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { Notice } from '@/components/admin/fields'
import { isDbConfigured } from '@/db'
import { OPEN_STATUSES } from '@/lib/admin/leadStatus'
import { getCurrentUser } from '@/lib/session'
import { listLeads } from './actions'
import LeadsBoard from './LeadsBoard'

export const dynamic = 'force-dynamic'

const SHAPE: Record<string, string> = {
  straight: 'Прямой участок',
  corner: 'Угловой',
  three: 'С трёх сторон',
  free: 'Отдельно стоящий',
}

export default async function LeadsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const leads = await listLeads()
  const open = leads.filter(l => OPEN_STATUSES.includes(l.status)).length

  return (
    <AdminShell
      title="Заявки"
      description="Обращения из калькулятора стоимости на сайте. Статус и заметка сохраняются сразу."
      userEmail={user.email}
      crumbs={[{ label: 'Обзор', href: '/admin' }, { label: 'Заявки' }]}
      actions={
        <div className="flex items-center gap-2">
          {open > 0 && (
            <span className="rounded-lg bg-[#C4983A] px-3 py-1.5 text-sm font-bold text-[#0C0E14]">
              {open} ждут
            </span>
          )}
          {leads.length > 0 && (
            <a
              href="/admin/leads/export"
              className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
            >
              Выгрузить в Excel
            </a>
          )}
        </div>
      }
    >
      {!isDbConfigured() && (
        <Notice kind="warn">
          Без <code className="text-[#E8C568]">DATABASE_URL</code> заявки не сохраняются.
        </Notice>
      )}

      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#23263A] px-5 py-12 text-center">
          <p className="text-sm text-[#8C90A8]">Заявок пока нет.</p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#585C78]">
            Раньше форма калькулятора не сохраняла обращения — данные писались в консоль браузера и
            пропадали. Теперь они попадают сюда, а на телефон приходит уведомление, если оно
            настроено в разделе «Уведомления».
          </p>
        </div>
      ) : (
        <LeadsBoard
          leads={leads.map(lead => ({
            id: lead.id,
            name: lead.name,
            phone: lead.phone,
            shape: lead.shape ? (SHAPE[lead.shape] ?? lead.shape) : null,
            area: lead.area,
            service: lead.service,
            lang: lead.lang,
            page: lead.page,
            status: lead.status,
            note: lead.note,
            createdAt: lead.createdAt.toISOString(),
          }))}
        />
      )}
    </AdminShell>
  )
}
