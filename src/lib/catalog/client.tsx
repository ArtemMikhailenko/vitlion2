'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { CATEGORIES } from '@/data/services'
import type { ServiceCategory } from '@/types'

const CatalogContext = createContext<ServiceCategory[]>(CATEGORIES)

/**
 * Makes the resolved catalogue reachable from client components.
 *
 * The menu, the footer and the cards on the home page all read the bundled
 * constant directly, so a category renamed or hidden in the panel changed
 * nothing for a visitor. Same shape as the contact provider: resolved once per
 * request on the server, read everywhere below.
 *
 * The default is the bundled catalogue, so a component rendered outside the
 * provider still lists real categories rather than nothing.
 */
export function CatalogProvider({
  value,
  children,
}: {
  value: ServiceCategory[]
  children: ReactNode
}) {
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog(): ServiceCategory[] {
  return useContext(CatalogContext)
}
