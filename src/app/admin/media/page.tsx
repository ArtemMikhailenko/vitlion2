import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { Notice } from '@/components/admin/fields'
import { isDbConfigured } from '@/db'
import { isCloudinaryConfigured } from '@/lib/admin/cloudinary'
import { getCurrentUser } from '@/lib/session'
import MediaManager from './MediaManager'
import { listMedia } from './actions'

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const items = await listMedia()
  const canUpload = isCloudinaryConfigured()

  return (
    <AdminShell
      title="Фотографии"
      description="Общая библиотека изображений. Загрузите фото здесь, скопируйте адрес и вставьте его в нужное поле каталога."
      userEmail={user.email}
      crumbs={[{ label: 'Обзор', href: '/admin' }, { label: 'Фотографии' }]}
    >
      {!canUpload && (
        <Notice kind="warn">
          <p className="mb-1 font-semibold text-[#E8C568]">Загрузка не настроена</p>
          <p>
            Нужны переменные <code className="text-[#E8C568]">CLOUDINARY_CLOUD_NAME</code>,{' '}
            <code className="text-[#E8C568]">CLOUDINARY_API_KEY</code> и{' '}
            <code className="text-[#E8C568]">CLOUDINARY_API_SECRET</code>. Файлы хранятся во внешнем
            сервисе намеренно: всё, что лежит в папке проекта, стирается при следующем деплое.
          </p>
        </Notice>
      )}

      {canUpload && !isDbConfigured() && (
        <Notice kind="warn">
          Загрузка работает, но список файлов хранится в базе. Без{' '}
          <code className="text-[#E8C568]">DATABASE_URL</code> загруженное не попадёт в галерею
          ниже — адрес нужно будет скопировать сразу после загрузки.
        </Notice>
      )}

      <MediaManager
        items={items.map(i => ({
          id: i.id,
          path: i.path,
          originalName: i.originalName,
          width: i.width,
          height: i.height,
          bytes: i.bytes,
        }))}
        canUpload={canUpload}
      />
    </AdminShell>
  )
}
