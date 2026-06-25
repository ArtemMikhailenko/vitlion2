import { Phone, MessageCircle, Mail, Clock, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CONTACT } from '../../data/services'

export default function Contact() {
  const { t } = useTranslation()
  const waNumber = CONTACT.whatsapp.replace(/\D/g, '')
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(t('whatsapp.message'))}`

  const infoItems = [
    { Icon: Phone, label: t('contact.info.phone'), value: CONTACT.phone, href: `tel:${CONTACT.phone}` },
    { Icon: MessageCircle, label: 'WhatsApp', value: CONTACT.whatsapp, href: waHref },
    { Icon: Mail, label: t('contact.info.email'), value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { Icon: Clock, label: t('contact.info.hours'), value: t('contact.info.hoursValue'), href: null },
    { Icon: MapPin, label: t('contact.info.address'), value: t('contact.info.addressValue') || 'נתניה, ישראל', href: null },
  ]

  return (
    <section id="contact" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
            {t('contact.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-5">
            {t('contact.title')}
          </h2>
          <p className="text-ink-mid text-lg max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {infoItems.map(({ Icon, label, value, href }, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E4DECC' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(196,152,58,0.1)', border: '1px solid rgba(196,152,58,0.2)' }}
              >
                <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-semibold text-gold tracking-widest uppercase mb-1">{label}</p>
              {href ? (
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="text-ink font-medium text-sm hover:text-gold transition-colors duration-200 break-all">
                  {value}
                </a>
              ) : (
                <p className="text-ink-mid text-sm">{value}</p>
              )}
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`tel:${CONTACT.phone}`}
            className="inline-flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-light text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 text-base hover:scale-105 active:scale-95 shadow-lg"
            style={{ color: '#1A1D24', boxShadow: '0 4px 20px rgba(196,152,58,0.3)' }}
          >
            <Phone className="w-4 h-4" strokeWidth={2} />
            {CONTACT.phone}
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base hover:scale-105 active:scale-95 text-white shadow-lg"
            style={{ backgroundColor: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.25)' }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
