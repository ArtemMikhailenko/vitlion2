'use server'

import { sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getDb, schema } from '@/db'
import { NOTIFY_KEYS, getNotifySettings, sendTelegram, sendWebhook } from '@/lib/notify'
import { getCurrentUser } from '@/lib/session'

export interface NotifyState {
  ok?: boolean
  error?: string
  tested?: string
}

async function put(rows: { key: string; value: string }[]) {
  const db = getDb()
  if (!db) return false

  await db
    .insert(schema.siteSettings)
    .values(rows)
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value: sql`excluded.value`, updatedAt: new Date() },
    })
  return true
}

export async function saveNotify(_prev: NotifyState, formData: FormData): Promise<NotifyState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }
  if (!getDb()) return { error: 'База данных не подключена — сохранять некуда.' }

  const chatId = String(formData.get('chatId') ?? '').trim()
  const token = String(formData.get('token') ?? '').trim()
  const enabled = formData.get('enabled') === 'on'

  const rows: { key: string; value: string }[] = [
    { key: NOTIFY_KEYS.enabled, value: String(enabled) },
    { key: NOTIFY_KEYS.chatId, value: chatId },
    { key: NOTIFY_KEYS.webhookEnabled, value: String(formData.get('webhookEnabled') === 'on') },
    { key: NOTIFY_KEYS.webhookUrl, value: String(formData.get('webhookUrl') ?? '').trim() },
  ]

  // Same rule as the bot token: an empty box means "keep what is stored",
  // because the form never renders the secret back.
  const webhookSecret = String(formData.get('webhookSecret') ?? '').trim()
  if (webhookSecret) rows.push({ key: NOTIFY_KEYS.webhookSecret, value: webhookSecret })

  // An empty token field means "leave the saved one alone". The form never
  // renders the token back, so an empty box is the normal state on every visit
  // and must not be mistaken for a request to clear it.
  if (token) rows.push({ key: NOTIFY_KEYS.token, value: token })

  try {
    await put(rows)
  } catch (error) {
    console.error('[admin] saveNotify failed', error)
    return { error: 'Не удалось сохранить. Проверьте, что выполнен db/site-settings.sql.' }
  }

  // Refreshes the status line at the top, so it reflects what was just stored.
  revalidatePath('/admin/notifications')
  return { ok: true }
}

/** Sends a real message so the setup is proven before a customer depends on it. */
export async function testNotify(): Promise<NotifyState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const settings = await getNotifySettings()
  if (!settings.token || !settings.chatId) {
    return { error: 'Сначала сохраните токен и ID чата.' }
  }

  const error = await sendTelegram(
    settings,
    '<b>Проверка связи</b>\n\nЕсли вы это видите — уведомления о заявках настроены правильно.',
  )

  return error ? { error } : { tested: 'Сообщение отправлено. Проверьте Telegram.' }
}

/** Posts a clearly-marked test lead, so the CRM mapping can be checked end to end. */
export async function testWebhook(): Promise<NotifyState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const settings = await getNotifySettings()
  if (!settings.webhookUrl) return { error: 'Сначала сохраните адрес вебхука.' }

  const error = await sendWebhook(settings, {
    id: 0,
    name: 'ТЕСТ — проверка связи, не звонить',
    phone: '+972000000000',
    service: 'проверка',
    lang: 'ru',
    page: '/admin/notifications',
  })

  return error
    ? { error }
    : { tested: 'Отправлено. В CRM появится заявка с именем «ТЕСТ — проверка связи».' }
}
