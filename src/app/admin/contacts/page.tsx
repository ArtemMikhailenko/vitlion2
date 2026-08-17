import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { Notice } from '@/components/admin/fields'
import { isDbConfigured } from '@/db'
import { getContactInfo } from '@/lib/content/contact'
import { getCurrentUser } from '@/lib/session'
import ContactsEditor from './ContactsEditor'

export const dynamic = 'force-dynamic'

export default async function ContactsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const values = await getContactInfo()

  return (
    <AdminShell
      title="Контакты"
      description="Телефон, почта, адреса и соцсети. Меняются в одном месте и обновляются везде: шапка, подвал, кнопка WhatsApp и разметка для Google."
      userEmail={user.email}
      crumbs={[{ label: 'Обзор', href: '/admin' }, { label: 'Контакты' }]}
    >
      {!isDbConfigured() && (
        <Notice kind="warn">
          <p className="mb-1 font-semibold text-[#E8C568]">Режим только для чтения</p>
          <p>
            Ниже — контакты, которые сейчас на сайте. Чтобы их менять, задайте{' '}
            <code className="text-[#E8C568]">DATABASE_URL</code>.
          </p>
        </Notice>
      )}

      <ContactsEditor values={values} canSave={isDbConfigured()} />
    </AdminShell>
  )
}
