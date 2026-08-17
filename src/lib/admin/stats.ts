import 'server-only'
import { cache } from 'react'
import { count, desc, eq } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { CATEGORIES } from '@/data/services'
import { getFaq } from '@/lib/content'

export interface RecentLead {
  id: number
  name: string
  phone: string
  service: string | null
  createdAt: Date
}

export interface AdminStats {
  pendingLeads: number
  totalLeads: number
  recentLeads: RecentLead[]
  photos: number
  categories: number
  models: number
  faq: number
  /** When content was last saved from the panel, if ever. */
  lastEdit: Date | null
}

/**
 * Counts for the dashboard and the navigation badge.
 *
 * Cached per request so the shell and the page it wraps share one round trip
 * rather than querying twice on every screen.
 */
export const getAdminStats = cache(async (): Promise<AdminStats> => {
  const categories = CATEGORIES.length
  const models = CATEGORIES.reduce((n, c) => n + c.services.length, 0)

  const db = getDb()
  if (!db) {
    return {
      pendingLeads: 0,
      totalLeads: 0,
      recentLeads: [],
      photos: 0,
      categories,
      models,
      faq: (await getFaq('ru')).length,
      lastEdit: null,
    }
  }

  // Settled rather than all: a missing leads table must not blank the whole
  // dashboard, and one of these tables has been missing before.
  const [pending, total, recent, photos, faq, edits] = await Promise.allSettled([
    db.select({ n: count() }).from(schema.leads).where(eq(schema.leads.handled, false)),
    db.select({ n: count() }).from(schema.leads),
    db
      .select({
        id: schema.leads.id,
        name: schema.leads.name,
        phone: schema.leads.phone,
        service: schema.leads.service,
        createdAt: schema.leads.createdAt,
      })
      .from(schema.leads)
      .orderBy(desc(schema.leads.createdAt))
      .limit(5),
    db.select({ n: count() }).from(schema.media),
    db.select({ n: count() }).from(schema.faqItems),
    db
      .select({ updatedAt: schema.translations.updatedAt })
      .from(schema.translations)
      .orderBy(desc(schema.translations.updatedAt))
      .limit(1),
  ])

  const num = (r: PromiseSettledResult<{ n: number }[]>) =>
    r.status === 'fulfilled' ? (r.value[0]?.n ?? 0) : 0

  return {
    pendingLeads: num(pending),
    totalLeads: num(total),
    recentLeads: recent.status === 'fulfilled' ? recent.value : [],
    photos: num(photos),
    categories,
    models,
    faq: faq.status === 'fulfilled' && faq.value[0]?.n ? faq.value[0].n : (await getFaq('ru')).length,
    lastEdit: edits.status === 'fulfilled' ? (edits.value[0]?.updatedAt ?? null) : null,
  }
})
