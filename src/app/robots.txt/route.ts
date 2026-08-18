import { SITE_URL } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

/**
 * Generated rather than shipped as a static file, so the sitemap and host lines
 * always follow NEXT_PUBLIC_SITE_URL instead of drifting from it.
 *
 * Written as a route handler rather than Next's robots.ts export, because
 * MetadataRoute.Robots has no way to emit Content-Signal lines and would drop
 * them silently.
 *
 * The whole site is open. The previous policy (from VitlionSEO/03_Robots.md)
 * disallowed `/`, `/about`, `/projects` and `/contact`, but Disallow does not
 * remove a page from the index — it only stops the page being read. Google kept
 * listing the homepage for brand queries and rendered it as a bare URL with
 * "no information is available for this page", which reads as a broken site.
 *
 * It also worked against the point of the GEO work: Disallow applies to GPTBot,
 * ClaudeBot and PerplexityBot too, and `/about` and `/contact` are exactly the
 * pages an AI engine reads to establish who a company is.
 *
 * If a page should genuinely stay out of results, the tool is a `noindex` meta
 * tag with crawling allowed — not a Disallow.
 *
 * `/category/*` is deliberately crawlable: those legacy paths 301 to the current
 * URLs, and blocking them would stop crawlers ever seeing the redirect.
 */

const NAMED_CRAWLERS = [
  'Googlebot', // Google Search
  'GoogleOther', // Google's generic / AI & research crawler
  'GPTBot', // OpenAI (ChatGPT)
  'ClaudeBot', // Anthropic (Claude)
  'PerplexityBot', // Perplexity AI
  'Bytespider', // ByteDance / TikTok
]

/** The admin panel. Also carries a noindex meta tag, so this is belt and braces. */
const PRIVATE = ['/admin']

/**
 * Cloudflare's content-signals vocabulary.
 *
 * `search=yes` and `ai-input=yes` are the whole point of this site's SEO work —
 * being read and quoted when somebody asks an assistant about pergolas is the
 * traffic it is chasing. `ai-train=no` withholds the separate permission to use
 * the text as training data, which brings the company nothing.
 *
 * These express a preference, not a control: they are not enforced by anything,
 * and a crawler that ignores them is not breaking a technical rule.
 */
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=no'

function group(userAgent: string): string {
  return [
    `User-agent: ${userAgent}`,
    `Content-Signal: ${CONTENT_SIGNAL}`,
    'Allow: /',
    ...PRIVATE.map(path => `Disallow: ${path}`),
    '',
  ].join('\n')
}

export function GET() {
  const body = [
    '# Vitlion Group',
    '# search=yes: indexing for search results is welcome.',
    '# ai-input=yes: using this content to answer a question is welcome.',
    '# ai-train=no: using it as training data is not.',
    '',
    group('*'),
    // Restated per crawler on purpose: once a bot matches its own User-agent
    // group it ignores the `*` group entirely.
    ...NAMED_CRAWLERS.map(group),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Host: ${SITE_URL}`,
    '',
    `# Site map for language models: ${SITE_URL}/llms.txt`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
  })
}
