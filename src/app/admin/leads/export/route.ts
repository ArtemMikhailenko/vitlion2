import { desc } from 'drizzle-orm'
import { getDb, schema } from '@/db'
import { statusOf } from '@/lib/admin/leadStatus'
import { getCurrentUser } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Excel opens a comma file as one column unless told the separator. */
const HEADER = 'sep=,\n'

const COLUMNS = [
  'Дата',
  'Имя',
  'Телефон',
  'Статус',
  'Услуга',
  'Форма участка',
  'Площадь',
  'Язык',
  'Страница',
  'Заметка',
]

/**
 * A field is quoted and its quotes doubled — the note is free text and will
 * eventually contain a comma or a line break.
 */
function cell(value: unknown): string {
  const text = value == null ? '' : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

export async function GET() {
  if (!(await getCurrentUser())) {
    return new Response('Требуется вход', { status: 401 })
  }

  const db = getDb()
  if (!db) return new Response('База данных не подключена', { status: 503 })

  const rows = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt))

  const body =
    HEADER +
    [
      COLUMNS.map(cell).join(','),
      ...rows.map(row =>
        [
          row.createdAt.toISOString().slice(0, 16).replace('T', ' '),
          row.name,
          row.phone,
          statusOf(row.status).label,
          row.service,
          row.shape,
          row.area,
          row.lang === 'ru' ? 'русский' : 'иврит',
          row.page,
          row.note,
        ]
          .map(cell)
          .join(','),
      ),
    ].join('\n')

  return new Response(`﻿${body}`, {
    headers: {
      // The BOM above is what makes Excel read the Cyrillic and Hebrew as UTF-8
      // instead of mojibake.
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="vitlion-leads.csv"',
    },
  })
}
