import { useState, useRef, useEffect } from 'react'
import { Phone, MessageCircle, Mail, Clock, MapPin, ChevronDown, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CONTACT, SERVICES } from '../../data/services'

type FormState = 'idle' | 'sending' | 'success'

export default function Contact() {
  const { t } = useTranslation()
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({ name: '', phone: '', city: '', service: '', message: '' })
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const waNumber = CONTACT.whatsapp.replace(/\D/g, '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')
    const serviceName = form.service
      ? (SERVICES.find(s => s.id === form.service) ? t(SERVICES.find(s => s.id === form.service)!.nameKey) : form.service)
      : ''
    const lines = [
      '*Vitlion Group*',
      '',
      `*${t('contact.form.name')}:* ${form.name}`,
      `*${t('contact.form.phone')}:* ${form.phone}`,
      form.city ? `*${t('contact.form.city')}:* ${form.city}` : null,
      serviceName ? `*${t('contact.form.service')}:* ${serviceName}` : null,
      form.message ? `*${t('contact.form.message')}:* ${form.message}` : null,
    ].filter(Boolean).join('\n')
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines)}`
    setTimeout(() => { window.open(url, '_blank', 'noopener,noreferrer'); setFormState('success') }, 600)
  }

  const waDefaultHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(t('whatsapp.message'))}`
  const selectedServiceLabel = form.service
    ? t(SERVICES.find(s => s.id === form.service)?.nameKey ?? '')
    : t('contact.form.servicePlaceholder')

  const infoItems = [
    { Icon: Phone, label: t('contact.info.phone'), value: CONTACT.phone, href: `tel:${CONTACT.phone}` },
    { Icon: MessageCircle, label: 'WhatsApp', value: CONTACT.whatsapp, href: waDefaultHref },
    { Icon: Mail, label: t('contact.info.email'), value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { Icon: Clock, label: t('contact.info.hours'), value: t('contact.info.hoursValue'), href: null },
    { Icon: MapPin, label: t('contact.info.address'), value: t('contact.info.address'), href: null },
  ]

  return (
    <section id="contact" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
            {t('contact.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            {t('contact.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-3 bg-dark-card border border-dark-border rounded-2xl p-8">
            {formState === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#25D366]/15 flex items-center justify-center mx-auto mb-5">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <p className="text-white text-lg font-semibold mb-2">{t('contact.form.success')}</p>
                <button
                  onClick={() => { setFormState('idle'); setForm({ name: '', phone: '', city: '', service: '', message: '' }) }}
                  className="text-gold hover:text-gold-light text-sm font-medium transition-colors duration-200 mt-4"
                >
                  {t('contact.form.sendAnother') || 'Send another'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.form.name')} *</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange}
                      placeholder={t('contact.form.namePlaceholder')}
                      className="w-full bg-dark-elevated border border-dark-border focus:border-gold rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors duration-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.form.phone')} *</label>
                    <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
                      placeholder={t('contact.form.phonePlaceholder')}
                      className="w-full bg-dark-elevated border border-dark-border focus:border-gold rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors duration-200 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.form.city')}</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange}
                      placeholder={t('contact.form.cityPlaceholder')}
                      className="w-full bg-dark-elevated border border-dark-border focus:border-gold rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors duration-200 text-sm" />
                  </div>
                  <div ref={dropRef}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.form.service')}</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropOpen(v => !v)}
                        className={`w-full bg-dark-elevated border rounded-xl px-4 py-3 text-sm text-start flex items-center justify-between gap-2 outline-none transition-colors duration-200 ${
                          dropOpen ? 'border-gold' : 'border-dark-border hover:border-gold/40'
                        } ${form.service ? 'text-white' : 'text-gray-500'}`}
                      >
                        <span className="truncate">{selectedServiceLabel}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                      </button>

                      {dropOpen && (
                        <div className="absolute z-20 w-full mt-1.5 bg-dark-card border border-gold/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                          <div className="max-h-56 overflow-y-auto">
                            <button
                              type="button"
                              onClick={() => { setForm(p => ({ ...p, service: '' })); setDropOpen(false) }}
                              className={`w-full text-start px-4 py-3 text-sm transition-colors duration-150 flex items-center justify-between ${
                                !form.service ? 'text-gold bg-gold/5' : 'text-gray-400 hover:bg-dark-elevated hover:text-white'
                              }`}
                            >
                              {t('contact.form.servicePlaceholder')}
                              {!form.service && <Check className="w-3.5 h-3.5 text-gold" strokeWidth={2.5} />}
                            </button>
                            {SERVICES.map(s => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => { setForm(p => ({ ...p, service: s.id })); setDropOpen(false) }}
                                className={`w-full text-start px-4 py-3 text-sm transition-colors duration-150 flex items-center justify-between border-t border-dark-border/50 ${
                                  form.service === s.id ? 'text-gold bg-gold/5' : 'text-gray-300 hover:bg-dark-elevated hover:text-white'
                                }`}
                              >
                                {t(s.nameKey)}
                                {form.service === s.id && <Check className="w-3.5 h-3.5 text-gold shrink-0" strokeWidth={2.5} />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.form.message')}</label>
                  <textarea name="message" rows={4} value={form.message} onChange={handleChange}
                    placeholder={t('contact.form.messagePlaceholder')}
                    className="w-full bg-dark-elevated border border-dark-border focus:border-gold rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors duration-200 text-sm resize-none" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button type="submit" disabled={formState === 'sending'}
                    className="flex-1 bg-gold hover:bg-gold-light disabled:opacity-60 text-dark font-bold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm hover:scale-[1.02] active:scale-95">
                    {formState === 'sending' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        {t('contact.form.sending')}
                      </span>
                    ) : t('contact.form.submit')}
                  </button>
                  <a href={waDefaultHref} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {t('contact.form.whatsapp')}
                  </a>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {infoItems.map(({ Icon, label, value, href }, i) => (
              <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-5 flex items-start gap-4 hover:border-gold/20 transition-colors duration-200">
                <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <div className="text-gray-400 text-xs mb-1">{label}</div>
                  {href ? (
                    <a href={href} className="text-white font-medium hover:text-gold transition-colors duration-200 text-sm break-all"
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                      {value}
                    </a>
                  ) : (
                    <div className="text-white text-sm font-medium">{value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
