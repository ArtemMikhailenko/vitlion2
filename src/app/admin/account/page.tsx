import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { getCurrentUser } from '@/lib/session'
import PasswordForm from './PasswordForm'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  return (
    <AdminShell
      title="Учётная запись"
      description={`Вы вошли как ${user.email}.`}
      userEmail={user.email}
    >
      <PasswordForm />
    </AdminShell>
  )
}
