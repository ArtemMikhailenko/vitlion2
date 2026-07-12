import { useTranslation } from 'react-i18next'
import { CATEGORIES, CONTACT } from '../../data/services'
import { useLanguage } from '../../hooks/useLanguage'

const PhoneIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const MailIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const PinIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const SOCIALS = [
  { href: CONTACT.youtube,   label: 'YouTube',   path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { href: CONTACT.tiktok,    label: 'TikTok',    path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z' },
  { href: CONTACT.facebook,  label: 'Facebook',  path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { href: CONTACT.instagram, label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
]

export default function Footer() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const year = new Date().getFullYear()
  const lp = `?lang=${lang}`
  const catLang = lang === 'ru' ? 'ru' : 'he'

  return (
    <footer style={{ background: 'linear-gradient(180deg, #0C0E14 0%, #0A0C12 100%)' }}>
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #C4983A 30%, #E8C568 50%, #C4983A 70%, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Col 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href={`/${lp}`} className="inline-flex items-center gap-3 mb-4 group">
              <img src="/vitlion-without-background.png" alt="Vitlion Group" className="h-10 w-auto" />
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold tracking-[0.18em] text-[14px] uppercase group-hover:text-gold transition-colors duration-200">
                  VITLION <span className="text-gold">GROUP</span>
                </span>
                <span className="text-gold/50 text-[9px] tracking-widest mt-0.5" dir="rtl">
                  עבודות אלומיניום וזכוכית
                </span>
              </div>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{t('footer.description')}</p>
            <div className="flex gap-3">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gold transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  aria-label={s.label}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-widest uppercase"
              style={{ borderBottom: '1px solid rgba(196,152,58,0.2)', paddingBottom: '0.75rem' }}>
              {t('footer.services')}
            </h3>
            <ul className="space-y-3">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <a
                    href={`/services${lp}`}
                    className="text-gray-400 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors duration-200 shrink-0" />
                    {cat.name[catLang]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-widest uppercase"
              style={{ borderBottom: '1px solid rgba(196,152,58,0.2)', paddingBottom: '0.75rem' }}>
              {t('footer.company')}
            </h3>
            <ul className="space-y-3">
              {[
                { key: 'about',   href: `/about${lp}` },
                { key: 'gallery', href: `/projects${lp}` },
                { key: 'contact', href: `/contact${lp}` },
              ].map(item => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors duration-200 shrink-0" />
                    {t(`footer.links.${item.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-widest uppercase"
              style={{ borderBottom: '1px solid rgba(196,152,58,0.2)', paddingBottom: '0.75rem' }}>
              {t('footer.contactTitle')}
            </h3>
            <ul className="space-y-3.5">
              <li>
                <a href={`tel:${CONTACT.phone}`}
                  className="flex items-center gap-2.5 text-gray-400 hover:text-gold text-sm transition-colors duration-200 group">
                  <span className="text-gold/60 group-hover:text-gold transition-colors"><PhoneIcon /></span>
                  <span dir="ltr">{CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2.5 text-gray-400 hover:text-gold text-sm transition-colors duration-200 group">
                  <span className="text-gold/60 group-hover:text-gold transition-colors"><MailIcon /></span>
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm">
                  <span className="text-gold/60 mt-0.5 shrink-0"><PinIcon /></span>
                  <div className="space-y-1.5">
                    <a href="https://waze.com/ul?q=אברהם+בומה+שביט+1+ראשון+לציון" target="_blank" rel="noopener noreferrer"
                      className="block leading-snug text-gray-400 hover:text-gold transition-colors duration-200">
                      {t('footer.addressRishon')}
                    </a>
                    <a href="https://waze.com/ul?q=ההסתדרות+25+חיפה" target="_blank" rel="noopener noreferrer"
                      className="block leading-snug text-gray-400 hover:text-gold transition-colors duration-200">
                      {t('footer.addressHaifa')}
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                  <span className="text-gold/60"><ClockIcon /></span>
                  <p>{t('footer.workingHours')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-gray-600 text-xs">{t('footer.rights').replace('2024', String(year))}</p>
          <a
            href="https://beznest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 opacity-35 hover:opacity-60 transition-opacity duration-200 group"
          >
            <img src="/logo-white.png" alt="Project Aurora" className="h-4 w-auto" />
            <span className="text-gray-400 text-xs">Powered by Project Aurora</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
