import Script from 'next/script'
import { GOOGLE_ADS_ID } from '@/lib/analytics'

/**
 * The Google tag, on every public page.
 *
 * Rendered from the shared root shell, so it covers both language trees and
 * not the admin panel — there is nothing to measure behind a login, and the
 * panel is marked noindex anyway.
 *
 * `afterInteractive` rather than the `async` script from the setup
 * instructions: gtag.js is about 100 kB and none of it is needed to paint the
 * page. Loading it after the page is usable keeps the hero and the largest
 * image out of its way.
 */
export default function GoogleAds() {
  return (
    <>
      <Script
        id="google-tag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <Script id="google-tag-config" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
      </Script>
    </>
  )
}
