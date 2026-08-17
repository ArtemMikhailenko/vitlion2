import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { isDbConfigured } from '@/db'
import { ALL_FIELD_KEYS, FIELD_GROUPS } from '@/lib/admin/fields'
import { getTranslations } from '@/lib/content/translations'
import { getCurrentUser } from '@/lib/session'
import TextsEditor from './TextsEditor'

export const dynamic = 'force-dynamic'

export default async function TextsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const values = await getTranslations(ALL_FIELD_KEYS)

  return (
    <AdminShell
      title="Тексты сайта"
      description="Надписи на страницах — на иврите и русском. Правки применяются к сайту сразу после сохранения, пересобирать ничего не нужно."
      userEmail={user.email}
    >
      {!isDbConfigured() && (
        <div className="mb-6 rounded-xl border border-[#4A3A1A] bg-[#1F1810] px-5 py-4 text-sm leading-relaxed">
          <p className="mb-1 font-semibold text-[#E8C568]">Режим только для чтения</p>
          <p className="text-[#B8A98A]">
            Ниже показаны тексты, которые сейчас на сайте. Чтобы их можно было менять, задайте{' '}
            <code className="text-[#E8C568]">DATABASE_URL</code> и пересоберите сайт.
          </p>
        </div>
      )}

      <TextsEditor groups={FIELD_GROUPS} values={values} canSave={isDbConfigured()} />
    </AdminShell>
  )
}
