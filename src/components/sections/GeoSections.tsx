import { getGeoContent } from '@/data/geoContent'
import type { Lang } from '@/lib/i18n'

/**
 * The blocks introduced by the SEO/GEO brief: service area, lead times, cost
 * drivers and the FAQ.
 *
 * Deliberately a Server Component with no interactivity — the answers render as
 * plain, always-visible HTML. Nothing is collapsed behind JavaScript, so both
 * classic crawlers and AI bots (which mostly do not execute JS) read the full
 * text, which is the entire point of the exercise.
 */
export default function GeoSections({ lang }: { lang: Lang }) {
  const { serviceArea, timeline, costFactors, faq } = getGeoContent(lang)

  return (
    <>
      {/* ── Service area ─────────────────────────────────────────────── */}
      <section id="service-area" className="py-16 lg:py-20 bg-dark-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">{serviceArea.heading}</h2>
          <p className="text-ink-mid mb-6">{serviceArea.intro}</p>

          <div className="grid gap-4 sm:grid-cols-3">
            {serviceArea.regions.map(region => (
              <div
                key={region.name}
                className="rounded-2xl border border-dark-border bg-dark-card px-5 py-4"
              >
                <h3 className="text-gold font-semibold mb-2">{region.name}</h3>
                <ul className="space-y-1">
                  {region.cities.map(city => (
                    <li key={city} className="text-ink-mid text-sm">
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-ink-mid mt-6 leading-relaxed">{serviceArea.note}</p>
        </div>
      </section>

      {/* ── Lead times ───────────────────────────────────────────────── */}
      <section id="timeline" className="py-16 lg:py-20 bg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">{timeline.heading}</h2>
          {timeline.body.map((paragraph, i) => (
            <p key={i} className="text-ink-mid leading-relaxed mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* ── Cost drivers ─────────────────────────────────────────────── */}
      <section id="cost" className="py-16 lg:py-20 bg-dark-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">{costFactors.heading}</h2>
          {costFactors.body.map((paragraph, i) => (
            <p key={i} className="text-ink-mid leading-relaxed mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 lg:py-20 bg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-8">{faq.heading}</h2>

          <div className="space-y-5">
            {faq.items.map(item => (
              <article
                key={item.question}
                className="rounded-2xl border border-dark-border bg-dark-card px-5 py-5 sm:px-6"
              >
                <h3 className="text-ink font-semibold text-lg mb-2 leading-snug">{item.question}</h3>
                <p className="text-ink-mid leading-relaxed">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
