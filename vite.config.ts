import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'

const CATEGORY_SLUGS = ['electric-pergolas', 'static-pergolas', 'zip-shutters', 'glazing', 'glass-roofs']

// Every route the SPA serves — prerendered at build time so the static HTML
// carries the per-page <head> (title, description, canonical, OG, JSON-LD).
const ROUTES = [
  '/', '/services', '/projects', '/contact', '/about',
  ...CATEGORY_SLUGS.map(s => `/${s}`),
  '/ru', '/ru/services', '/ru/projects', '/ru/contact', '/ru/about',
  ...CATEGORY_SLUGS.map(s => `/ru/${s}`),
]

export default defineConfig({
  plugins: [
    react(),
    vitePrerenderPlugin({
      renderTarget: '#root',
      prerenderScript: fileURLToPath(new URL('./src/prerender.tsx', import.meta.url)),
      additionalPrerenderRoutes: ROUTES,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
  },
})
