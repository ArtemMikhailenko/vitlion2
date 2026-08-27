import { getCatalog } from '@/lib/content/catalog'
import { getPageSeo } from '@/lib/content'
import { getFreshness } from '@/lib/content/freshness'
import { getDictionary, localePath } from '@/lib/i18n'
import { SITE_URL } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * llms.txt — a map of the site for language models, per llmstxt.org.
 *
 * Generated rather than checked in. A static file is a snapshot: hide a model
 * in the panel or rename a category and the file keeps advertising the old
 * shape, which is worse than having none — it points crawlers at pages that
 * now 404. This reads the same catalogue the sitemap and the pages read, so
 * the three cannot disagree.
 *
 * Hebrew is the primary language and leads each section; the Russian tree gets
 * its own section rather than being interleaved, so a model reading top-down is
 * not switching scripts on every line.
 */

const abs = (path: string) => `${SITE_URL}${path}`

function line(title: string, url: string, description?: string): string {
  return description ? `- [${title}](${url}): ${description}` : `- [${title}](${url})`
}

export async function GET() {
  const [catalog, freshness] = await Promise.all([getCatalog(), getFreshness()])
  const out: string[] = []

  const heMeta = getDictionary('he').meta as { description?: string }
  const ruMeta = getDictionary('ru').meta as { description?: string }

  out.push('# Vitlion Group', '')
  out.push(`> ${heMeta.description ?? ''}`, '')
  out.push(
    'Проектирование, производство и монтаж алюминиевых конструкций в Израиле: ' +
      'электрические и статичные перголы, ZIP-шторы, безрамное остекление, гильотины ' +
      'и стеклянные крыши. Сайт двуязычный: иврит по корневым адресам, русский под /ru. ' +
      'Цены не публикуются — расчёт делается по замеру, замер бесплатный.',
    '',
  )

  // One section per category, each with its own page followed by its models.
  for (const category of catalog) {
    const seo = await getPageSeo(category.slug, 'he')
    out.push(`## ${category.name.ru} — ${category.name.he}`, '')
    out.push(
      line(
        seo?.title ?? category.name.he,
        abs(localePath('he', category.slug)),
        seo?.description ?? category.short.he,
      ),
    )
    for (const service of category.services) {
      out.push(
        line(
          `${service.name.he} (${service.name.ru})`,
          abs(localePath('he', `${category.slug}/${service.slug}`)),
          service.short.he,
        ),
      )
    }
    out.push('')
  }

  const servicesSeo = await getPageSeo('services', 'he')
  out.push('## Общие страницы', '')
  out.push(
    line(
      servicesSeo?.title ?? 'שירותים',
      abs(localePath('he', 'services')),
      servicesSeo?.description,
    ),
  )
  out.push(line('דף הבית — главная', abs(localePath('he')), heMeta.description))
  out.push(line('אודות — о компании и сравнение стёкол', abs(localePath('he', 'about'))))
  out.push(line('פרויקטים — выполненные проекты', abs(localePath('he', 'projects'))))
  out.push(line('צור קשר — контакты и форма заявки', abs(localePath('he', 'contact'))))
  out.push('')

  out.push('## Для агентов', '')
  out.push(
    line(
      'Agent Skill (SKILL.md)',
      abs('/skill.md'),
      'Как читать каталог, что можно и чего нельзя утверждать от имени компании',
    ),
  )
  out.push(
    line(
      'Markdown-версия любой страницы',
      abs('/md/'),
      'Добавьте /md перед путём: /md/ru/electric-pergolas/bioclimatic. ' +
        'Заголовок Accept: text/markdown на обычном адресе тоже работает, но ' +
        'кэш может ответить HTML — адрес с /md надёжнее',
    ),
  )
  out.push(line('Карта сайта', abs('/sitemap.xml'), 'Те же адреса с парами hreflang'))
  out.push('')

  out.push('## Русская версия', '')
  out.push(line('Главная', abs(localePath('ru')), ruMeta.description))
  for (const category of catalog) {
    const seo = await getPageSeo(category.slug, 'ru')
    out.push(
      line(seo?.title ?? category.name.ru, abs(localePath('ru', category.slug)), seo?.description),
    )
    for (const service of category.services) {
      out.push(
        line(
          service.name.ru,
          abs(localePath('ru', `${category.slug}/${service.slug}`)),
          service.short.ru,
        ),
      )
    }
  }
  out.push('')

  return new Response(out.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Last-Modified': freshness.site.toUTCString(),
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
