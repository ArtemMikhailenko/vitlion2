'use client'

import { useActionState } from 'react'
import { Card, Notice, inputClass } from '@/components/admin/fields'
import { createUser, deleteUser, type AdminAccount, type UsersState } from './users-actions'

export default function UsersPanel({
  users,
  currentId,
  canEdit,
}: {
  users: AdminAccount[]
  currentId: number
  canEdit: boolean
}) {
  const [createState, createAction] = useActionState<UsersState, FormData>(createUser, {})
  const [deleteState, deleteAction] = useActionState<UsersState, FormData>(deleteUser, {})

  return (
    <Card
      title="Доступ к панели"
      hint="Заведите отдельную запись для подрядчика — сеошника, копирайтера — вместо того чтобы отдавать свой пароль."
    >
      {createState.error && <Notice kind="error">{createState.error}</Notice>}
      {deleteState.error && <Notice kind="error">{deleteState.error}</Notice>}

      {createState.created && (
        <div className="mb-5 rounded-lg border border-[#2A4A32] bg-[#16301E] px-4 py-3 text-sm">
          <p className="mb-2 font-semibold text-[#9BE5B4]">Учётная запись создана</p>
          <p className="text-[#9BE5B4]">
            Логин: <code className="text-white">{createState.created.email}</code>
            <br />
            Пароль: <code className="text-white">{createState.created.password}</code>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#7FB894]">
            Запишите сейчас — пароль больше нигде не показывается. Передайте его владельцу и
            попросите сменить на этой же странице.
          </p>
        </div>
      )}

      <div className="mb-5 space-y-2">
        {users.map(user => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-[#23263A] bg-[#0F1118] px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-[#E4E0D8]">
                {user.email}
                {user.id === currentId && (
                  <span className="ms-2 text-[11px] text-[#585C78]">это вы</span>
                )}
              </p>
              {user.name && <p className="truncate text-xs text-[#585C78]">{user.name}</p>}
            </div>

            {user.id !== currentId && users.length > 1 && (
              <form action={deleteAction} className="shrink-0">
                <input type="hidden" name="id" value={user.id} />
                <button
                  type="submit"
                  disabled={!canEdit}
                  className="rounded-lg border border-[#23263A] px-3 py-1.5 text-xs text-[#8C90A8] transition-colors hover:border-[#5A2A2A] hover:text-[#E5A0A0] disabled:opacity-40"
                >
                  Удалить
                </button>
              </form>
            )}
          </div>
        ))}

        {users.length === 0 && (
          <p className="rounded-lg border border-dashed border-[#23263A] px-3 py-6 text-center text-sm text-[#585C78]">
            Записей в базе нет — вы вошли под резервной учётной записью из переменных окружения.
          </p>
        )}
      </div>

      <form action={createAction} className="space-y-3 border-t border-[#1C1F2C] pt-4">
        <p className="text-xs text-[#8C90A8]">Добавить пользователя</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="email" type="email" placeholder="Почта" dir="ltr" className={inputClass} />
          <input name="name" placeholder="Имя (необязательно)" className={inputClass} />
        </div>
        <button
          type="submit"
          disabled={!canEdit}
          className="rounded-lg border border-[#23263A] px-4 py-2 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8] disabled:opacity-40"
        >
          Создать и показать пароль
        </button>
      </form>
    </Card>
  )
}
