import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { Notice } from '@/components/admin/fields'
import { isDbConfigured } from '@/db'
import { getFaq } from '@/lib/content'
import { getCurrentUser } from '@/lib/session'
import FaqEditor from './FaqEditor'
import type { FaqPair } from './actions'

export const dynamic = 'force-dynamic'

export default async function FaqPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const [he, ru] = await Promise.all([getFaq('he'), getFaq('ru')])

  // Paired by position: the two languages are always saved together, so index
  // alignment holds. Length is taken from the longer list so nothing is hidden
  // if they ever do diverge.
  const pairs: FaqPair[] = Array.from({ length: Math.max(he.length, ru.length) }, (_, i) => ({
    he: he[i] ?? { question: '', answer: '' },
    ru: ru[i] ?? { question: '', answer: '' },
  }))

  return (
    <AdminShell
      title="Вопросы и ответы"
      description="Блок FAQ на странице услуг. Он же уходит в разметку для поисковиков — это то, что AI-системы цитируют, отвечая на вопросы о перголах."
      userEmail={user.email}
    >
      {!isDbConfigured() && (
        <Notice kind="warn">
          <p className="mb-1 font-semibold text-[#E8C568]">Режим только для чтения</p>
          <p>
            Ниже — вопросы, которые сейчас на сайте. Чтобы их менять, задайте{' '}
            <code className="text-[#E8C568]">DATABASE_URL</code>.
          </p>
        </Notice>
      )}

      <Notice kind="warn">
        Первый вопрос — про разрешение на строительство. По анализу конкурентов на него не отвечает
        ни один из четырёх, поэтому он стоит первым намеренно. Ответ содержит обязательство компании
        — согласуйте формулировку, прежде чем менять.
      </Notice>

      <FaqEditor initial={pairs} canSave={isDbConfigured()} />
    </AdminShell>
  )
}
