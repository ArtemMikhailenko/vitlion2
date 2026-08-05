import type { SeoH2Block } from '../../data/seoContent'

interface Props {
  h2Blocks: SeoH2Block[]
  seoText: string[]
  ctaLabel: string
  ctaHref: string
}

export default function SeoContentSection({ h2Blocks, seoText, ctaLabel, ctaHref }: Props) {
  return (
    <section className="py-16 lg:py-20 bg-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {h2Blocks.map((block, i) => (
          <div key={i}>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">{block.heading}</h2>
            <p className="text-ink-mid mb-4">{block.intro}</p>
            {block.listType === 'ol' ? (
              <ol className="list-decimal ps-5 space-y-2 text-ink-mid">
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ol>
            ) : (
              <ul className="list-disc ps-5 space-y-2 text-ink-mid">
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            )}
            {block.outro && <p className="text-ink-mid mt-4">{block.outro}</p>}
          </div>
        ))}

        <div className="space-y-4 text-ink-mid leading-relaxed">
          {seoText.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="text-center">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-ink font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
