import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { isDbConfigured } from '@/db'
import { logout } from './actions'

export const dynamic = 'force-dynamic'

const SECTIONS = [
  { href: '/admin/leads', title: 'Заявки', body: 'Обращения из калькулятора стоимости.' },
  { href: '/admin/texts', title: 'Тексты сайта', body: 'Заголовки, кнопки, подписи — на иврите и русском.' },
  { href: '/admin/pages', title: 'Страницы', body: 'Заголовки, описания и тексты категорий.' },
  { href: '/admin/catalog', title: 'Каталог', body: '5 категорий и 17 моделей: названия, описания, характеристики.' },
  { href: '/admin/faq', title: 'Вопросы и ответы', body: 'Блок FAQ на странице услуг.' },
  { href: '/admin/media', title: 'Фотографии', body: 'Загрузка и замена изображений.' },
]

export default async function AdminHome() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Панель управления</h1>
          <p className="mt-1 text-sm text-[#8C90A8]">{user.email}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
          >
            Выйти
          </button>
        </form>
      </header>

      {!isDbConfigured() && (
        <div className="mb-8 rounded-2xl border border-[#4A3A1A] bg-[#1F1810] p-5 text-sm leading-relaxed">
          <p className="mb-2 font-semibold text-[#E8C568]">База данных не подключена</p>
          <p className="text-[#B8A98A]">
            Сайт сейчас работает на текстах из кода и отображается корректно. Но чтобы правки из
            панели сохранялись, нужно задать <code className="text-[#E8C568]">DATABASE_URL</code>.
            До этого разделы ниже открываются только на чтение.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map(section => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-2xl border border-[#23263A] bg-[#13161F] p-5 transition-colors hover:border-[#C4983A]"
          >
            <p className="font-semibold text-[#E4E0D8] group-hover:text-[#C4983A]">{section.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#8C90A8]">{section.body}</p>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-[#585C78]">
        <Link href="/" className="hover:text-[#8C90A8]">
          ← Открыть сайт
        </Link>
      </p>
    </main>
  )
}
