'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NAV_GROUPS } from '@/lib/admin/nav'
import type { SearchEntry } from '@/lib/admin/searchIndex'
import AdminSearch from './AdminSearch'
import { Icon } from './icons'

/**
 * The sidebar, and on a narrow screen the slide-over behind the ☰ button.
 *
 * The previous version was `hidden lg:block`, which meant a phone had no
 * navigation at all — you could reach a screen but never leave it. The owner
 * checking enquiries between site visits is exactly the person on a phone.
 */
export default function AdminNav({
  pendingLeads,
  userEmail,
  searchEntries,
}: {
  pendingLeads: number
  userEmail?: string
  searchEntries: SearchEntry[]
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Any navigation closes the slide-over; without this it stays over the page
  // the operator just asked for.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      {/* A top bar rather than a floating button: the save bar owns the bottom
          of the screen on every editing page. */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center gap-3 border-b border-[#1C1F2C] bg-[#0A0C12]/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Меню"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#23263A] text-[#E4E0D8]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
          {pendingLeads > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C4983A] px-1 text-[10px] font-bold text-[#0C0E14]">
              {pendingLeads}
            </span>
          )}
        </button>
        <p className="text-sm font-bold tracking-[0.16em] text-white">
          VITLION <span className="text-[#C4983A]">GROUP</span>
        </p>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[17rem] shrink-0 overflow-y-auto border-e border-[#1C1F2C] bg-[#0A0C12] transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5">
          <Link href="/admin" className="block">
            <p className="text-base font-bold tracking-[0.18em] text-white">
              VITLION <span className="text-[#C4983A]">GROUP</span>
            </p>
            <p className="mt-0.5 text-[11px] text-[#585C78]">панель управления сайтом</p>
          </Link>

          <div className="mt-5">
            <AdminSearch entries={searchEntries} />
          </div>

          <nav className="mt-6 space-y-6">
            {NAV_GROUPS.map(group => (
              <div key={group.title}>
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#42465C]">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const active = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                    const badge = item.badge === 'leads' ? pendingLeads : 0

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-start gap-2.5 rounded-lg px-3 py-2 transition-colors ${
                          active
                            ? 'bg-[#C4983A]/10 text-[#E8C568]'
                            : 'text-[#8C90A8] hover:bg-white/[0.04] hover:text-[#E4E0D8]'
                        }`}
                      >
                        <Icon
                          name={item.icon}
                          className={`mt-0.5 h-4 w-4 shrink-0 ${active ? 'text-[#C4983A]' : 'text-[#585C78] group-hover:text-[#8C90A8]'}`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className={`text-sm ${active ? 'font-semibold' : ''}`}>
                              {item.label}
                            </span>
                            {badge > 0 && (
                              <span className="rounded-full bg-[#C4983A] px-1.5 text-[10px] font-bold leading-4 text-[#0C0E14]">
                                {badge}
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-[#4A4E66]">
                            {item.hint}
                          </span>
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-8 border-t border-[#1C1F2C] pt-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#585C78] transition-colors hover:bg-white/[0.04] hover:text-[#8C90A8]"
            >
              Открыть сайт ↗
            </a>
            {userEmail && (
              <p className="truncate px-3 pt-2 text-[11px] text-[#42465C]">{userEmail}</p>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
