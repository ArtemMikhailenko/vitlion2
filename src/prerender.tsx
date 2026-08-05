import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import i18n from './i18n'

/**
 * Build-time prerender entry used by `vite-prerender-plugin`.
 *
 * For every route it renders the app to a string under a StaticRouter and
 * collects the <head> produced by react-helmet-async (title, description,
 * canonical, hreflang, Open Graph, JSON-LD) so those tags end up in the
 * STATIC HTML that non-JS crawlers (social networks, AI bots) actually read.
 *
 * This file only runs in Node during `vite build` — never in the browser.
 */

interface PrerenderData {
  url: string
}

type HeadElement = { type: string; props: Record<string, unknown> }

// React uses camelCase prop names; HTML attributes must be lowercase/kebab.
const ATTR_RENAME: Record<string, string> = {
  hrefLang: 'hreflang',
  charSet: 'charset',
  httpEquiv: 'http-equiv',
  className: 'class',
  crossOrigin: 'crossorigin',
}

/** Convert react-helmet-async component groups into the plugin's element shape. */
function toHeadElements(...groups: Array<{ toComponent: () => any }>): Set<HeadElement> {
  const out: HeadElement[] = []
  for (const group of groups) {
    const components = group.toComponent()
    const list = Array.isArray(components) ? components : [components]
    for (const el of list) {
      if (!el || typeof el.type !== 'string') continue
      const props: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(el.props ?? {})) {
        if (value == null) continue
        // Keep `data-rh` so react-helmet-async recognises these prerendered tags
        // on hydration and reconciles them in place instead of duplicating.
        if (key === 'dangerouslySetInnerHTML') {
          // e.g. the JSON-LD <script> — serialize as text content.
          const html = (value as { __html?: string }).__html
          if (html) props.children = html
          continue
        }
        if (key === 'children') {
          if (typeof value === 'string') props.children = value
          continue
        }
        // The plugin serializes attribute values as strings (calls .replace on them),
        // so coerce booleans/numbers (e.g. data-rh={true}) to a string.
        props[ATTR_RENAME[key] ?? key] = String(value)
      }
      out.push({ type: el.type, props })
    }
  }
  return new Set(out)
}

export async function prerender(data: PrerenderData) {
  const path = new URL(data.url, 'http://localhost').pathname
  const lang = path.startsWith('/ru') ? 'ru' : 'he'
  await i18n.changeLanguage(lang)

  const helmetContext: { helmet?: any } = {}
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </HelmetProvider>,
  )

  const helmet = helmetContext.helmet
  const titleChildren = helmet?.title?.toComponent?.()?.[0]?.props?.children
  const title = Array.isArray(titleChildren) ? titleChildren.join('') : String(titleChildren ?? '')

  return {
    html,
    head: {
      lang,
      title,
      elements: helmet
        ? toHeadElements(helmet.meta, helmet.link, helmet.script)
        : new Set<HeadElement>(),
    },
  }
}
