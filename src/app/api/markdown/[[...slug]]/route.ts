import type { ContentBlock } from '@/components/sections/ContentBlocks'
import { getCategoryBlocks, getFaq, getModelBlocks, getPageSeo } from '@/lib/content'
import { getCatalog } from '@/lib/content/catalog'
import { getContactInfo } from '@/lib/content/contact'
import { getDictionary, localePath, type Lang } from '@/lib/i18n'
import { SITE_URL, WARRANTY_YEARS } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Markdown rendering of the public pages, reached by asking for it.
 *
 * The middleware rewrites here when a request carries `Accept: text/markdown`.
 * Everything is read from the same content layer the HTML pages use, so a text
 * edited in the panel changes both at once and the two versions cannot say
 * different things.
 */

function renderBlocks(blocks: ContentBlock[]): string[] {
  const out: string[] = []
  for (const block of blocks) {
    if (block.heading) out.push(`## ${block.heading}`, '')
    for (const paragraph of block.paragraphs ?? []) out.push(paragraph, '')
    for (const item of block.items ?? []) out.push(`- ${item}`)
    if (block.items?.length) out.push('')
    for (const outro of block.outro ?? []) out.push(outro, '')
  }
  return out
}

async function footer(lang: Lang): Promise<string[]> {
  const contact = await getContactInfo()
  return [
    '---',
    '',
    `Vitlion Group — ${lang === 'ru' ? 'производство и монтаж алюминиевых конструкций в Израиле' : 'ייצור והתקנה של מבני אלומיניום בישראל'}.`,
    `${lang === 'ru' ? 'Телефон' : 'טלפון'}: ${contact.phone} · WhatsApp: ${contact.whatsapp} · ${contact.email}`,
    `${lang === 'ru' ? 'Гарантия' : 'אחריות'}: ${WARRANTY_YEARS} ${lang === 'ru' ? 'лет' : 'שנים'}. ${lang === 'ru' ? 'Замер бесплатный, цены рассчитываются по проекту.' : 'מדידה חינם, המחיר נקבע לפי הפרויקט.'}`,
    '',
  ]
}

/** Splits "ru/electric-pergolas/bioclimatic" into a language and a path. */
function parse(slug: string[]): { lang: Lang; parts: string[] } {
  if (slug[0] === 'ru') return { lang: 'ru', parts: slug.slice(1) }
  return { lang: 'he', parts: slug }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params
  const { lang, parts } = parse(slug)

  const body = await render(lang, parts)
  if (!body) return new Response('Not found', { status: 404 })

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // Without this a shared cache could serve the Markdown to a browser that
      // asked for HTML.
      Vary: 'Accept',
      // Never stored by a shared cache. This response is served from the page's
      // own URL via a rewrite, so a CDN that kept it would later hand Markdown
      // to a browser asking for that page — and Vary cannot be relied on to
      // prevent that here. Agent traffic is low enough that the missed caching
      // costs nothing.
      'Cache-Control': 'no-store',
    },
  })
}

async function render(lang: Lang, parts: string[]): Promise<string | null> {
  const catalog = await getCatalog()
  const dict = getDictionary(lang)
  const meta = dict.meta as { title?: string; description?: string }
  const abs = (path: string) => `${SITE_URL}${path}`

  // Home page — an index rather than a copy of the marketing copy.
  if (parts.length === 0) {
    const hero = dict.hero as { title?: string; titleSuffix?: string; subtitle?: string }
    const out = [
      `# ${meta.title ?? 'Vitlion Group'}`,
      '',
      meta.description ?? '',
      '',
      `${hero.title ?? ''} ${hero.titleSuffix ?? ''}`.trim(),
      '',
      hero.subtitle ?? '',
      '',
      `## ${lang === 'ru' ? 'Категории' : 'קטגוריות'}`,
      '',
    ]
    for (const category of catalog) {
      out.push(
        `- [${category.name[lang]}](${abs(localePath(lang, category.slug))}) — ${category.short[lang]}`,
      )
    }
    out.push('', ...(await footer(lang)))
    return out.join('\n')
  }

  if (parts.length === 1 && parts[0] === 'services') {
    const seo = await getPageSeo('services', lang)
    const faq = await getFaq(lang)
    const out = [`# ${seo?.h1 ?? seo?.title ?? ''}`, '', seo?.description ?? '', '']

    for (const category of catalog) {
      out.push(`## ${category.name[lang]}`, '', category.short[lang], '')
      for (const service of category.services) {
        out.push(
          `- [${service.name[lang]}](${abs(localePath(lang, `${category.slug}/${service.slug}`))}) — ${service.short[lang]}`,
        )
      }
      out.push('')
    }

    if (faq.length) {
      out.push(`## ${lang === 'ru' ? 'Вопросы и ответы' : 'שאלות ותשובות'}`, '')
      for (const item of faq) out.push(`### ${item.question}`, '', item.answer, '')
    }

    out.push(...(await footer(lang)))
    return out.join('\n')
  }

  // Category page.
  if (parts.length === 1) {
    const category = catalog.find(c => c.slug === parts[0])
    if (!category) return null

    const seo = await getPageSeo(category.slug, lang)
    const out = [
      `# ${seo?.h1 ?? category.name[lang]}`,
      '',
      seo?.description ?? category.short[lang],
      '',
      ...renderBlocks(await getCategoryBlocks(category.slug, lang)),
      `## ${lang === 'ru' ? 'Модели' : 'דגמים'}`,
      '',
    ]
    for (const service of category.services) {
      out.push(
        `- [${service.name[lang]}](${abs(localePath(lang, `${category.slug}/${service.slug}`))}) — ${service.short[lang]}`,
      )
    }
    out.push('', ...(await footer(lang)))
    return out.join('\n')
  }

  // Model page.
  if (parts.length === 2) {
    const category = catalog.find(c => c.slug === parts[0])
    const service = category?.services.find(s => s.slug === parts[1])
    if (!category || !service) return null

    const features = service.features[lang] ?? []
    const out = [
      `# ${service.name[lang]}`,
      '',
      `${lang === 'ru' ? 'Категория' : 'קטגוריה'}: [${category.name[lang]}](${abs(localePath(lang, category.slug))})`,
      '',
      service.short[lang],
      '',
      service.description[lang],
      '',
    ]

    if (features.length) {
      out.push(`## ${lang === 'ru' ? 'Характеристики' : 'מאפיינים'}`, '')
      for (const feature of features) out.push(`- ${feature}`)
      out.push('')
    }

    out.push(...renderBlocks(await getModelBlocks(service.slug, lang)))

    const siblings = category.services.filter(s => s.slug !== service.slug)
    if (siblings.length) {
      out.push(`## ${lang === 'ru' ? 'Другие модели категории' : 'דגמים נוספים'}`, '')
      for (const sibling of siblings) {
        out.push(
          `- [${sibling.name[lang]}](${abs(localePath(lang, `${category.slug}/${sibling.slug}`))})`,
        )
      }
      out.push('')
    }

    out.push(...(await footer(lang)))
    return out.join('\n')
  }

  return null
}
