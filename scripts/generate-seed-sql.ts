/**
 * Generates the Postgres file that seeds a fresh Neon database with everything
 * the site currently renders.
 *
 * Read from the real data modules rather than hand-written, so the SQL cannot
 * drift from what is live. Run with Node's type stripping:
 *
 *   node --experimental-strip-types scripts/generate-seed-sql.ts > seed.sql
 *
 * The output is meant to be pasted into Neon's SQL Editor — no client, no shell.
 */

import { CATEGORIES } from '../src/data/services.ts'
import { SEO_PAGES, INDEXABLE_CATEGORY_SLUGS } from '../src/data/seoContent.ts'
import { CATEGORY_BRIEF, MODEL_BRIEF, SERVICES_BRIEF, FAQ_BRIEF } from '../src/data/briefContent.ts'
import he from '../src/i18n/he.ts'
import ru from '../src/i18n/ru.ts'
import { FIELD_GROUPS } from '../src/lib/admin/fields.ts'

const LANGS = ['he', 'ru'] as const
type Lang = (typeof LANGS)[number]

const DICT: Record<Lang, unknown> = { he, ru }

/** Postgres string literal — doubling quotes is the only escape needed. */
const q = (value: string) => `'${value.replace(/'/g, "''")}'`
const jsonb = (value: unknown) => `${q(JSON.stringify(value))}::jsonb`

function readPath(source: unknown, path: string): unknown {
  let node: unknown = source
  for (const part of path.split('.')) {
    if (node === null || typeof node !== 'object') return undefined
    node = (node as Record<string, unknown>)[part]
  }
  return node
}

const out: string[] = []
const say = (line = '') => out.push(line)

say('-- Vitlion CMS — schema and current content.')
say('-- Generated from the site source; paste into the Neon SQL Editor.')
say('-- Safe to re-run: tables are created only if absent and rows are upserted.')
say()

// ── Schema ──────────────────────────────────────────────────────────────────
say(`CREATE TABLE IF NOT EXISTS translations (
  key varchar(191) NOT NULL,
  lang varchar(2) NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (key, lang)
);

CREATE TABLE IF NOT EXISTS page_seo (
  slug varchar(191) NOT NULL,
  lang varchar(2) NOT NULL,
  title varchar(255),
  description text,
  h1 varchar(255),
  cta_label varchar(191),
  indexable boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (slug, lang)
);

CREATE TABLE IF NOT EXISTS content_blocks (
  id serial PRIMARY KEY,
  owner_type varchar(16) NOT NULL,
  owner_slug varchar(191) NOT NULL,
  lang varchar(2) NOT NULL,
  position integer NOT NULL DEFAULT 0,
  heading varchar(255),
  paragraphs jsonb,
  items jsonb,
  outro jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS owner_idx ON content_blocks (owner_type, owner_slug, lang);

CREATE TABLE IF NOT EXISTS categories (
  slug varchar(191) PRIMARY KEY,
  main_image varchar(512),
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS models (
  slug varchar(191) PRIMARY KEY,
  category_slug varchar(191) NOT NULL,
  main_image varchar(512),
  gallery jsonb,
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS category_idx ON models (category_slug);

CREATE TABLE IF NOT EXISTS catalog_text (
  entity_type varchar(16) NOT NULL,
  slug varchar(191) NOT NULL,
  lang varchar(2) NOT NULL,
  name varchar(255),
  short text,
  description text,
  features jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (entity_type, slug, lang)
);

CREATE TABLE IF NOT EXISTS faq_items (
  id serial PRIMARY KEY,
  lang varchar(2) NOT NULL,
  position integer NOT NULL DEFAULT 0,
  question text NOT NULL,
  answer text NOT NULL,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lang_idx ON faq_items (lang);

CREATE TABLE IF NOT EXISTS media (
  id serial PRIMARY KEY,
  path varchar(512) NOT NULL UNIQUE,
  public_id varchar(255),
  original_name varchar(255),
  width integer,
  height integer,
  bytes integer,
  alt varchar(255),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  email varchar(191) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  name varchar(191),
  created_at timestamptz NOT NULL DEFAULT now()
);`)
say()

// ── Interface strings ───────────────────────────────────────────────────────
const keys = FIELD_GROUPS.flatMap(g => g.fields.map(f => f.key))
say(`-- Interface strings (${keys.length} keys × 2 languages)`)
for (const key of keys) {
  for (const lang of LANGS) {
    const value = readPath(DICT[lang], key)
    if (value === undefined) continue
    say(
      `INSERT INTO translations (key, lang, value) VALUES (${q(key)}, ${q(lang)}, ${jsonb(String(value))}) ` +
        `ON CONFLICT (key, lang) DO UPDATE SET value = excluded.value, updated_at = now();`,
    )
  }
}
say()

