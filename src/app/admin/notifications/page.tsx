import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { Notice } from '@/components/admin/fields'
import { isDbConfigured } from '@/db'
import { getNotifySettings } from '@/lib/notify'
import { getCurrentUser } from '@/lib/session'
import NotifyEditor from './NotifyEditor'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const settings = await getNotifySettings()

  return (
    <AdminShell
      title="Уведомления"
      description="Заявка с сайта приходит в Telegram сразу — не нужно держать панель открытой."
      userEmail={user.email}
      crumbs={[{ label: 'Обзор', href: '/admin' }, { label: 'Уведомления' }]}
    >
      {!isDbConfigured() && (
        <Notice kind="warn">
          Без <code className="text-[#E8C568]">DATABASE_URL</code> настройки сохранять некуда.
        </Notice>
      )}

      <NotifyEditor
        enabled={settings.enabled}
        chatId={settings.chatId}
        hasToken={Boolean(settings.token)}
        canSave={isDbConfigured()}
      />
    </AdminShell>
  )
}
