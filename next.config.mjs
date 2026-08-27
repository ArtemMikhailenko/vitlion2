/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Static generation fans out one worker per CPU by default. The page count
  // went from 25 to 59 when the per-model routes landed, and on a memory-capped
  // build container that fan-out is what pushes the build over the limit.
  // Capping the workers trades a slower build for one that finishes.
  experimental: {
    cpus: 2,
    workerThreads: false,
  },

  // Legacy URLs kept alive from the previous SPA (were in vercel.json).
  // The old client-side catch-all that silently 200'd every unknown URL onto
  // the homepage is intentionally NOT reproduced — unknown paths now 404.
  async redirects() {
    return [
      // Canonical host. The site answers on several hostnames — vitlion.co.il,
      // www.vitlion.co.il and www.vitlion.com all reach this app — and Google
      // treats each as a separate site with duplicate content. Everything is
      // sent to the host the SEO documentation names as canonical.
      //
      // The `has` condition matches only non-canonical hosts, so there is no
      // redirect loop. vitlion.com is not covered here: it still points at the
      // old Tilda site on a different server, so its redirect has to be set up
      // there.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'vitlion.co.il' }],
        destination: 'https://www.vitlion.co.il/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.vitlion.com' }],
        destination: 'https://www.vitlion.co.il/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'vitlion.com' }],
        destination: 'https://www.vitlion.co.il/:path*',
        permanent: true,
      },

      { source: '/he', destination: '/', permanent: true },
      { source: '/he/:path*', destination: '/:path*', permanent: true },
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
      {
        source: '/category/:categorySlug/service/:serviceSlug',
        destination: '/:categorySlug',
        permanent: true,
      },
      { source: '/category/:categorySlug', destination: '/:categorySlug', permanent: true },
      {
        source: '/ru/category/:categorySlug/service/:serviceSlug',
        destination: '/ru/:categorySlug',
        permanent: true,
      },
      { source: '/ru/category/:categorySlug', destination: '/ru/:categorySlug', permanent: true },
    ]
  },

  // Files in public/ are served with `max-age=0` by default, so every repeat
  // visit re-validates each photo and video. These assets are content-stable
  // and versioned by hand, so give them a long cache with revalidation.
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
      {
        // Lets an agent find the canonical machine-readable resources from the
        // response headers alone, without fetching and parsing the HTML first.
        // Applied to pages only — :path* would also match assets, where these
        // links are noise on every image request.
        source: '/:path((?!media|_next|api|md).*)',
        headers: [
          {
            key: 'Link',
            value:
              '</sitemap.xml>; rel="sitemap"; type="application/xml", ' +
              '</llms.txt>; rel="describedby"; type="text/plain", ' +
              // The same page as plain Markdown, at an address of its own.
              // Content negotiation on this URL is answered from the CDN's
              // cached HTML, so the alternate is the reliable route.
              '</md/:path>; rel="alternate"; type="text/markdown"',
          },
        ],
      },
    ]
  },
}

export default nextConfig
