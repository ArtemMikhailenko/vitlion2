/**
 * Google Ads conversion tracking.
 *
 * The setup instructions assume a "thank you for your purchase" page that a
 * visitor lands on after converting, and fire the event on its load. This site
 * has no such page: both the contact form and the cost calculator show their
 * success state in place, without navigating. So the event is sent from the
 * code path that knows a lead was actually stored, which is also more accurate
 * — a thank-you page counts a page view, this counts a row in the database.
 */

/** Public identifier; it appears in the page source either way. */
export const GOOGLE_ADS_ID = 'AW-18389159913'

/** Conversion action label, from the Ads account. */
const CONVERSION_LABEL = 'AW-18389159913/CytgCPyfwOkcEOmf0cBE'

type Gtag = (command: string, ...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

/**
 * Reports one enquiry.
 *
 * `transactionId` is the database id of the lead, so a visitor who reloads or
 * submits twice is still counted once — that is exactly what Google asks the
 * parameter to be used for, and an id we already have beats a random one.
 *
 * Silent when the tag has not loaded: an ad blocker, or a visitor who arrived
 * before the script did, must never turn a captured lead into a console error.
 */
export function trackLead(transactionId?: number | string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  try {
    window.gtag('event', 'conversion', {
      send_to: CONVERSION_LABEL,
      transaction_id: transactionId != null ? String(transactionId) : '',
    })
  } catch (error) {
    console.error('[analytics] conversion event failed', error)
  }
}
