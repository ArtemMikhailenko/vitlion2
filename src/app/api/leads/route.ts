import { NextResponse } from 'next/server'
import { getDb, schema } from '@/db'
import { notifyNewLead } from '@/lib/notify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Receives cost-calculator submissions.
 *
 * The form previously logged to the console and showed a thank-you, so every
 * enquiry since launch was lost. This stores them.
 *
 * The endpoint is public by necessity, so it validates lengths, ignores unknown
 * fields, and carries a honeypot: bots fill every input they find, including
 * ones hidden from people, and a filled `company` field is a reliable signal.
 * The response is deliberately identical either way, so a bot cannot tell it
 * was rejected.
 */

const LIMITS = { name: 191, phone: 64, shape: 64, area: 64, service: 64, page: 512 } as const

const clean = (value: unknown, max: number): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, max) : null
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  // Honeypot — a real person never sees this field.
  if (clean(body.company, 100)) return NextResponse.json({ ok: true })

  const name = clean(body.name, LIMITS.name)
  const phone = clean(body.phone, LIMITS.phone)
  if (!name || !phone) return NextResponse.json({ ok: false }, { status: 400 })

  const db = getDb()
  if (!db) {
    // Better a visible failure than a silent one: the visitor is told to call
    // instead of being thanked for a message nobody received.
    console.error('[leads] no database configured — submission dropped', { name, phone })
    return NextResponse.json({ ok: false }, { status: 503 })
  }

  const lead = {
    name,
    phone,
    shape: clean(body.shape, LIMITS.shape),
    area: clean(body.area, LIMITS.area),
    service: clean(body.service, LIMITS.service),
    lang: clean(body.lang, 2),
    page: clean(body.page, LIMITS.page),
  }

  let id: number | undefined
  try {
    // The id goes back to the browser so the Google Ads conversion can use it
    // as transaction_id: a reload or a double submit then counts once.
    const [row] = await db.insert(schema.leads).values(lead).returning({ id: schema.leads.id })
    id = row?.id
  } catch (error) {
    console.error('[leads] insert failed', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  // Awaited, not detached: on serverless the response can end the invocation
  // and kill a pending request. Eight seconds is the worst case, and
  // notifyNewLead swallows its own failures so the visitor still gets ok.
  await notifyNewLead(lead)

  return NextResponse.json({ ok: true, id })
}
