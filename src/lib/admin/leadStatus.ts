/**
 * The stages an enquiry moves through.
 *
 * A single "обработана" checkbox could not answer the question the owner
 * actually asks — which of these still owes somebody a call. `new` and
 * `callback` do; `quoted` is waiting on the customer; `won` and `lost` are
 * closed. Only the first two count towards the badge.
 */
export const LEAD_STATUSES = [
  { id: 'new', label: 'Новая', short: 'Новая', tone: 'urgent' },
  { id: 'callback', label: 'Перезвонить', short: 'Перезвон', tone: 'active' },
  { id: 'quoted', label: 'Отправил КП', short: 'КП', tone: 'active' },
  { id: 'won', label: 'Продано', short: 'Продано', tone: 'won' },
  { id: 'lost', label: 'Отказ', short: 'Отказ', tone: 'lost' },
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]['id']

export const LEAD_STATUS_IDS = LEAD_STATUSES.map(s => s.id) as readonly string[]

/** Stages that still need someone to act. */
export const OPEN_STATUSES: readonly string[] = ['new', 'callback']

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && LEAD_STATUS_IDS.includes(value)
}

export function statusOf(id: string) {
  return LEAD_STATUSES.find(s => s.id === id) ?? LEAD_STATUSES[0]
}

export const STATUS_CLASS: Record<string, string> = {
  urgent: 'border-[#C4983A] bg-[#C4983A]/15 text-[#E8C568]',
  active: 'border-[#2C3A56] bg-[#16203A] text-[#9FC0E8]',
  won: 'border-[#2A4A32] bg-[#16301E] text-[#9BE5B4]',
  lost: 'border-[#3A2A2A] bg-[#241818] text-[#C79797]',
}
