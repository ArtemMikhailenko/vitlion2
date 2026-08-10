import type { ReactNode } from 'react'

export interface ContentBlock {
  heading?: string
  paragraphs?: string[]
  items?: string[]
  /** Rendered after the list — used where the brief adds a closing note. */
  outro?: string[]
}

interface Props {
  blocks: ContentBlock[]
  /** Page-level heading rendered above the blocks, if any. */
  heading?: string
  intro?: string
  /** Alternate the section background so long pages stay readable. */
  alternate?: boolean
  id?: string
  children?: ReactNode
}

/**
 * Renders the ready copy from the SEO/GEO brief.
 *
 * A Server Component on purpose: this is the text crawlers and AI bots are
 * meant to read, so none of it may depend on hydration. Headings are <h2>/<h3>
 * so each page keeps a single <h1> above them.
 */
export default function ContentBlocks({
  blocks,
  heading,
  intro,
  alternate = false,
  id,
  children,
}: Props) {
  if (!blocks.length && !heading) return null

  return (
    <section id={id} className={`py-16 lg:py-20 ${alternate ? 'bg-dark-section' : 'bg-dark'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {heading && <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">{heading}</h2>}
        {intro && <p className="text-ink-mid leading-relaxed mb-8">{intro}</p>}

        <div className="space-y-10">
          {blocks.map((block, i) => (
            <div key={block.heading ?? i}>
              {block.heading && (
                <h3 className="text-xl sm:text-2xl font-semibold text-ink mb-3">{block.heading}</h3>
              )}

              {block.paragraphs?.map((paragraph, j) => (
                <p key={j} className="text-ink-mid leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}

              {!!block.items?.length && (
                <ul className="mt-4 space-y-2">
                  {block.items.map(item => (
                    <li key={item} className="flex gap-3 text-ink-mid leading-relaxed">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {block.outro?.map((paragraph, j) => (
                <p key={j} className="text-ink-mid leading-relaxed mt-4">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>

        {children}
      </div>
    </section>
  )
}
