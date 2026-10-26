import 'server-only'
import { getDb, schema } from '@/db'
import { SITE_URL } from '@/lib/site'

/**
 * Tells somebody a lead arrived.
 *
 * Until now an enquiry landed in the database and waited to be noticed, while
 * the page it came from promised an answer within the hour. This closes that.
 *
 * Settings live in `site_settings` rather than environment variables: the
 * Hostinger panel has silently truncated values twice on this deployment, and a
 * bot token that half-saves is a notification channel that fails without
 * telling anyone. Storing them in the database also means the owner can change
 * the destination without a redeploy.
 */

export interface NotifySettings {
  enabled: boolean
  token: string
  chatId: string
  webhookEnabled: boolean
  webhookUrl: string
  /** Sent as X-Vitlion-Secret so the receiver can reject forged posts. */
  webhookSecret: string
}

const KEYS = {
  enabled: 'notify.telegramEnabled',
  token: 'notify.telegramToken',
  chatId: 'notify.telegramChatId',
  webhookEnabled: 'notify.webhookEnabled',
  webhookUrl: 'notify.webhookUrl',
  webhookSecret: 'notify.webhookSecret',
} as const

/** Everything off. Named once so a new setting cannot be missed in one branch. */
const BLANK: NotifySettings = {
  enabled: false,
  token: '',
  chatId: '',
  webhookEnabled: false,
  webhookUrl: '',
  webhookSecret: '',
}

export async function getNotifySettings(): Promise<NotifySettings> {
  const db = getDb()
  if (!db) return BLANK

  try {
    const rows = await db.select().from(schema.siteSettings)
    const map = new Map(rows.map(r => [r.key, r.value]))
    return {
      enabled: map.get(KEYS.enabled) === 'true',
      token: map.get(KEYS.token) ?? '',
      chatId: map.get(KEYS.chatId) ?? '',
      webhookEnabled: map.get(KEYS.webhookEnabled) === 'true',
      webhookUrl: map.get(KEYS.webhookUrl) ?? '',
      webhookSecret: map.get(KEYS.webhookSecret) ?? '',
    }
  } catch (error) {
    console.error('[notify] settings query failed', error)
    return BLANK
  }
}

export const NOTIFY_KEYS = KEYS

export interface LeadSummary {
  name: string
  phone: string
  service?: string | null
  shape?: string | null
  area?: string | null
  lang?: string | null
  page?: string | null
}

/** Telegram parses a subset of HTML; anything user-typed must be escaped. */
function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function formatLead(lead: LeadSummary): string {
  const details = [lead.service, lead.shape, lead.area && `${lead.area} м²`]
    .filter(Boolean)
    .map(v => esc(String(v)))
    .join(' · ')

  const lines = [
    '<b>Новая заявка с сайта</b>',
    '',
    `👤 ${esc(lead.name)}`,
    `📞 <a href="tel:${esc(lead.phone.replace(/[^\d+]/g, ''))}">${esc(lead.phone)}</a>`,
  ]

  if (details) lines.push(`🔧 ${details}`)
  if (lead.lang) lines.push(`🌐 ${lead.lang === 'ru' ? 'русская версия' : 'иврит'}`)
  if (lead.page && lead.page !== '/') lines.push(`📄 ${esc(lead.page)}`)

  lines.push('', `<a href="${SITE_URL}/admin/leads">Открыть в панели</a>`)

  return lines.join('\n')
}

/** Posts to Telegram. Returns a Russian error string, or null on success. */
export async function sendTelegram(
  settings: NotifySettings,
  text: string,
): Promise<string | null> {
  if (!settings.token || !settings.chatId) return 'Не заданы токен или ID чата.'

  try {
    const response = await fetch(`https://api.telegram.org/bot${settings.token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: settings.chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      // A hung request must not hold the visitor's form submission open.
      signal: AbortSignal.timeout(8000),
    })

    if (response.ok) return null

    const body = (await response.json().catch(() => null)) as { description?: string } | null
    const reason = body?.description ?? `HTTP ${response.status}`

    if (/chat not found/i.test(reason)) {
      return 'Чат не найден. Напишите боту любое сообщение и проверьте ID чата.'
    }
    if (/unauthorized|bot token/i.test(reason)) {
      return 'Токен не принят. Проверьте, что скопирован целиком.'
    }
    return `Telegram ответил: ${reason}`
  } catch (error) {
    console.error('[notify] telegram request failed', error)
    return 'Не удалось связаться с Telegram.'
  }
}

/**
 * Posts the lead to a CRM endpoint.
 *
 * JSON rather than a form, and a flat shape, because every CRM intake and every
 * automation tool in between reads that without configuration. The secret goes
 * in a header, never the body or the query, so it does not end up in the
 * receiver's access log.
 *
 * Returns a Russian error string, or null on success.
 */
export async function sendWebhook(
  settings: NotifySettings,
  lead: LeadSummary & { id?: number },
): Promise<string | null> {
  if (!settings.webhookUrl) return 'Не задан адрес вебхука.'

  let target: URL
  try {
    target = new URL(settings.webhookUrl)
  } catch {
    return 'Адрес вебхука не похож на ссылку.'
  }
  if (target.protocol !== 'https:') {
    return 'Адрес должен начинаться с https:// — по http данные клиента пойдут открытым текстом.'
  }

  try {
    const response = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(settings.webhookSecret ? { 'X-Vitlion-Secret': settings.webhookSecret } : {}),
      },
      body: JSON.stringify({
        id: lead.id ?? null,
        name: lead.name,
        phone: lead.phone,
        service: lead.service ?? null,
        shape: lead.shape ?? null,
        area: lead.area ?? null,
        language: lead.lang ?? null,
        page: lead.page ?? null,
        source: 'vitlion.co.il',
        createdAt: new Date().toISOString(),
      }),
      // A slow CRM must not hold the visitor's form open.
      signal: AbortSignal.timeout(8000),
    })

    if (response.ok) return null
    return `CRM ответила ${response.status}.`
  } catch (error) {
    console.error('[notify] webhook request failed', error)
    return 'Не удалось достучаться до указанного адреса.'
  }
}

/**
 * Fire-and-forget notification for a freshly stored lead.
 *
 * Never throws and never rejects: the enquiry is already saved by this point,
 * and a broken bot token must not turn a captured lead into an error page for
 * the person who filled the form.
 */
export async function notifyNewLead(lead: LeadSummary & { id?: number }): Promise<void> {
  try {
    const settings = await getNotifySettings()

    // Settled, not all: a CRM that is down must not stop the Telegram message,
    // and a wrong bot token must not cost the CRM its copy of the lead.
    const [telegram, webhook] = await Promise.allSettled([
      settings.enabled ? sendTelegram(settings, formatLead(lead)) : Promise.resolve(null),
      settings.webhookEnabled ? sendWebhook(settings, lead) : Promise.resolve(null),
    ])

    for (const [name, result] of [
      ['telegram', telegram],
      ['webhook', webhook],
    ] as const) {
      if (result.status === 'rejected') console.error(`[notify] ${name} threw`, result.reason)
      else if (result.value) console.error(`[notify] ${name} failed:`, result.value)
    }
  } catch (error) {
    console.error('[notify] unexpected failure', error)
  }
}
