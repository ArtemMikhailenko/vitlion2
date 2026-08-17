import Link from 'next/link'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { Icon } from '@/components/admin/icons'
import { isDbConfigured } from '@/db'
import { NAV_GROUPS } from '@/lib/admin/nav'
import { getAdminStats } from '@/lib/admin/stats'
import { getCurrentUser } from '@/lib/session'
import { logout } from './actions'

export const dynamic = 'force-dynamic'

function ago(date: Date): string {
  const minutes = Math.round((Date.now() - date.getTime()) / 60000)
  if (minutes < 1) return 'только что'
  if (minutes < 60) return `${minutes} мин назад`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} ч назад`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} дн назад`
  return date.toLocaleDateString('ru-RU')
}

export default async function AdminHome() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const stats = await getAdminStats()

  return (
    <AdminShell
      title="Обзор"
      description="Что нового на сайте и куда идти, чтобы что-то изменить."
      userEmail={user.email}
      actions={
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
          >
            Выйти
          </button>
        </form>
      }
    >
      {!isDbConfigured() && (
        <div className="mb-6 rounded-xl border border-[#4A3A1A] bg-[#1F1810] p-5 text-sm leading-relaxed">
          <p className="mb-1.5 font-semibold text-[#E8C568]">База данных не подключена</p>
          <p className="text-[#B8A98A]">
            Сайт работает и выглядит правильно — тексты берутся из кода. Но правки из панели
            сохранять некуда, поэтому все разделы открыты только на чтение. Нужна переменная{' '}
            <code className="text-[#E8C568]">DATABASE_URL</code>.
          </p>
        </div>
      )}

      {/* Enquiries first and largest: it is the only thing here with a deadline. */}
      <section className="mb-8 rounded-2xl border border-[#23263A] bg-[#13161F] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#E4E0D8]">Заявки с сайта</p>
            <p className="mt-1 text-sm text-[#8C90A8]">
              {stats.pendingLeads > 0 ? (
                <>
                  <span className="font-bold text-[#E8C568]">{stats.pendingLeads}</span> ждут ответа
                  {stats.totalLeads > stats.pendingLeads && ` · всего ${stats.totalLeads}`}
                </>
              ) : stats.totalLeads > 0 ? (
                `Все ${stats.totalLeads} обработаны`
              ) : (
                'Пока ни одной'
              )}
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="rounded-lg bg-[#C4983A] px-4 py-2 text-sm font-bold text-[#0C0E14] transition-opacity hover:opacity-90"
          >
            Открыть заявки
          </Link>
        </div>

        {stats.recentLeads.length > 0 && (
          <div className="mt-5 space-y-2 border-t border-[#1C1F2C] pt-4">
            {stats.recentLeads.map(lead => (
              <div key={lead.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm">
                <span className="font-medium text-[#E4E0D8]">{lead.name}</span>
                <a href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`} dir="ltr" className="text-[#C4983A] hover:underline">
                  {lead.phone}
                </a>
                {lead.service && <span className="text-[#585C78]">{lead.service}</span>}
                <span className="ms-auto text-xs text-[#42465C]">{ago(lead.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Категории" value={stats.categories} href="/admin/catalog" />
        <Stat label="Модели" value={stats.models} href="/admin/catalog" />
        <Stat label="Вопросы и ответы" value={stats.faq} href="/admin/faq" />
        <Stat label="Загруженные фото" value={stats.photos} href="/admin/media" />
      </section>

      <section>
        <p className="mb-3 text-sm font-semibold text-[#8C90A8]">Что где менять</p>
        <div className="space-y-6">
          {NAV_GROUPS.filter(g => g.title !== 'Каждый день').map(group => (
            <div key={group.title}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#42465C]">
                {group.title}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-start gap-3 rounded-xl border border-[#23263A] bg-[#13161F] p-4 transition-colors hover:border-[#C4983A]"
                  >
                    <Icon
                      name={item.icon}
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#585C78] group-hover:text-[#C4983A]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[#E4E0D8] group-hover:text-[#C4983A]">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-[#585C78]">
                        {item.hint}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {stats.lastEdit && (
        <p className="mt-8 text-xs text-[#42465C]">
          Последнее изменение текстов — {ago(stats.lastEdit)}.
        </p>
      )}
    </AdminShell>
  )
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[#23263A] bg-[#13161F] p-4 transition-colors hover:border-[#C4983A]"
    >
      <p className="text-2xl font-bold text-[#E4E0D8]">{value}</p>
      <p className="mt-0.5 text-xs text-[#585C78]">{label}</p>
    </Link>
  )
}
