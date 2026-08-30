'use client'

import type { JSX } from 'react'
import { useState } from 'react'
import { trackLead } from '@/lib/analytics'
import { useTranslation } from '@/lib/i18n/client'
import { X, ChevronLeft, Calculator } from 'lucide-react'

type QuizData = {
  shape: string
  area: string
  service: string
  name: string
  phone: string
}

// Solid tone used for the "closed" (building-wall) side faces of each isometric floor plan icon.
const WALL_FILL = '#2B2F3F'

// Mini isometric floor-plan illustrations: gold = open/glazed side, dark = wall/building side.
const SHAPE_ICONS: Record<string, { viewBox: string; node: JSX.Element }> = {
  straight: {
    viewBox: '-9 -2 32 24',
    node: (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))' }}>
        <polygon points="21,12 14,16 14,20 21,16" fill={WALL_FILL} />
        <polygon points="14,16 -7,4 -7,8 14,20" fill="currentColor" fillOpacity="0.85" />
        <polygon points="0,0 21,12 14,16 -7,4" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      </g>
    ),
  },
  corner: {
    viewBox: '-9 -2 25 24',
    node: (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))' }}>
        <polygon points="14,8 0,16 0,20 14,12" fill={WALL_FILL} />
        <polygon points="-7,4 0,8 0,12 -7,8" fill="currentColor" fillOpacity="0.85" />
        <polygon points="-7,12 0,16 0,20 -7,16" fill="currentColor" fillOpacity="0.85" />
        <polygon points="0,0 14,8 0,16 -7,12 0,8 -7,4" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      </g>
    ),
  },
  'u-shape': {
    viewBox: '-16 -2 39 28',
    node: (
      <g style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))' }}>
        <polygon points="7,4 0,8 0,12 7,8" fill={WALL_FILL} />
        <polygon points="21,12 7,20 7,24 21,16" fill={WALL_FILL} />
        <polygon points="-14,8 7,20 7,24 -14,12" fill="currentColor" fillOpacity="0.85" />
        <polygon points="0,0 7,4 0,8 7,12 14,8 21,12 7,20 -14,8" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      </g>
    ),
  },
}

const SHAPES = {
  ru: [
    { id: 'straight', label: 'Прямой' },
    { id: 'corner',   label: 'Угловой' },
    { id: 'u-shape',  label: 'П-образный' },
  ],
  he: [
    { id: 'straight', label: 'ישר' },
    { id: 'corner',   label: 'פינתי' },
    { id: 'u-shape',  label: 'פרסה' },
  ],
}

const AREAS = {
  ru: ['до 10 м²', '10–20 м²', '20–40 м²', '40+ м²'],
  he: ['עד 10 מ"ר', '10–20 מ"ר', '20–40 מ"ר', '40+ מ"ר'],
}


const SERVICES_OPTS = {
  ru: ['Пергола', 'Остекление', 'Пергола + остекление'],
  he: ['פרגולה', 'סגירת זכוכית', 'פרגולה + זכוכית'],
}

const TEXT = {
  ru: {
    trigger: 'Проверь стоимость',
    title: 'Проверка стоимости',
    step1: 'Какая форма вашего балкона?',
    step2: 'Какая площадь балкона?',
    step3: 'Что вас интересует?',
    step4: 'Отлично! Оставьте контакт — мы рассчитаем точную стоимость',
    namePh: 'Ваше имя',
    phonePh: 'Номер телефона',
    submit: 'Получить расчёт',
    success: 'Мы свяжемся с вами в ближайшее время!',
    step: 'Шаг',
    of: 'из',
  },
  he: {
    trigger: 'בדוק עלות',
    title: 'בדיקת עלות',
    step1: 'מה צורת המרפסת שלך?',
    step2: 'מה שטח המרפסת?',
    step3: 'מה מעניין אותך?',
    step4: 'מעולה! השאירו פרטים — נחשב עלות מדויקת',
    namePh: 'השם שלך',
    phonePh: 'מספר טלפון',
    submit: 'קבל חישוב',
    success: 'ניצור איתך קשר בהקרוב!',
    step: 'שלב',
    of: 'מתוך',
  },
}

