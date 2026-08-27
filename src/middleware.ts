import { NextResponse, type NextRequest } from 'next/server'

/**
 * Serves Markdown to agents that ask for it.
 *
 * An assistant fetching a page gets 190 kB of HTML, fonts and framer-motion
 * wrappers to extract four paragraphs from. If it says `Accept: text/markdown`,
 * it gets the four paragraphs.
 *
 * Browsers are unaffected: their Accept header lists text/html and never
 * text/markdown, so this rewrite cannot fire for a person.
 *
 * Content negotiation alone is not enough in production, which was verified
 * against the live site rather than assumed: Hostinger's CDN caches by URL
 * without honouring Vary, so a request for Markdown was answered from the
 * cached HTML entry — content-type text/html, s-maxage of a year. Marking the
 * Markdown response no-store keeps it out of the cache but cannot stop the HTML
 * already sitting there from being served.
 *
 * So every page also has its own Markdown address under /md, advertised in a
 * Link header, in llms.txt and in the agent skill. A distinct URL cannot
 * collide in any cache. This rewrite stays for clients that negotiate and for
 * caches that respect Vary.
 */
export function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') ?? ''
  if (!accept.includes('text/markdown')) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/md${request.nextUrl.pathname}`.replace(/\/$/, '')
  return NextResponse.rewrite(url)
}

export const config = {
  // Content routes only: never the API, the build output, media, the admin
  // panel, or anything with a file extension.
  matcher: ['/((?!api|md|_next|admin|media|.*\\.).*)'],
}
