import Link from 'next/link'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { listCategories } from '@/lib/admin/catalog'
import { getCurrentUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function CatalogIndex() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const categories = listCategories()

  return (
    <AdminShell
      title="Каталог"
      description="Пять категорий и семнадцать моделей. Структура повторяет сайт: выберите категорию, внутри — её модели."
      userEmail={user.email}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map(category => (
          <Link
            key={category.slug}
            href={`/admin/catalog/${category.slug}`}
            className="group flex gap-4 overflow-hidden rounded-xl border border-[#23263A] bg-[#13161F] p-3 transition-colors hover:border-[#C4983A]"
          >
            <img
              src={category.mainImage}
              alt=""
              className="h-20 w-24 shrink-0 rounded-lg object-cover"
              loading="lazy"
            />
            <div className="min-w-0 py-1">
              <p className="truncate font-semibold text-[#E4E0D8] group-hover:text-[#C4983A]">
                {category.name.ru}
              </p>
              <p className="mt-0.5 truncate text-sm text-[#8C90A8]" dir="rtl">
                {category.name.he}
              </p>
              <p className="mt-2 text-xs text-[#585C78]">
                {category.modelCount} {plural(category.modelCount)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </AdminShell>
  )
}

function plural(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'модель'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'модели'
  return 'моделей'
}
