import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

/**
 * Cloudinary holds uploaded images.
 *
 * They cannot live in the repository: the Hostinger deploy replaces the working
 * tree, so anything written into public/ is lost on the next deploy. Cloudinary
 * also does the work the build pipeline already does for the bundled images —
 * WebP conversion and sizing — so uploads match what the site already serves
 * without a conversion step in the app.
 */

export const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  )

function configured() {
  if (!isCloudinaryConfigured()) return null
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
  return cloudinary
}

export interface UploadedImage {
  url: string
  publicId: string
  width: number
  height: number
  bytes: number
}

export async function uploadImage(file: File): Promise<UploadedImage> {
  const client = configured()
  if (!client) throw new Error('Cloudinary не настроен.')

  const buffer = Buffer.from(await file.arrayBuffer())

  const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
    client.uploader
      .upload_stream(
        {
          folder: 'vitlion',
          resource_type: 'image',
          // Cap the stored original so an unedited phone photo cannot become a
          // 12MP asset; delivery still happens through f_auto/q_auto below.
          transformation: [{ width: 2000, height: 2000, crop: 'limit' }],
        },
        (error, uploaded) => {
          if (error || !uploaded) reject(error ?? new Error('Загрузка не удалась.'))
          else resolve(uploaded as unknown as Record<string, unknown>)
        },
      )
      .end(buffer)
  })

  const publicId = String(result.public_id)

  return {
    // f_auto/q_auto make Cloudinary serve WebP or AVIF to browsers that take
    // them, which is the same trade the bundled images already make.
    url: String(result.secure_url).replace('/upload/', '/upload/f_auto,q_auto/'),
    publicId,
    width: Number(result.width ?? 0),
    height: Number(result.height ?? 0),
    bytes: Number(result.bytes ?? 0),
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  const client = configured()
  if (!client) throw new Error('Cloudinary не настроен.')
  await client.uploader.destroy(publicId)
}
