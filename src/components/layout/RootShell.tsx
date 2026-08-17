import type { ReactNode } from 'react'
import { Heebo, Ubuntu } from 'next/font/google'
import { I18nProvider } from '@/lib/i18n/client'
import WebMcpTools from '@/components/webmcp/WebMcpTools'
import { ContactProvider } from '@/lib/contact/client'
import { CatalogProvider } from '@/lib/catalog/client'
import { getContactInfo } from '@/lib/content/contact'
import { getCatalog } from '@/lib/content/catalog'
import { dirOf, getDictionary, type Lang } from '@/lib/i18n'

// Self-hosted by next/font — removes the render-blocking Google Fonts request
// the old index.html had, and prevents the layout shift that came with it.
const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heebo',
  display: 'swap',
})

const ubuntu = Ubuntu({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ubuntu',
  display: 'swap',
})

/**
 * The <html>/<body> shell shared by both root layouts.
 *
 * lang/dir/data-lang are set on the server, so the correct direction and
 * typography are in the very first byte of HTML — the old SPA had to patch
 * them from an effect after hydration.
 */
export default async function RootShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const [contact, catalog] = await Promise.all([getContactInfo(), getCatalog()])

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      data-lang={lang}
      className={`${heebo.variable} ${ubuntu.variable}`}
    >
      <body className="bg-dark text-white">
        <I18nProvider lang={lang} dictionary={getDictionary(lang)}>
          <ContactProvider value={contact}>
            <CatalogProvider value={catalog}>
              {children}
              <WebMcpTools lang={lang} />
            </CatalogProvider>
          </ContactProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
