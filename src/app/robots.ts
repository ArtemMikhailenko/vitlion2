import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Generated rather than shipped as a static file, so the sitemap and host lines
 * always follow NEXT_PUBLIC_SITE_URL instead of drifting from it.
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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      // Restated per crawler on purpose: once a bot matches its own User-agent
      // group it ignores the `*` group entirely.
      { userAgent: NAMED_CRAWLERS, allow: '/', disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
