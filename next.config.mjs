/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
}

export default nextConfig
