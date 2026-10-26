import { and, eq } from 'drizzle-orm'
import { getDb, schema } from '@/db'

/**
 * One-off corrections to content already saved in the database.
 *
 * Until the public site read the database, saved rows were invisible, so a
 * stale one cost nothing. Once it did, the ten-year warranty the company does
 * not give came back from rows written while it was still the shipped text:
 * the hero paragraph, saved with the rest of the Texts screen, and the FAQ
 * answer, saved with the rest of the FAQ. The code no longer says it; these
 * rows still did.
 *
 * Each fix touches only the exact wording it was written for, so anything the
 * owner has since rewritten is left alone, and running it twice changes
 * nothing. The hero text is snapshotted into History first, the same way a
 * save from the panel is, so the change can be seen and reverted there.
 */

const AUTHOR = 'автоисправление: гарантия 10 лет'

const HERO_FRAGMENTS = [
  { lang: 'he', remove: ' ומגיעים עם אחריות של 10 שנים' },
  { lang: 'ru', remove: ', с гарантией 10 лет' },
] as const

const FAQ_ANSWERS = [
  {
    lang: 'he',
    from: 'Vitlion Group מספקת אחריות כתובה של 10 שנים על כל מבנה שאנחנו מייצרים ומתקינים, הכוללת כיסוי על תקינות המבנה והמנגנונים החשמליים בשימוש רגיל.',
    to: 'Vitlion Group מספקת אחריות כתובה על כל מבנה שאנחנו מייצרים ומתקינים, הכוללת כיסוי על תקינות המבנה והמנגנונים החשמליים בשימוש רגיל. תקופת האחריות תלויה בסוג המבנה ומפורטת בהסכם.',
  },
  {
    lang: 'ru',
    from: 'Vitlion Group предоставляет письменную гарантию на 10 лет на каждую произведённую и установленную нами конструкцию, включающую покрытие исправности самого сооружения и электрических механизмов при обычном использовании.',
    to: 'Vitlion Group предоставляет письменную гарантию на каждую произведённую и установленную нами конструкцию — она покрывает исправность самого сооружения и электрических механизмов при обычном использовании. Срок гарантии зависит от типа конструкции и указан в договоре.',
  },
] as const

export async function applyContentFixes(): Promise<void> {
  const db = getDb()
  if (!db) return

  try {
    for (const { lang, remove } of HERO_FRAGMENTS) {
      const where = and(eq(schema.translations.key, 'hero.subtitle'), eq(schema.translations.lang, lang))
      const [row] = await db.select().from(schema.translations).where(where)
      if (!row || typeof row.value !== 'string' || !row.value.includes(remove)) continue

      try {
        await db
          .insert(schema.contentHistory)
          .values({ key: 'hero.subtitle', lang, value: row.value, author: AUTHOR })
      } catch (error) {
        // History is a convenience (and its table may not exist yet); the
        // correction itself must still go through.
        console.error('[fixes] history snapshot failed', error)
      }

      await db
        .update(schema.translations)
        .set({ value: row.value.replace(remove, ''), updatedAt: new Date() })
        .where(where)
      console.log(`[fixes] hero.subtitle (${lang}): warranty claim removed`)
    }

    for (const { lang, from, to } of FAQ_ANSWERS) {
      const updated = await db
        .update(schema.faqItems)
        .set({ answer: to, updatedAt: new Date() })
        .where(and(eq(schema.faqItems.lang, lang), eq(schema.faqItems.answer, from)))
        .returning({ id: schema.faqItems.id })
      if (updated.length) console.log(`[fixes] faq (${lang}): warranty answer rewritten`)
    }
  } catch (error) {
    console.error('[fixes] content fixes failed', error)
  }
}
