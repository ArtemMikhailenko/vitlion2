import type { MetadataRoute } from 'next'
import { INDEXABLE_CATEGORY_SLUGS } from '@/data/seoContent'
import { LANGS, localePath } from '@/lib/i18n'
import { SITE_URL } from '@/lib/site'

/**
 * Generated instead of a static public/robots.txt so the allow-list can never
 * drift away from the routes that actually exist.
 *
 * Only the commercial pages are open; the homepage and the about/projects/
 * contact pages stay closed, which is the policy the site already shipped with.
 *
 * The named crawlers repeat the same policy on purpose: per the robots.txt
 * spec, once a bot matches its own User-agent group it ignores the `*` group
 * entirely, so the rules must be restated rather than inherited.
 */

const NAMED_CRAWLERS = [
  'Googlebot', // Google Search
  'GoogleOther', // Google's generic / AI & research crawler
  'GPTBot', // OpenAI (ChatGPT)
  'ClaudeBot', // Anthropic (Claude)
  'PerplexityBot', // Perplexity AI
  'Bytespider', // ByteDance / TikTok
]

const INDEXABLE_PATHS = ['services', ...INDEXABLE_CATEGORY_SLUGS]
const CLOSED_PATHS = ['about', 'projects', 'contact']

function policy() {
  const allow: string[] = []
  const disallow: string[] = []

  for (const lang of LANGS) {
    for (const path of INDEXABLE_PATHS) allow.push(localePath(lang, path))
    for (const path of CLOSED_PATHS) disallow.push(localePath(lang, path))
    // `$` anchors the match to the exact URL so only the landing page itself is
    // closed, not everything beneath it.
    disallow.push(`${localePath(lang)}$`)
  }
  disallow.push('/category')

  return { allow, disallow }
}

export default function robots(): MetadataRoute.Robots {
  const { allow, disallow } = policy()

  return {
    rules: [
      { userAgent: '*', allow, disallow },
      { userAgent: NAMED_CRAWLERS, allow, disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
