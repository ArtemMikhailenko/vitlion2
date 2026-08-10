import { CATEGORIES } from '@/data/services'
import type { ServiceCategory, ServiceItem } from '@/types'

/**
 * Catalog lookups shared by the category and model routes.
 *
 * Until now the 17 models existed only inside a modal on the category page,
 * so they had no URL and were invisible to crawlers — the richest content on
 * the site (descriptions, six features each, galleries) never reached search
 * or AI engines. These helpers back the per-model routes that fix that.
 */

export interface CatalogEntry {
  category: ServiceCategory
  service: ServiceItem
}

export function findCategory(slug: string): ServiceCategory | undefined {
  return CATEGORIES.find(c => c.slug === slug)
}

export function findService(categorySlug: string, serviceSlug: string): CatalogEntry | undefined {
  const category = findCategory(categorySlug)
  const service = category?.services.find(s => s.slug === serviceSlug)
  return category && service ? { category, service } : undefined
}

/** Every (category, service) pair — drives generateStaticParams. */
export function allServiceParams(): { category: string; service: string }[] {
  return CATEGORIES.flatMap(category =>
    category.services.map(service => ({ category: category.slug, service: service.slug })),
  )
}

/** Sibling models within the same category, for internal linking. */
export function siblingServices(categorySlug: string, serviceSlug: string): ServiceItem[] {
  return findCategory(categorySlug)?.services.filter(s => s.slug !== serviceSlug) ?? []
}
