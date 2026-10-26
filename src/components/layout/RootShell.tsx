import type { ReactNode } from 'react'
import { Heebo, Ubuntu } from 'next/font/google'
import { I18nProvider } from '@/lib/i18n/client'
import WebMcpTools from '@/components/webmcp/WebMcpTools'
import GoogleTag from '@/components/analytics/GoogleTag'
import { ContactProvider } from '@/lib/contact/client'
import { CatalogProvider } from '@/lib/catalog/client'
import { getContactInfo } from '@/lib/content/contact'
import { getCatalog } from '@/lib/content/catalog'
import { getLiveDictionary } from '@/lib/content/translations'
import { dirOf, type Lang } from '@/lib/i18n'

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
 * Recovers from a page whose JavaScript belongs to a build that no longer exists.
 *
 * Inline, and in <head>, on purpose. The failure it handles is a chunk that
 * 404s; recovery code shipped as a chunk could fail to load for exactly the
 * same reason. As an inline script it is in the HTML itself and registers its
 * listeners before Next starts fetching anything.
 *
 * A plain reload would not help: it asks the CDN for the same URL and gets the
 * same stale HTML back. The `_v` query makes it a URL the CDN has never cached,
 * so the request reaches the server and returns HTML from the current build.
 * Two kinds of failure reach it. A lazy chunk that webpack cannot load rejects
 * with a ChunkLoadError message. A <script> or stylesheet tag whose file is
 * gone fires an error event carrying no message at all — only its target — so
 * that case is recognised by the element and its /_next/static/ address.
 * Anything else, including third-party tags like gtag, is left alone.
 *
 * `_v` doubles as the loop guard — if the fresh page fails too, the parameter
 * is already present and nothing reloads again — and it is stripped from the
 * address bar once the page has settled, so it is never copied or shared.
 *
 * The strip waits two seconds past `load`, and that was measured, not guessed:
 * stripped on `load` itself, the parameter came straight back, because the App
 * Router finishes hydrating after `load` and replaces the history entry with the
 * URL the page was rendered for.
 */
const CHUNK_RECOVERY = `(function(){
  function isChunkError(m){return /ChunkLoadError|Loading (CSS )?chunk [\\w-]+ failed/i.test(m||'')}
  function recover(m){
    if(!isChunkError(m))return;
    try{
      var u=new URL(location.href);
      if(u.searchParams.has('_v'))return;
      u.searchParams.set('_v',String(Date.now()));
      location.replace(u.toString());
    }catch(e){}
  }
  addEventListener('error',function(e){
    var t=e&&e.target;
    if(t&&t!==window&&(t.tagName==='SCRIPT'||t.tagName==='LINK')){
      var src=t.src||t.href||'';
      if(src.indexOf('/_next/static/')!==-1)recover('ChunkLoadError');
      return;
    }
    recover((e&&e.message)||(e&&e.error&&(e.error.name+' '+e.error.message))||'')
  },true);
  addEventListener('unhandledrejection',function(e){var r=e&&e.reason;recover(r?((r.name||'')+' '+(r.message||r)):'')});
  addEventListener('load',function(){
    setTimeout(function(){
      try{var u=new URL(location.href);if(u.searchParams.has('_v')){u.searchParams.delete('_v');history.replaceState(history.state,'',u.toString())}}catch(e){}
    },2000);
  });
})();`

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: CHUNK_RECOVERY }} />
      </head>
      <body className="bg-dark text-white">
        <I18nProvider lang={lang} dictionary={await getLiveDictionary(lang)}>
          <ContactProvider value={contact}>
            <CatalogProvider value={catalog}>
              {children}
              <WebMcpTools lang={lang} />
              <GoogleTag />
            </CatalogProvider>
          </ContactProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
