import {
  boolean,
  index,
  int,
  json,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'

/**
 * Content schema for the admin panel.
 *
 * Everything the site renders currently lives in TypeScript modules and is
 * baked into 59 static pages at build time. These tables mirror that content so
 * it can be edited at runtime instead. The content layer falls back to the
 * TypeScript modules whenever a row is missing or no database is configured, so
 * the public site behaves exactly as it does today until content is actually
 * migrated — and keeps working if the database ever goes away.
 *
 * Language is a column rather than a table per language: every editable string
 * exists in Hebrew and Russian, and pairing them in one query keeps the admin
 * forms simple.
 */

export const LANGS = ['he', 'ru'] as const

/** Flat key/value store mirroring the i18n dictionaries (`hero.title`, …). */
export const translations = mysqlTable(
  'translations',
  {
    /** Dot path into the dictionary, e.g. "hero.subtitle". */
    key: varchar('key', { length: 191 }).notNull(),
    lang: varchar('lang', { length: 2 }).notNull(),
    /** Plain strings and JSON alike — arrays and objects are stored as JSON. */
    value: json('value').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  t => [primaryKey({ columns: [t.key, t.lang] })],
)

/** Per-page SEO fields: title, description, H1 and the CTA label. */
export const pageSeo = mysqlTable(
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
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  t => [primaryKey({ columns: [t.slug, t.lang] })],
)

/**
 * Body copy blocks — the heading/paragraphs/list/outro shape ContentBlocks
 * already renders. `ownerType` distinguishes a category page from a model page
 * so both can share the table.
 */
export const contentBlocks = mysqlTable(
  'content_blocks',
  {
    id: int('id').autoincrement().primaryKey(),
    ownerType: varchar('owner_type', { length: 16 }).notNull(), // 'page' | 'category' | 'model'
    ownerSlug: varchar('owner_slug', { length: 191 }).notNull(),
    lang: varchar('lang', { length: 2 }).notNull(),
    position: int('position').default(0).notNull(),
    heading: varchar('heading', { length: 255 }),
    paragraphs: json('paragraphs').$type<string[]>(),
    items: json('items').$type<string[]>(),
    outro: json('outro').$type<string[]>(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  t => [index('owner_idx').on(t.ownerType, t.ownerSlug, t.lang)],
)

/** The five categories. */
export const categories = mysqlTable('categories', {
  slug: varchar('slug', { length: 191 }).primaryKey(),
  mainImage: varchar('main_image', { length: 512 }),
  position: int('position').default(0).notNull(),
  published: boolean('published').default(true).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

/** The 17 product models, each with its own page. */
export const models = mysqlTable(
  'models',
  {
    slug: varchar('slug', { length: 191 }).primaryKey(),
    categorySlug: varchar('category_slug', { length: 191 }).notNull(),
    mainImage: varchar('main_image', { length: 512 }),
    gallery: json('gallery').$type<string[]>(),
    position: int('position').default(0).notNull(),
    published: boolean('published').default(true).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  t => [index('category_idx').on(t.categorySlug)],
)

/** Names, short lines, descriptions and feature bullets for both entity kinds. */
export const catalogText = mysqlTable(
  'catalog_text',
  {
    entityType: varchar('entity_type', { length: 16 }).notNull(), // 'category' | 'model'
    slug: varchar('slug', { length: 191 }).notNull(),
    lang: varchar('lang', { length: 2 }).notNull(),
    name: varchar('name', { length: 255 }),
    short: text('short'),
    description: text('description'),
    features: json('features').$type<string[]>(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  t => [primaryKey({ columns: [t.entityType, t.slug, t.lang] })],
)

/** FAQ, shown on /services and mirrored into FAQPage structured data. */
export const faqItems = mysqlTable(
  'faq_items',
  {
    id: int('id').autoincrement().primaryKey(),
    lang: varchar('lang', { length: 2 }).notNull(),
    position: int('position').default(0).notNull(),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    published: boolean('published').default(true).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  t => [index('lang_idx').on(t.lang)],
)

/** Uploaded images. `path` is the public URL the site renders. */
export const media = mysqlTable('media', {
  id: int('id').autoincrement().primaryKey(),
  path: varchar('path', { length: 512 }).notNull().unique(),
  originalName: varchar('original_name', { length: 255 }),
  width: int('width'),
  height: int('height'),
  bytes: int('bytes'),
  alt: varchar('alt', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/** Admin accounts. Seeded from the CLI — there is no public signup. */
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  /** scrypt hash, formatted "salt:derivedKey" — see lib/auth. */
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 191 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