export default function CostQuiz() {
  const { i18n } = useTranslation()
  const lang = (i18n.resolvedLanguage === 'ru' ? 'ru' : 'he') as 'ru' | 'he'
  const t = TEXT[lang]

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  const [data, setData] = useState<QuizData>({ shape: '', area: '', service: '', name: '', phone: '' })

  const close = () => {
    setOpen(false); setStep(1); setSubmitted(false); setFailed(false)
    setData({ shape: '', area: '', service: '', name: '', phone: '' })
  }

  /**
   * Sends the enquiry to the server.
   *
   * This previously logged to the console and showed a thank-you, so every
   * submission since launch was lost. A failure is now surfaced rather than
   * hidden — being thanked for a message nobody received is worse than being
   * asked to call.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return

    setSending(true)
    setFailed(false)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          lang,
          page: window.location.pathname,
          company: '', // honeypot — stays empty for a real person
        }),
      })
      if (!response.ok) throw new Error(String(response.status))

      // Same conversion as the contact form, keyed by the stored lead's id.
      const { id } = (await response.json().catch(() => ({}))) as { id?: number }
      trackLead(id)

      setSubmitted(true)
    } catch (error) {
      console.error('[quiz] submit failed', error)
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[4.5rem] end-4 z-[79] flex items-center gap-2 rounded-full sm:px-3.5 sm:py-2 text-[12px] font-bold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 w-10 h-10 sm:w-auto sm:h-auto justify-center"
        style={{ background: 'linear-gradient(135deg, #C4983A, #E8C568)', color: '#1C1F26', boxShadow: '0 4px 20px rgba(196,152,58,0.4)' }}
        aria-label={t.trigger}
      >
        <Calculator className="h-5 w-5 sm:h-4 sm:w-4 shrink-0" strokeWidth={2} />
        <span className="hidden sm:inline">{t.trigger}</span>
      </button>

      {!open ? null : (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={close} />

          <div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl"
            style={{ backgroundColor: '#13161F', border: '1px solid #23263A', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
          >
            {/* Progress bar */}
            <div className="h-1 w-full" style={{ backgroundColor: '#23263A' }}>
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%`, background: 'linear-gradient(90deg, #C4983A, #E8C568)' }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #23263A' }}>
              <div className="flex items-center gap-3">
                {step > 1 && !submitted && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-mid hover:text-ink transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <ChevronLeft className="h-4 w-4 rtl:rotate-180" strokeWidth={2.5} />
                  </button>
                )}
                <span className="text-sm font-semibold text-ink">{t.title}</span>
                <span className="text-xs text-ink-mid">{t.step} {step} {t.of} 4</span>
              </div>
              <button onClick={close} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-mid hover:text-ink transition-colors hover:rotate-90 duration-200" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <X className="h-4 w-4" strokeWidth={2.25} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(196,152,58,0.15)', border: '2px solid #C4983A' }}>
                    <svg className="h-7 w-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-lg font-bold text-ink">{t.success}</p>
                </div>
              ) : step === 1 ? (
                <>
                  <p className="mb-5 text-base font-semibold text-ink">{t.step1}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {SHAPES[lang].map(shape => (
                      <button
                        key={shape.id}
                        onClick={() => { setData(d => ({ ...d, shape: shape.id })); setStep(2) }}
                        className="flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                        style={{ backgroundColor: '#0C0E14', border: '1px solid #23263A', color: '#C4983A' }}
                      >
                        <svg viewBox={SHAPE_ICONS[shape.id].viewBox} className="h-11 w-11">{SHAPE_ICONS[shape.id].node}</svg>
                        <span className="text-[12px] font-semibold text-ink">{shape.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-ink-mid">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#C4983A' }} />
                      {lang === 'ru' ? 'открытая сторона' : 'צד פתוח'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: WALL_FILL }} />
                      {lang === 'ru' ? 'стена здания' : 'קיר הבניין'}
                    </span>
                  </div>
                </>
              ) : step === 2 ? (
                <>
                  <p className="mb-5 text-base font-semibold text-ink">{t.step2}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {AREAS[lang].map(area => (
                      <button
                        key={area}
                        onClick={() => { setData(d => ({ ...d, area })); setStep(3) }}
                        className="rounded-xl py-4 text-sm font-semibold text-ink transition-all duration-150 hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold"
                        style={{ backgroundColor: '#0C0E14', border: '1px solid #23263A' }}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </>
              ) : step === 3 ? (
                <>
                  <p className="mb-5 text-base font-semibold text-ink">{t.step3}</p>
                  <div className="flex flex-col gap-3">
                    {SERVICES_OPTS[lang].map(svc => (
                      <button
                        key={svc}
                        onClick={() => { setData(d => ({ ...d, service: svc })); setStep(4) }}
                        className="rounded-xl px-5 py-3.5 text-sm font-semibold text-ink transition-all duration-150 hover:border-gold/60 hover:text-gold text-start"
                        style={{ backgroundColor: '#0C0E14', border: '1px solid #23263A' }}
                      >
                        {svc}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-5 text-base font-semibold text-ink leading-snug">{t.step4}</p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="text"
                      required
                      placeholder={t.namePh}
                      value={data.name}
                      onChange={e => setData(d => ({ ...d, name: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-mid outline-none transition-all focus:border-gold/60"
                      style={{ backgroundColor: '#0C0E14', border: '1px solid #23263A' }}
                    />
                    <input
                      type="tel"
                      required
                      placeholder={t.phonePh}
                      value={data.phone}
                      onChange={e => setData(d => ({ ...d, phone: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-mid outline-none transition-all focus:border-gold/60"
                      style={{ backgroundColor: '#0C0E14', border: '1px solid #23263A' }}
                    />
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
                      <p className="rounded-lg px-3 py-2 text-xs leading-relaxed" style={{ background: 'rgba(120,40,40,0.35)', color: '#FFB4B4' }}>
                        {lang === 'ru'
                          ? 'Не удалось отправить. Позвоните нам или напишите в WhatsApp — контакты внизу страницы.'
                          : 'השליחה נכשלה. התקשרו אלינו או כתבו בוואטסאפ - הפרטים בתחתית העמוד.'}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="mt-1 w-full rounded-xl py-3 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #C4983A, #E8C568)', color: '#1C1F26', boxShadow: '0 4px 20px rgba(196,152,58,0.3)' }}
                    >
                      {sending ? (lang === 'ru' ? 'Отправляем…' : 'שולח…') : t.submit}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
