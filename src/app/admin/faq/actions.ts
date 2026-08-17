'use server'

import { revalidatePath } from 'next/cache'
import { getDb, schema } from '@/db'
import { getCurrentUser } from '@/lib/session'
import { LANGS, localePath } from '@/lib/i18n'

export interface FaqState {
  ok?: boolean
  error?: string
}

export interface FaqPair {
  he: { question: string; answer: string }
  ru: { question: string; answer: string }
}

/**
 * Replaces the whole FAQ in one transaction-shaped operation.
 *
 * The list is short and always edited as a whole, so rewriting it is simpler
 * and less error-prone than diffing rows — and it makes reordering free, since
 * position is just the array index.
 *
 * Questions are stored per language but edited as pairs, so the two languages
 * cannot drift into different question counts or a different order — which is
 * what would break the FAQPage structured data.
 */
export async function saveFaq(_prev: FaqState, formData: FormData): Promise<FaqState> {
  if (!(await getCurrentUser())) return { error: 'Сессия истекла. Войдите заново.' }

  const db = getDb()
  if (!db) return { error: 'База данных не подключена — сохранять некуда.' }

  const count = Number(formData.get('count') ?? 0)
  const pairs: FaqPair[] = []

  for (let i = 0; i < count; i += 1) {
    const pair: FaqPair = {
      he: {
        question: String(formData.get(`q::he::${i}`) ?? '').trim(),
        answer: String(formData.get(`a::he::${i}`) ?? '').trim(),
      },
      ru: {
        question: String(formData.get(`q::ru::${i}`) ?? '').trim(),
        answer: String(formData.get(`a::ru::${i}`) ?? '').trim(),
      },
    }
    // An entry needs both languages to be usable — a half-filled one would
    // render an empty question on one version of the site.
    if (!pair.he.question && !pair.ru.question) continue
    if (!pair.he.question || !pair.ru.question || !pair.he.answer || !pair.ru.answer) {
      return { error: `Вопрос ${i + 1}: заполните и иврит, и русский — вопрос и ответ.` }
    }
    pairs.push(pair)
  }

  if (!pairs.length) return { error: 'Добавьте хотя бы один вопрос.' }

  try {
    await db.delete(schema.faqItems)
    await db.insert(schema.faqItems).values(
      pairs.flatMap((pair, index) =>
        LANGS.map(lang => ({
          lang,
          position: index,
          question: pair[lang].question,
          answer: pair[lang].answer,
          published: true,
        })),
      ),
    )
  } catch (error) {
    console.error('[admin] saveFaq failed', error)
    return { error: 'Не удалось сохранить. Проверьте подключение к базе.' }
  }

  // The FAQ renders on /services and is mirrored into its FAQPage markup.
  for (const lang of LANGS) revalidatePath(localePath(lang, 'services'))

  return { ok: true }
}