// ── Page SEO ────────────────────────────────────────────────────────────────
say('-- Page titles, descriptions and H1s')
for (const [slug, byLang] of Object.entries(SEO_PAGES)) {
  const indexable = slug === 'services' || (INDEXABLE_CATEGORY_SLUGS as readonly string[]).includes(slug)
  for (const lang of LANGS) {
    const seo = byLang[lang]
    if (!seo) continue
    say(
      `INSERT INTO page_seo (slug, lang, title, description, h1, cta_label, indexable) VALUES (` +
        `${q(slug)}, ${q(lang)}, ${q(seo.title)}, ${q(seo.description)}, ${q(seo.h1)}, ${q(seo.ctaLabel)}, ${indexable}) ` +
        `ON CONFLICT (slug, lang) DO UPDATE SET title = excluded.title, description = excluded.description, ` +
        `h1 = excluded.h1, cta_label = excluded.cta_label, indexable = excluded.indexable, updated_at = now();`,
    )
  }
}
say()

// ── Catalogue ───────────────────────────────────────────────────────────────
say('-- Categories and models')
CATEGORIES.forEach((category, position) => {
  say(
    `INSERT INTO categories (slug, main_image, position) VALUES (${q(category.slug)}, ${q(category.mainImage)}, ${position}) ` +
      `ON CONFLICT (slug) DO UPDATE SET main_image = excluded.main_image, position = excluded.position, updated_at = now();`,
  )
  for (const lang of LANGS) {
    say(
      `INSERT INTO catalog_text (entity_type, slug, lang, name, short) VALUES (` +
        `'category', ${q(category.slug)}, ${q(lang)}, ${q(category.name[lang])}, ${q(category.short[lang])}) ` +
        `ON CONFLICT (entity_type, slug, lang) DO UPDATE SET name = excluded.name, short = excluded.short, updated_at = now();`,
    )
  }

  category.services.forEach((service, index) => {
    say(
      `INSERT INTO models (slug, category_slug, main_image, gallery, position) VALUES (` +
        `${q(service.slug)}, ${q(category.slug)}, ${q(service.mainImage)}, ${jsonb(service.gallery)}, ${index}) ` +
        `ON CONFLICT (slug) DO UPDATE SET category_slug = excluded.category_slug, main_image = excluded.main_image, ` +
        `gallery = excluded.gallery, position = excluded.position, updated_at = now();`,
    )
    for (const lang of LANGS) {
      say(
        `INSERT INTO catalog_text (entity_type, slug, lang, name, short, description, features) VALUES (` +
          `'model', ${q(service.slug)}, ${q(lang)}, ${q(service.name[lang])}, ${q(service.short[lang])}, ` +
          `${q(service.description[lang])}, ${jsonb(service.features[lang])}) ` +
          `ON CONFLICT (entity_type, slug, lang) DO UPDATE SET name = excluded.name, short = excluded.short, ` +
          `description = excluded.description, features = excluded.features, updated_at = now();`,
      )
    }
  })
})
say()

// ── Body copy ───────────────────────────────────────────────────────────────
say('-- Body copy from the SEO brief')
say(`DELETE FROM content_blocks;`)

const emitBlocks = (ownerType: string, ownerSlug: string, lang: Lang, blocks: unknown[]) => {
  blocks.forEach((raw, position) => {
    const block = raw as { heading?: string; paragraphs?: string[]; items?: string[]; outro?: string[] }
    say(
      `INSERT INTO content_blocks (owner_type, owner_slug, lang, position, heading, paragraphs, items, outro) VALUES (` +
        `${q(ownerType)}, ${q(ownerSlug)}, ${q(lang)}, ${position}, ` +
        `${block.heading ? q(block.heading) : 'NULL'}, ` +
        `${block.paragraphs?.length ? jsonb(block.paragraphs) : 'NULL'}, ` +
        `${block.items?.length ? jsonb(block.items) : 'NULL'}, ` +
        `${block.outro?.length ? jsonb(block.outro) : 'NULL'});`,
    )
  })
}

for (const lang of LANGS) emitBlocks('page', 'services', lang, SERVICES_BRIEF[lang].blocks)
for (const [slug, byLang] of Object.entries(CATEGORY_BRIEF)) {
  for (const lang of LANGS) emitBlocks('category', slug, lang, byLang[lang])
}
for (const [slug, byLang] of Object.entries(MODEL_BRIEF)) {
  for (const lang of LANGS) emitBlocks('model', slug, lang, byLang[lang])
}
say()

// ── FAQ ─────────────────────────────────────────────────────────────────────
say('-- FAQ')
say(`DELETE FROM faq_items;`)
for (const lang of LANGS) {
  FAQ_BRIEF[lang].forEach((item, position) => {
    say(
      `INSERT INTO faq_items (lang, position, question, answer) VALUES (` +
        `${q(lang)}, ${position}, ${q(item.question)}, ${q(item.answer)});`,
    )
  })
}
say()

say('-- Admin account: uncomment and paste a hash produced by scripts/hash-password.ts')
say(`-- INSERT INTO users (email, password_hash, name) VALUES ('admin@vitlion.co.il', 'SALT:HASH', 'Админ')`)
say(`--   ON CONFLICT (email) DO UPDATE SET password_hash = excluded.password_hash;`)

console.log(out.join('\n'))
