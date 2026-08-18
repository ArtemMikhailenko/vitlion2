import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { isDbConfigured } from '@/db'
import { getCurrentUser } from '@/lib/session'
import PasswordForm from './PasswordForm'
import UsersPanel from './UsersPanel'
import { listUsers } from './users-actions'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const users = await listUsers()

  return (
    <AdminShell
      title="Учётная запись"
      description={`Вы вошли как ${user.email}.`}
      userEmail={user.email}
      crumbs={[{ label: 'Обзор', href: '/admin' }, { label: 'Учётная запись' }]}
    >
      <div className="max-w-2xl space-y-5">
        <UsersPanel users={users} currentId={user.id} canEdit={isDbConfigured()} />
        <PasswordForm />
      </div>
    </AdminShell>
  )
}
