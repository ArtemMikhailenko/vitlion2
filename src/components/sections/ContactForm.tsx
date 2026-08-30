'use client'

import { useState, type FormEvent } from 'react'
import { trackLead } from '@/lib/analytics'
import { useCatalog } from '@/lib/catalog/client'
import { useTranslation } from '@/lib/i18n/client'

/**
 * The enquiry form in the contact block.
 *
 * Until now the only way to leave a request was the floating calculator, which
 * exists on the home page alone — a visitor who arrived on a model page from
 * search had a phone number and nothing else. The translations for this form
 * had been sitting in both dictionaries since the original design; only the
 * form itself was missing.
 *
 * It is also the site's one server-rendered form, which is what makes the
 * WebMCP declarative attributes below worth anything: a scanner reading the raw
 * HTML can see the tool without executing a line of JavaScript.
 */
export default function ContactForm() {
  const { t, i18n } = useTranslation()
  const catalog = useCatalog()
  const lang = i18n.resolvedLanguage === 'ru' ? 'ru' : 'he'

  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [failed, setFailed] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    const form = new FormData(event.currentTarget)
    setSending(true)
    setFailed(false)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          phone: form.get('phone'),
          service: form.get('service'),
          area: form.get('city'),
          company: form.get('company'),
          lang,
          page: window.location.pathname,
        }),
      })
      if (!response.ok) throw new Error(String(response.status))

      // Reported here rather than on a thank-you page: there is no such page,
      // and this fires only once the lead is actually stored.
      const { id } = (await response.json().catch(() => ({}))) as { id?: number }
      trackLead(id)

      setDone(true)
    } catch (error) {
      console.error('[contact] submit failed', error)
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  const field =
    'w-full rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-mid outline-none transition-colors focus:border-gold/60'
  const fieldStyle = { backgroundColor: '#0C0E14', border: '1px solid #23263A' }

  if (done) {
    return (
      <div
        className="rounded-2xl border p-8 text-center"
        style={{ backgroundColor: '#13161F', borderColor: '#2A4A32' }}
      >
        <p className="text-base font-semibold text-[#9BE5B4]">{t('contact.form.success')}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border p-6 sm:p-8"
      style={{ backgroundColor: '#13161F', borderColor: '#23263A' }}
      /*
       * WebMCP declarative API — the attributes the browser compiles into a tool
       * definition for an agent, per the W3C explainer.
       *
       * `toolautosubmit` is deliberately absent. It tells the agent to submit on
       * the visitor's behalf, and this form creates an enquiry carrying a real
       * person's name and phone number. The agent may fill the fields; the
       * person presses the button.
       */
      toolname="request-quote"
      tooldescription={
        lang === 'ru'
          ? 'Оставить заявку на бесплатный замер и расчёт стоимости пергол, остекления или ZIP-штор от Vitlion Group. Цены не публикуются и рассчитываются после замера.'
          : 'השארת פנייה למדידה חינם והצעת מחיר לפרגולות, זיגוג או תריסי ZIP מבית Vitlion Group. המחירים אינם מפורסמים ונקבעים לאחר המדידה.'
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold">
            {t('contact.form.name')}
          </span>
          <input
            type="text"
            name="name"
            required
            placeholder={t('contact.form.namePlaceholder') as string}
            className={field}
            style={fieldStyle}
            toolparamdescription={
              lang === 'ru' ? 'Имя человека, оставляющего заявку' : 'שם הפונה'
            }
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold">
            {t('contact.form.phone')}
          </span>
          <input
            type="tel"
            name="phone"
            required
            dir="ltr"
            placeholder={t('contact.form.phonePlaceholder') as string}
            className={field}
            style={fieldStyle}
            toolparamdescription={
              lang === 'ru'
                ? 'Телефон для связи, в израильском или международном формате'
                : 'טלפון ליצירת קשר, בפורמט ישראלי או בינלאומי'
            }
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold">
            {t('contact.form.city')}
          </span>
          <input
            type="text"
            name="city"
            placeholder={t('contact.form.cityPlaceholder') as string}
            className={field}
            style={fieldStyle}
            toolparamdescription={
              lang === 'ru'
                ? 'Город или населённый пункт, где планируется монтаж'
                : 'העיר או היישוב שבו מתוכננת ההתקנה'
            }
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold">
            {t('contact.form.service')}
          </span>
          <select
            name="service"
            defaultValue=""
            className={field}
            style={fieldStyle}
            toolparamdescription={
              lang === 'ru'
                ? 'Категория конструкции из каталога'
                : 'קטגוריית המבנה מתוך הקטלוג'
            }
          >
            <option value="">{t('contact.form.servicePlaceholder') as string}</option>
            {catalog.map(category => (
              <option key={category.slug} value={category.name[lang]}>
                {category.name[lang]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
      />

      {failed && (
        <p
          className="mt-4 rounded-lg px-3 py-2 text-xs leading-relaxed"
          style={{ background: 'rgba(120,40,40,0.35)', color: '#FFB4B4' }}
        >
          {t('contact.form.error')}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-5 w-full rounded-xl bg-gold px-8 py-4 text-base font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
        style={{ color: '#1A1D24', boxShadow: '0 4px 20px rgba(196,152,58,0.3)' }}
      >
        {sending ? t('contact.form.sending') : t('contact.form.submit')}
      </button>
    </form>
  )
}
