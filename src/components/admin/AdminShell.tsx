'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const NAV = [
  { href: '/admin', label: 'Обзор', exact: true },
  { href: '/admin/texts', label: 'Тексты сайта' },
  { href: '/admin/pages', label: 'Страницы' },
  { href: '/admin/catalog', label: 'Каталог' },
  { href: '/admin/faq', label: 'Вопросы и ответы' },
  { href: '/admin/media', label: 'Фотографии' },
]

export default function AdminShell({
  children,
  title,
  description,
  actions,
  userEmail,
}: {
  children: ReactNode
  title: string
  description?: string
  actions?: ReactNode
  userEmail?: string
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-e border-[#23263A] bg-[#0F1118] p-5 lg:block">
        <Link href="/admin" className="block">
          <p className="text-lg font-bold tracking-[0.16em] text-white">
            VITLION <span className="text-[#C4983A]">GROUP</span>
          </p>
          <p className="mt-0.5 text-xs text-[#585C78]">панель управления</p>
        </Link>

        <nav className="mt-8 space-y-1">
          {NAV.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-[#C4983A]/12 font-medium text-[#E8C568]'
                    : 'text-[#8C90A8] hover:bg-white/5 hover:text-[#E4E0D8]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 border-t border-[#23263A] pt-4">
          <Link href="/" className="block px-3 py-2 text-sm text-[#585C78] hover:text-[#8C90A8]">
            ← Открыть сайт
          </Link>
          {userEmail && <p className="px-3 pt-2 text-xs text-[#585C78]">{userEmail}</p>}
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="border-b border-[#23263A] px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white sm:text-2xl">{title}</h1>
              {description && (
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#8C90A8]">{description}</p>
              )}
            </div>
            {actions}
          </div>
        </header>

        <div className="px-5 py-6 sm:px-8">{children}</div>
      </main>
    </div>
  )
}
