import 'server-only'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { desc } from 'drizzle-orm'
import { getDb, schema } from '@/db'

export interface PickableImage {
  url: string
  label: string
  source: 'bundled' | 'uploaded'
}

/**
 * Everything the picker can offer.
 *
 * Two sources, deliberately merged: photos uploaded through the panel live in
 * Cloudinary, but the images the site already ships with are files in the
 * repository. Showing only the uploads would mean the operator could not reuse
 * a photo that is already on the site without re-uploading it.
 */
export async function listPickableImages(): Promise<PickableImage[]> {
  const [bundled, uploaded] = await Promise.all([listBundled(), listUploaded()])
  return [...uploaded, ...bundled]
}

async function listUploaded(): Promise<PickableImage[]> {
  const db = getDb()
  if (!db) return []
  try {
    const rows = await db
      .select()
      .from(schema.media)
      .orderBy(desc(schema.media.createdAt))
      .limit(300)
    return rows.map(row => ({
      url: row.path,
      label: row.originalName ?? 'загружено',
      source: 'uploaded' as const,
    }))
  } catch (error) {
    console.error('[admin] uploaded images query failed', error)
    return []
  }
}

/** Walks public/media for the images compiled into the site. */
async function listBundled(): Promise<PickableImage[]> {
  const root = path.join(process.cwd(), 'public', 'media')
  const found: PickableImage[] = []

  async function walk(dir: string) {
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      return // public/media may be absent in some deployments
    }

    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(full)
      } else if (/\.(webp|jpe?g|png)$/i.test(entry.name)) {
        const url = `/media/${path.relative(root, full).split(path.sep).join('/')}`
        found.push({ url, label: entry.name, source: 'bundled' })
      }
    }
  }

  await walk(root)
  return found.sort((a, b) => a.url.localeCompare(b.url))
}
