import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

/**
 * Content schema for the admin panel — Postgres, hosted on Neon.
 *
 * Everything the site renders currently lives in TypeScript modules and is
 * baked into 59 static pages at build time. These tables mirror that content so
 * it can be edited at runtime instead. The content layer falls back to the
 * TypeScript modules whenever a row is missing or no database is configured, so
 * the public site behaves exactly as it does today until content is migrated —
 * and keeps working if the database ever goes away.
 *
 * Language is a column rather than a table per language: every editable string
 * exists in Hebrew and Russian, and pairing them in one query keeps the admin
 * forms simple.
 *
 * `updatedAt` is set by the application rather than by the database. Postgres
 * has no ON UPDATE clause, and a trigger would hide the behaviour from anyone
 * reading this file.
 */

export const LANGS = ['he', 'ru'] as const

/** Flat key/value store mirroring the i18n dictionaries (`hero.title`, …). */
export const translations = pgTable(
  'translations',
  {
    /** Dot path into the dictionary, e.g. "hero.subtitle". */
    key: varchar('key', { length: 191 }).notNull(),
    lang: varchar('lang', { length: 2 }).notNull(),
    /** Plain strings and JSON alike — arrays and objects are stored as jsonb. */
    value: jsonb('value').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => [primaryKey({ columns: [t.key, t.lang] })],
)

/** Per-page SEO fields: title, description, H1 and the CTA label. */
export const pageSeo = pgTable(
  'page_seo',
  {
    /** Route slug: '' for the homepage, otherwise 'services', 'glazing', … */
    slug: varchar('slug', { length: 191 }).notNull(),
    lang: varchar('lang', { length: 2 }).notNull(),
    title: varchar('title', { length: 255 }),
    description: text('description'),
    h1: varchar('h1', { length: 255 }),
    ctaLabel: varchar('cta_label', { length: 191 }),
    /** Emits `index, follow`; unset pages simply carry no robots meta. */
    indexable: boolean('indexable').default(false).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => [primaryKey({ columns: [t.slug, t.lang] })],
)

/**
 * Body copy blocks — the heading/paragraphs/list/outro shape ContentBlocks
 * already renders. `ownerType` distinguishes a category page from a model page
 * so both can share the table.
 */
export const contentBlocks = pgTable(
  'content_blocks',
  {
    id: serial('id').primaryKey(),
    ownerType: varchar('owner_type', { length: 16 }).notNull(), // 'page' | 'category' | 'model'
    ownerSlug: varchar('owner_slug', { length: 191 }).notNull(),
    lang: varchar('lang', { length: 2 }).notNull(),
    position: integer('position').default(0).notNull(),
    heading: varchar('heading', { length: 255 }),
    paragraphs: jsonb('paragraphs').$type<string[]>(),
    items: jsonb('items').$type<string[]>(),
    outro: jsonb('outro').$type<string[]>(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => [index('owner_idx').on(t.ownerType, t.ownerSlug, t.lang)],
)

/** The five categories. */
export const categories = pgTable('categories', {
  slug: varchar('slug', { length: 191 }).primaryKey(),
  mainImage: varchar('main_image', { length: 512 }),
  position: integer('position').default(0).notNull(),
  published: boolean('published').default(true).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/** The 17 product models, each with its own page. */
export const models = pgTable(
  'models',
  {
    slug: varchar('slug', { length: 191 }).primaryKey(),
    categorySlug: varchar('category_slug', { length: 191 }).notNull(),
    mainImage: varchar('main_image', { length: 512 }),
    gallery: jsonb('gallery').$type<string[]>(),
    position: integer('position').default(0).notNull(),
    published: boolean('published').default(true).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => [index('category_idx').on(t.categorySlug)],
)

/** Names, short lines, descriptions and feature bullets for both entity kinds. */
export const catalogText = pgTable(
  'catalog_text',
  {
    entityType: varchar('entity_type', { length: 16 }).notNull(), // 'category' | 'model'
    slug: varchar('slug', { length: 191 }).notNull(),
    lang: varchar('lang', { length: 2 }).notNull(),
    name: varchar('name', { length: 255 }),
    short: text('short'),
    description: text('description'),
    features: jsonb('features').$type<string[]>(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => [primaryKey({ columns: [t.entityType, t.slug, t.lang] })],
)

/** FAQ, shown on /services and mirrored into FAQPage structured data. */
export const faqItems = pgTable(
  'faq_items',
  {
    id: serial('id').primaryKey(),
    lang: varchar('lang', { length: 2 }).notNull(),
    position: integer('position').default(0).notNull(),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    published: boolean('published').default(true).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => [index('lang_idx').on(t.lang)],
)

/** Uploaded images. `path` is the Cloudinary URL the site renders. */
export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  path: varchar('path', { length: 512 }).notNull().unique(),
  /** Cloudinary public_id, needed to delete or re-transform the asset. */
  publicId: varchar('public_id', { length: 255 }),
  originalName: varchar('original_name', { length: 255 }),
  width: integer('width'),
  height: integer('height'),
  bytes: integer('bytes'),
  alt: varchar('alt', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

/** Admin accounts. Seeded deliberately — there is no public signup. */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  /** scrypt hash, formatted "salt:derivedKey" — see lib/auth. */
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 191 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

/**
 * Leads from the cost calculator.
 *
 * Until now the form logged the submission to the browser console and showed a
 * thank-you — every enquiry since launch was discarded. This table is where
 * they go instead.
 */
export const leads = pgTable(
  'leads',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 191 }).notNull(),
    phone: varchar('phone', { length: 64 }).notNull(),
    /** Answers from the calculator steps. */
    shape: varchar('shape', { length: 64 }),
    area: varchar('area', { length: 64 }),
    service: varchar('service', { length: 64 }),
    /** Which language version of the site the person was on. */
    lang: varchar('lang', { length: 2 }),
    /** Page they submitted from, for attribution. */
    page: varchar('page', { length: 512 }),
    /**
     * Kept as the "needs attention" flag that drives the badge; the sales stage
     * below is the detail. They move together — any stage past 'new' is handled.
     */
    handled: boolean('handled').default(false).notNull(),
    /** 'new' | 'callback' | 'quoted' | 'won' | 'lost' — see LEAD_STATUSES. */
    status: varchar('status', { length: 16 }).default('new').notNull(),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => [index('leads_created_idx').on(t.createdAt)],
)

/**
 * Site-wide settings that are not text and not per-page: the phone number, the
 * addresses, the social profiles.
 *
 * A key/value table rather than one column per setting, so adding a setting is
 * an insert instead of a migration on a live database — the panel is the only
 * reader and it already knows which keys it wants.
 */
export const siteSettings = pgTable('site_settings', {
  key: varchar('key', { length: 64 }).primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/**
 * Snapshots of edited text, so a change can be undone.
 *
 * Saving overwrote the previous value with no trace: a paragraph replaced by
 * mistake was gone unless someone remembered the old wording. One row per
 * key/lang per save is cheap — these are short strings and small arrays — and
 * makes "верните как было вчера" answerable.
 */
export const contentHistory = pgTable(
  'content_history',
  {
    id: serial('id').primaryKey(),
    /** Dot path into the dictionary, matching translations.key. */
    key: varchar('key', { length: 191 }).notNull(),
    lang: varchar('lang', { length: 2 }).notNull(),
    value: jsonb('value').notNull(),
    /** Email of whoever saved it. */
    author: varchar('author', { length: 191 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  t => [index('history_key_idx').on(t.key, t.lang), index('history_created_idx').on(t.createdAt)],
)
