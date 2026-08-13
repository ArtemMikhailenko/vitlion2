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
    ]
  },
}

export default nextConfig
