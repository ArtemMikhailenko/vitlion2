import { cache } from 'react'
import { getDb, schema } from '@/db'

/**
 * When each page was last actually changed.
 *
 * The sitemap used to stamp every URL with `new Date()` — the moment the file
 * was generated. That says every page on the site changed seconds ago, on every
 * request, which is not a freshness signal but noise: a crawler that sees a
 * lastmod it can disprove learns to ignore the field entirely. This reads the
 * real edit times instead, so a page that genuinely changed yesterday is the
 * one that stands out.
 *
 * The same value feeds `dateModified` in the structured data and the
 * `Last-Modified` header of the machine-readable endpoints, so a crawler gets
 * one consistent answer wherever it looks.
 */

/**
 * Fallback for content that has never been edited through the panel.
 *
 * A fixed date, not the current time: these texts really have not changed since
 * they were written, and claiming otherwise is the exact problem above. Bump it
 * when the bundled content in src/data or src/i18n is revised.
 */
const CONTENT_BASELINE = new Date('2026-08-18T00:00:00Z')

export interface Freshness {
  /** Newest edit anywhere — used for the home page and as a floor for the site. */
  site: Date
  /** Per catalogue slug, category or model alike. */
  entity: Map<string, Date>
  /** Per page slug from SEO_PAGES: '', 'services', 'glazing', … */
  page: Map<string, Date>
}

const newest = (a: Date | undefined, b: Date): Date => (!a || b > a ? b : a)

export const getFreshness = cache(async (): Promise<Freshness> => {
  const empty: Freshness = {
    site: CONTENT_BASELINE,
    entity: new Map(),
    page: new Map(),
  }

  const db = getDb()
  if (!db) return empty

  try {
    const [catalogText, categories, models, blocks, pageSeo, translations] =
      await Promise.all([
        db.select().from(schema.catalogText),
        db.select().from(schema.categories),
        db.select().from(schema.models),
        db.select().from(schema.contentBlocks),
        db.select().from(schema.pageSeo),
        db
          .select({ updatedAt: schema.translations.updatedAt })
          .from(schema.translations),
      ])

    const result: Freshness = { site: CONTENT_BASELINE, entity: new Map(), page: new Map() }

    const touchEntity = (slug: string, at: Date) => {
      result.entity.set(slug, newest(result.entity.get(slug), at))
      result.site = newest(result.site, at)
    }
    const touchPage = (slug: string, at: Date) => {
      result.page.set(slug, newest(result.page.get(slug), at))
      result.site = newest(result.site, at)
    }

    for (const row of catalogText) touchEntity(row.slug, row.updatedAt)
    for (const row of categories) touchEntity(row.slug, row.updatedAt)
    for (const row of models) touchEntity(row.slug, row.updatedAt)
    for (const row of pageSeo) touchPage(row.slug, row.updatedAt)

    for (const row of blocks) {
      if (row.ownerType === 'page') touchPage(row.ownerSlug, row.updatedAt)
      else touchEntity(row.ownerSlug, row.updatedAt)
    }

    // Interface strings appear on every page, so an edit there lifts the whole
    // site's floor rather than any single URL.
    for (const row of translations) result.site = newest(result.site, row.updatedAt)

    return result
  } catch (error) {
    console.error('[content] freshness query failed, using baseline', error)
    return empty
  }
})

/**
 * Newest edit for a slug that is both a page and a catalogue entry.
 *
 * The five category slugs appear in both maps: their SEO fields land under
 * `page`, their names and body text under `entity`. Taking only one would miss
 * half of the edits.
 */
export function modifiedFor(freshness: Freshness, slug: string): Date {
  const fromPage = freshness.page.get(slug)
  const fromEntity = freshness.entity.get(slug)
  if (fromPage && fromEntity) return fromPage > fromEntity ? fromPage : fromEntity
  return fromPage ?? fromEntity ?? freshness.site
}

/** Last edit for one catalogue entry, falling back to the site-wide value. */
export async function entityModified(slug: string): Promise<Date> {
  const freshness = await getFreshness()
  return freshness.entity.get(slug) ?? freshness.site
}

/** Last edit for one page slug ('' is the home page). */
export async function pageModified(slug: string): Promise<Date> {
  const freshness = await getFreshness()
  return freshness.page.get(slug) ?? freshness.site
}
