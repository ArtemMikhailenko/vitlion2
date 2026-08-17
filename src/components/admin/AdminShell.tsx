import Link from 'next/link'
import type { ReactNode } from 'react'
import { buildSearchIndex } from '@/lib/admin/searchIndex'
import { getAdminStats } from '@/lib/admin/stats'
import AdminNav from './AdminNav'

export interface Crumb {
  label: string
  href?: string
}

/**
 * Frame around every admin screen.
 *
 * A server component so the enquiry badge is accurate on every page without
 * each page having to fetch and pass the count; the interactive parts of the
 * sidebar live in AdminNav.
 */
export default async function AdminShell({
  children,
  title,
  description,
  actions,
  userEmail,
  crumbs,
  wide,
}: {
  children: ReactNode
  title: string
  description?: string
  actions?: ReactNode
  userEmail?: string
  crumbs?: Crumb[]
  /** Skips the reading-width cap — for screens that lay out their own columns. */
  wide?: boolean
}) {
  const { pendingLeads } = await getAdminStats()

  return (
    <div className="flex min-h-screen">
      <AdminNav
        pendingLeads={pendingLeads}
        userEmail={userEmail}
        searchEntries={buildSearchIndex()}
      />

      {/* pt-14 clears the fixed mobile bar; on lg the sidebar is in flow. */}
      <main className="min-w-0 flex-1 pt-14 lg:pt-0">
        <header className="border-b border-[#1C1F2C] px-5 py-6 sm:px-8">
          <div className={wide ? '' : 'mx-auto max-w-5xl'}>
            {crumbs && crumbs.length > 0 && (
              <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-[#585C78]">
                {crumbs.map((crumb, i) => (
                  <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-[#2E3244]">/</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="transition-colors hover:text-[#8C90A8]">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-white sm:text-2xl">{title}</h1>
                {description && (
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#8C90A8]">
                    {description}
                  </p>
                )}
              </div>
              {actions}
            </div>
          </div>
        </header>

        <div className="px-5 py-6 pb-24 sm:px-8 lg:pb-6">
          <div className={wide ? '' : 'mx-auto max-w-5xl'}>{children}</div>
        </div>
      </main>
    </div>
  )
}
