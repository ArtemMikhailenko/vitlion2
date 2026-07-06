import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, ChevronLeft, Calculator } from 'lucide-react'

type QuizData = {
  shape: string
  area: string
  service: string
  name: string
  phone: string
}

const SHAPES = {
  ru: [
    { id: 'straight', label: 'Прямой', svg: <rect x="4" y="8" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" /> },
    { id: 'corner',   label: 'Угловой', svg: <path d="M4 4h8v8h8v8H12v-8H4V4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" /> },
    { id: 'u-shape',  label: 'П-образный', svg: <path d="M4 4h4v16h8V4h4v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" /> },
  ],
  he: [
    { id: 'straight', label: 'ישר',    svg: <rect x="4" y="8" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" /> },
    { id: 'corner',   label: 'פינתי',  svg: <path d="M4 4h8v8h8v8H12v-8H4V4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" /> },
    { id: 'u-shape',  label: 'פרסה',   svg: <path d="M4 4h4v16h8V4h4v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" /> },
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
  const [data, setData] = useState<QuizData>({ shape: '', area: '', service: '', name: '', phone: '' })

  const close = () => { setOpen(false); setStep(1); setSubmitted(false); setData({ shape: '', area: '', service: '', name: '', phone: '' }) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Quiz data:', data)
    setSubmitted(true)
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-28 right-4 z-[79] flex items-center gap-2 rounded-full sm:px-4 sm:py-2.5 text-[13px] font-bold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 w-11 h-11 sm:w-auto sm:h-auto justify-center"
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
                        <svg viewBox="0 0 24 24" className="h-10 w-10">{shape.svg}</svg>
                        <span className="text-[12px] font-semibold text-ink">{shape.label}</span>
                      </button>
                    ))}
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
                    <button
                      type="submit"
                      className="mt-1 w-full rounded-xl py-3 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: 'linear-gradient(135deg, #C4983A, #E8C568)', color: '#1C1F26', boxShadow: '0 4px 20px rgba(196,152,58,0.3)' }}
                    >
                      {t.submit}
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
