import Script from 'next/script'
import { GOOGLE_ADS_ID, GOOGLE_ANALYTICS_ID } from '@/lib/analytics'

/**
 * The Google tag, on every public page.
 *
 * One loader, two destinations. The Ads account and the Analytics property are
 * separate products but share a single gtag.js: adding a second <script src>
 * would pull the same library again and give the page two independent
 * measurement stacks to keep in step. Google's own instructions say as much —
 * when the tag is already present, only another `config` line is needed.
 *
 * Rendered from the shared root shell, so it covers both language trees and
 * not the admin panel — there is nothing to measure behind a login.
 *
 * `afterInteractive` rather than the `async` script from the setup
 * instructions: gtag.js is about 100 kB and none of it is needed to paint the
 * page. Loading it after the page is usable keeps the hero and the largest
 * image out of its way.
 */
export default function GoogleTag() {
  return (
    <>
      <Script
        id="google-tag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
      />
      <Script id="google-tag-config" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ANALYTICS_ID}');
gtag('config', '${GOOGLE_ADS_ID}');`}
      </Script>
    </>
  )
}
