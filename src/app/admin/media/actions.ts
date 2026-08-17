'use server'

import { revalidatePath } from 'next/cache'
import { desc, eq } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { getCurrentUser } from '@/lib/session'
import { deleteImage, isCloudinaryConfigured, uploadImage } from '@/lib/admin/cloudinary'

export interface MediaState {
  error?: string
  ok?: string
}

const MAX_BYTES = 12 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export async function uploadMedia(_prev: MediaState, formData: FormData): Promise<MediaState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }
  if (!isCloudinaryConfigured()) return { error: 'Cloudinary не настроен — загружать некуда.' }

  const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
  if (!files.length) return { error: 'Выберите файлы.' }

  const db = getDb()
  let uploaded = 0

  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return { error: `«${file.name}» — неподдерживаемый формат. Нужен JPEG, PNG, WebP или AVIF.` }
    }
    if (file.size > MAX_BYTES) {
      return { error: `«${file.name}» больше 12 МБ.` }
    }

    try {
      const image = await uploadImage(file)
      uploaded += 1

      // The library index lives in the database; without one the upload still
      // succeeds and the URL is shown, it just is not listed later.
      if (db) {
        await db.insert(schema.media).values({
          path: image.url,
          publicId: image.publicId,
          originalName: file.name,
          width: image.width,
          height: image.height,
          bytes: image.bytes,
        })
      }
    } catch (error) {
      console.error('[admin] upload failed', error)
      return { error: `Не удалось загрузить «${file.name}».` }
    }
  }

  revalidatePath('/admin/media')
  return { ok: `Загружено: ${uploaded}.` }
}

export async function removeMedia(_prev: MediaState, formData: FormData): Promise<MediaState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const id = Number(formData.get('id'))
  const db = getDb()
  if (!db || !id) return { error: 'Нечего удалять.' }

  try {
    const [row] = await db.select().from(schema.media).where(eq(schema.media.id, id)).limit(1)
    if (!row) return { error: 'Файл не найден.' }

    if (row.publicId) await deleteImage(row.publicId)
    await db.delete(schema.media).where(eq(schema.media.id, id))
  } catch (error) {
    console.error('[admin] delete failed', error)
    return { error: 'Не удалось удалить.' }
  }

  revalidatePath('/admin/media')
  return { ok: 'Удалено.' }
}

export async function listMedia() {
  const db = getDb()
  if (!db) return []
  try {
    return await db.select().from(schema.media).orderBy(desc(schema.media.createdAt)).limit(200)
  } catch (error) {
    console.error('[admin] media list failed', error)
    return []
  }
}
