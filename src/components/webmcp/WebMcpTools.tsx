'use client'

import { useEffect } from 'react'
import { CATEGORIES } from '@/data/services'
import { digits, useContact } from '@/lib/contact/client'
import { getGeoContent } from '@/data/geoContent'
import { localePath, type Lang } from '@/lib/i18n'
import { OFFICES, SITE_URL, WARRANTY_YEARS } from '@/lib/site'

/**
 * Exposes the catalog, service area, FAQ and contact details to in-browser AI
 * agents through WebMCP.
 *
 * Every tool is read-only by design. A "submit a quote request" tool was
 * deliberately left out: it would let an agent send the company a lead on a
 * visitor's behalf without the visitor confirming it. The contact tool returns
 * the WhatsApp and phone links instead, so a human still takes the last step.
 *
 * Registration is feature-detected and deferred to browser idle, so on the
 * ~100% of browsers without WebMCP this component does nothing at all and
 * costs nothing at load.
 */
export default function WebMcpTools({ lang }: { lang: Lang }) {
  const contact = useContact()

  useEffect(() => {
    if (!('modelContext' in navigator) || !navigator.modelContext) return

    const ctx = navigator.modelContext
    const geo = getGeoContent(lang)
    const abs = (path: string) => `${SITE_URL}${path}`

    const models = CATEGORIES.flatMap(category =>
      category.services.map(service => ({
        name: service.name[lang],
        category: category.name[lang],
        categorySlug: category.slug,
        slug: service.slug,
        summary: service.short[lang],
        url: abs(`${localePath(lang, category.slug)}/${service.slug}`),
      })),
    )

    const tools: ModelContextTool[] = [
      {
        name: 'vitlion_find_products',
        description:
          'Search the Vitlion Group catalogue of aluminium structures — pergolas, ZIP shutters, glazing and glass roofs. Returns matching models with a short summary and the page URL for each.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Free-text search over model and category names.' },
            category: {
              type: 'string',
              enum: CATEGORIES.map(c => c.slug),
              description: 'Restrict results to one category.',
            },
          },
        },
        annotations: { readOnlyHint: true },
        execute: async input => {
          const query = String(input.query ?? '').trim().toLowerCase()
          const category = String(input.category ?? '').trim()

          const results = models.filter(m => {
            if (category && m.categorySlug !== category) return false
            if (!query) return true
            return `${m.name} ${m.category} ${m.summary}`.toLowerCase().includes(query)
          })

          return { count: results.length, products: results }
        },
      },

      {
        name: 'vitlion_check_service_area',
        description:
          'Check whether Vitlion Group installs in a given Israeli city, and which region it belongs to. The company works nationwide and sends a surveyor regardless of distance.',
        inputSchema: {
          type: 'object',
          properties: { city: { type: 'string', description: 'City name, in Hebrew or Russian.' } },
          required: ['city'],
        },
        annotations: { readOnlyHint: true },
        execute: async input => {
          const city = String(input.city ?? '').trim().toLowerCase()
          const region = geo.serviceArea.regions.find(r =>
            r.cities.some(c => c.toLowerCase() === city || c.toLowerCase().includes(city)),
          )

          return {
            city: input.city,
            // Absence from the list is not a "no" — the company states it covers
            // the whole country, and the list is only the named examples.
            listedExplicitly: Boolean(region),
            region: region?.name ?? null,
            coversWholeCountry: true,
            note: geo.serviceArea.note,
            regions: geo.serviceArea.regions,
          }
        },
      },

      {
        name: 'vitlion_answer_faq',
        description:
          'Answer common questions about aluminium pergolas from Vitlion Group: whether a building permit is required, wind and rain resistance, bioclimatic versus PVC, the warranty, and maintenance.',
        inputSchema: {
          type: 'object',
          properties: { question: { type: 'string', description: 'The visitor question.' } },
          required: ['question'],
        },
        annotations: { readOnlyHint: true },
        execute: async input => {
          const question = String(input.question ?? '').toLowerCase()
          const words = question.split(/\s+/).filter(w => w.length > 3)

          const scored = geo.faq.items
            .map(item => ({
              item,
              score: words.filter(w => `${item.question} ${item.answer}`.toLowerCase().includes(w)).length,
            }))
            .sort((a, b) => b.score - a.score)

          const best = scored[0]?.score ? scored[0].item : null

          return {
            match: best,
            // Hand back everything so the agent can pick a better one itself.
            allQuestions: geo.faq.items,
            source: abs(`${localePath(lang, 'services')}#faq`),
          }
        },
      },

      {
        name: 'vitlion_get_contact',
        description:
          'Contact details for Vitlion Group: phone, WhatsApp, email, office addresses and the warranty term. Use this to hand a visitor the right way to request a free on-site measurement.',
        annotations: { readOnlyHint: true },
        execute: async () => ({
          phone: contact.phone,
          whatsapp: `https://wa.me/${digits(contact.whatsapp)}`,
          email: contact.email,
          offices: OFFICES.map(o => ({ street: o.street[lang], city: o.locality[lang] })),
          warrantyYears: WARRANTY_YEARS,
          website: abs(localePath(lang)),
          note: 'On-site measurement is free and carries no obligation. A person must make the request themselves.',
        }),
      },
    ]

    const register = () => tools.forEach(tool => ctx.registerTool(tool))

    // requestIdleCallback is typed as always present but is missing on older
    // Safari, so the pairing is captured at schedule time rather than re-tested
    // during cleanup.
    let cancelSchedule: () => void
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(register, { timeout: 3000 })
      cancelSchedule = () => window.cancelIdleCallback(id)
    } else {
      const id = window.setTimeout(register, 1500)
      cancelSchedule = () => window.clearTimeout(id)
    }

    return () => {
      cancelSchedule()
      tools.forEach(tool => ctx.unregisterTool?.(tool.name))
    }
  }, [lang, contact])

  return null
}
