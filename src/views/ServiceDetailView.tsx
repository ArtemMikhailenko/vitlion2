import Link from 'next/link'
import type { ContentBlock } from '@/components/sections/ContentBlocks'
import ContentBlocks from '@/components/sections/ContentBlocks'
import Lightbox from '@/components/ui/Lightbox'
import { findServiceLive } from '@/lib/content/catalog'
import { localePath, type Lang } from '@/lib/i18n'
import { getLiveT } from '@/lib/content/translations'
import { getContactInfo } from '@/lib/content/contact'

interface Props {
  lang: Lang
  categorySlug: string
  serviceSlug: string
  /** Ready copy from the SEO brief for this model, when it exists. */
  blocks?: ContentBlock[]
}

/**
 * A single product model as a real, indexable page.
 *
 * Server-rendered end to end: the description, the six feature bullets and the
 * gallery are all in the HTML, which is the whole point of giving these models
 * their own URLs.
 */
export default async function ServiceDetailView({ lang, categorySlug, serviceSlug, blocks }: Props) {
  const entry = await findServiceLive(categorySlug, serviceSlug)
  if (!entry) return null

  const { category, service } = entry
  const t = await getLiveT(lang)
  const siblings = entry.category.services.filter(s => s.slug !== serviceSlug)
  const waHref = `https://wa.me/${(await getContactInfo()).whatsapp.replace(/\D/g, '')}`

  /*
   * One ordered list for both viewers, main image first. The gallery often
   * repeats the main shot, and a duplicate would make the counter lie and the
   * arrows land on the same picture twice.
   */
  const viewable = [service.mainImage, ...service.gallery].filter(
    (src, i, all) => src && all.indexOf(src) === i,
  )
  const features: string[] = service.features[lang] ?? []

  return (
    <main id="main" className="pt-20">
      {/* Breadcrumb — also gives crawlers an internal path back up */}
      <nav aria-label="breadcrumb" className="bg-dark pt-8">
        <ol className="max-w-4xl mx-auto flex flex-wrap gap-2 px-4 text-sm text-ink-soft sm:px-6 lg:px-8">
          <li>
            <Link href={localePath(lang)} className="hover:text-gold">
              {t('nav.home')}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={localePath(lang, categorySlug)} className="hover:text-gold">
              {category.name[lang]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-mid">{service.name[lang]}</li>
        </ol>
      </nav>

      <section className="bg-dark py-10 lg:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-gold">
            {category.name[lang]}
          </span>
          <h1 className="mb-4 text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
            {service.name[lang]}
          </h1>
          <p className="text-lg text-ink-mid">{service.short[lang]}</p>
        </div>
      </section>

      <section className="bg-dark pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Lightbox images={viewable} alt={service.name[lang]}>
            <img
              src={service.mainImage}
              alt={service.name[lang]}
              className="w-full rounded-2xl border border-dark-border object-cover"
              loading="eager"
            />
          </Lightbox>
        </div>
      </section>

      <section className="bg-dark-section py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-8 leading-relaxed text-ink-mid">{service.description[lang]}</p>

          {!!features.length && (
            <>
              <h2 className="mb-4 text-2xl font-bold text-ink">{t('services.features')}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {features.map(feature => (
                  <li
                    key={feature}
                    className="flex gap-3 rounded-xl border border-dark-border bg-dark-card px-4 py-3 text-ink-mid"
                  >
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {!!blocks?.length && <ContentBlocks blocks={blocks} />}

      {service.gallery.length > 1 && (
        <section className="bg-dark py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold text-ink">{t('services.gallery')}</h2>
            <Lightbox images={viewable} alt={service.name[lang]}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {service.gallery.map((image, i) => (
                <img
                  key={image}
                  src={image}
                  alt={`${service.name[lang]} ${i + 1}`}
                  className="aspect-[4/3] w-full rounded-xl border border-dark-border object-cover"
                  loading="lazy"
                  decoding="async"
                />
                ))}
              </div>
            </Lightbox>
          </div>
        </section>
      )}

      <section className="bg-dark-section py-14">
        <div className="max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <a
            href={waHref}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 font-bold text-dark transition-transform hover:scale-105"
          >
            {t('services.learnMore')}
          </a>
        </div>
      </section>

      {!!siblings.length && (
        <section className="bg-dark py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold text-ink">{category.name[lang]}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {siblings.map(sibling => (
                <Link
                  key={sibling.slug}
                  href={`${localePath(lang, categorySlug)}/${sibling.slug}`}
                  className="group overflow-hidden rounded-2xl border border-dark-border bg-dark-card transition-all hover:-translate-y-0.5"
                >
                  <img
                    src={sibling.mainImage}
                    alt={sibling.name[lang]}
                    className="h-32 w-full object-cover sm:h-40"
                    loading="lazy"
                    decoding="async"
                  />
                  <p className="px-3 py-3 text-sm font-semibold text-ink group-hover:text-gold">
                    {sibling.name[lang]}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
