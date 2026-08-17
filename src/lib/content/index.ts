import { eq, and, asc } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import type { ContentBlock } from '@/components/sections/ContentBlocks'
import { CATEGORY_BRIEF, MODEL_BRIEF, FAQ_BRIEF } from '@/data/briefContent'
import { SEO_PAGES, type SeoPageContent } from '@/data/seoContent'
import type { Lang } from '@/lib/i18n'

/**
 * Single place the pages ask for content.
 *
 * Every function reads the database first and falls back to the TypeScript
 * modules the site already ships with. That fallback is the whole design:
 * the public site renders identically with no database, during the migration
 * while only some rows exist, and again if the database is ever unreachable.
 * The admin panel is therefore never able to take the live site down.
 *
 * Reads are cached per request by React so a page that asks for the same
 * category twice only queries once.
 */

function blocksFromRows(
  rows: (typeof schema.contentBlocks.$inferSelect)[],
): ContentBlock[] {
  return rows.map(row => {
    const block: ContentBlock = {}
    if (row.heading) block.heading = row.heading
    if (row.paragraphs?.length) block.paragraphs = row.paragraphs
    if (row.items?.length) block.items = row.items
    if (row.outro?.length) block.outro = row.outro
    return block
  })
}

async function loadBlocks(
  ownerType: 'page' | 'category' | 'model',
  ownerSlug: string,
  lang: Lang,
): Promise<ContentBlock[] | null> {
  const db = getDb()
  if (!db) return null

  try {
    const rows = await db
      .select()
      .from(schema.contentBlocks)
      .where(
        and(
          eq(schema.contentBlocks.ownerType, ownerType),
          eq(schema.contentBlocks.ownerSlug, ownerSlug),
          eq(schema.contentBlocks.lang, lang),
        ),
      )
      .orderBy(asc(schema.contentBlocks.position))

    return rows.length ? blocksFromRows(rows) : null
  } catch (error) {
    // A database problem must never blank a page — fall through to the
    // shipped content and leave a trace in the server log.
    console.error('[content] contentBlocks query failed, using bundled content', error)
    return null
  }
}

export async function getCategoryBlocks(slug: string, lang: Lang): Promise<ContentBlock[]> {
  return (await loadBlocks('category', slug, lang)) ?? CATEGORY_BRIEF[slug]?.[lang] ?? []
}

export async function getModelBlocks(slug: string, lang: Lang): Promise<ContentBlock[]> {
  return (await loadBlocks('model', slug, lang)) ?? MODEL_BRIEF[slug]?.[lang] ?? []
}

export async function getFaq(lang: Lang): Promise<{ question: string; answer: string }[]> {
  const db = getDb()
  if (!db) return FAQ_BRIEF[lang]

  try {
    const rows = await db
      .select()
      .from(schema.faqItems)
      .where(and(eq(schema.faqItems.lang, lang), eq(schema.faqItems.published, true)))
      .orderBy(asc(schema.faqItems.position))

    return rows.length ? rows.map(r => ({ question: r.question, answer: r.answer })) : FAQ_BRIEF[lang]
  } catch (error) {
    console.error('[content] faq query failed, using bundled content', error)
    return FAQ_BRIEF[lang]
  }
}

/** Page-level SEO. Falls back to the bundled SEO_PAGES entry. */
export async function getPageSeo(slug: string, lang: Lang): Promise<SeoPageContent | null> {
  const bundled = SEO_PAGES[slug]?.[lang] ?? null
  const db = getDb()
  if (!db) return bundled

  try {
    const [row] = await db
      .select()
      .from(schema.pageSeo)
      .where(and(eq(schema.pageSeo.slug, slug), eq(schema.pageSeo.lang, lang)))
      .limit(1)

    if (!row) return bundled

    // Merge rather than replace: a half-filled row should not wipe the copy
    // that is already live.
    return {
      title: row.title ?? bundled?.title ?? '',
      description: row.description ?? bundled?.description ?? '',
      h1: row.h1 ?? bundled?.h1 ?? '',
      ctaLabel: row.ctaLabel ?? bundled?.ctaLabel ?? '',
      h2Blocks: bundled?.h2Blocks ?? [],
      seoText: bundled?.seoText ?? [],
    }
  } catch (error) {
    console.error('[content] pageSeo query failed, using bundled content', error)
    return bundled
  }
}

