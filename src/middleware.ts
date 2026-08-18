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
 * The usual second half of content negotiation — Vary: Accept on the HTML — is
 * not available here: the App Router writes its own Vary for RSC and replaces
 * anything set in next.config or appended in middleware. Verified, not assumed.
 * So the Markdown response is marked no-store instead, and a shared cache never
 * holds a copy it could hand to a browser asking for the page.
 */
export function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') ?? ''
  if (!accept.includes('text/markdown')) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/api/markdown${request.nextUrl.pathname}`.replace(/\/$/, '')
  return NextResponse.rewrite(url)
}

export const config = {
  // Content routes only: never the API, the build output, media, the admin
  // panel, or anything with a file extension.
  matcher: ['/((?!api|_next|admin|media|.*\\.).*)'],
}
