import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { Notice } from '@/components/admin/fields'
import { isDbConfigured } from '@/db'
import { readNotifySettings } from '@/lib/notify'
import { getCurrentUser } from '@/lib/session'
import NotifyEditor from './NotifyEditor'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const { settings, failed } = await readNotifySettings()

  let crm: { kind: 'ok' | 'warn' | 'error'; text: string }
  if (failed) {
    crm = {
      kind: 'error',
      text: 'Настройки не читаются из базы — скорее всего, не создана таблица site_settings. Пока это так, заявки в CRM и Telegram не уходят. Выполните db/site-settings.sql в Neon.',
    }
  } else if (settings.webhookEnabled && settings.webhookUrl) {
    crm = { kind: 'ok', text: `Заявки уходят в CRM: ${hostOf(settings.webhookUrl)}` }
  } else if (!settings.webhookUrl) {
    crm = { kind: 'warn', text: 'Заявки в CRM сейчас НЕ уходят: адрес вебхука не сохранён.' }
  } else {
    crm = { kind: 'warn', text: 'Заявки в CRM сейчас НЕ уходят: галочка «Отправлять заявки в CRM» выключена.' }
  }

  return (
    <AdminShell
      title="Уведомления"
      description="Куда уходит новая заявка: в Telegram и в CRM. Заявка в любом случае сохраняется в разделе «Заявки»."
      userEmail={user.email}
      crumbs={[{ label: 'Обзор', href: '/admin' }, { label: 'Уведомления' }]}
    >
      {!isDbConfigured() && (
        <Notice kind="warn">
          Без <code className="text-[#E8C568]">DATABASE_URL</code> настройки сохранять некуда.
        </Notice>
      )}

      <Notice kind={crm.kind}>{crm.text}</Notice>

      <NotifyEditor
        enabled={settings.enabled}
        chatId={settings.chatId}
        hasToken={Boolean(settings.token)}
        webhookEnabled={settings.webhookEnabled}
        webhookUrl={settings.webhookUrl}
        hasWebhookSecret={Boolean(settings.webhookSecret)}
        canSave={isDbConfigured()}
      />
    </AdminShell>
  )
}

function hostOf(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return 'адрес не похож на ссылку'
  }
}
