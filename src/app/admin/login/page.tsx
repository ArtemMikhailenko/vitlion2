import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { isAuthConfigured } from '@/lib/auth'
import LoginForm from './LoginForm'

// Reads a cookie, so it can never be prerendered.
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  if (await getCurrentUser()) redirect('/admin')

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold tracking-[0.18em] text-white">
            VITLION <span className="text-[#C4983A]">GROUP</span>
          </p>
          <p className="mt-2 text-sm text-[#8C90A8]">Панель управления сайтом</p>
        </div>

        {isAuthConfigured() ? (
          <LoginForm />
        ) : (
          <div className="rounded-2xl border border-[#23263A] bg-[#13161F] p-6 text-sm leading-relaxed text-[#8C90A8]">
            <p className="mb-3 font-semibold text-[#E4E0D8]">Вход не настроен</p>
            <p>
              На сервере не задана переменная <code className="text-[#C4983A]">AUTH_SECRET</code>{' '}
              (нужно не менее 32 символов). Добавьте её в переменные окружения и пересоберите сайт.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
