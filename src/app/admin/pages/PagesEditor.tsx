'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Card, LangPair, Notice, SaveBar } from '@/components/admin/fields'
import { savePageSeo, type SaveState } from './actions'

export interface PageSeoValues {
  slug: string
  label: string
  url: string
  title: { he: string; ru: string }
  description: { he: string; ru: string }
  h1: { he: string; ru: string }
  ctaLabel: { he: string; ru: string }
}

function Bar({ dirty, disabled }: { dirty: boolean; disabled: boolean }) {
  const { pending } = useFormStatus()
  return <SaveBar dirty={dirty} disabled={disabled} pending={pending} />
}

/**
 * One form per page, selected by tab. Only the active page's fields are
 * submitted, so saving one page cannot silently overwrite another — which a
 * single form covering all six would do.
 */
export default function PagesEditor({
  pages,
  canSave,
}: {
  pages: PageSeoValues[]
  canSave: boolean
}) {
  const [activeSlug, setActiveSlug] = useState(pages[0]?.slug ?? '')
  const active = pages.find(p => p.slug === activeSlug) ?? pages[0]

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {pages.map(page => (
          <button
            key={page.slug}
            type="button"
            onClick={() => setActiveSlug(page.slug)}
            className={`rounded-lg px-3.5 py-2 text-sm transition-colors ${
              page.slug === active?.slug
                ? 'bg-[#C4983A] font-semibold text-[#0C0E14]'
                : 'border border-[#23263A] text-[#8C90A8] hover:border-[#C4983A]/50 hover:text-[#E4E0D8]'
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {active && <PageForm key={active.slug} page={active} canSave={canSave} />}
    </>
  )
}

function PageForm({ page, canSave }: { page: PageSeoValues; canSave: boolean }) {
  const [state, formAction] = useActionState<SaveState, FormData>(savePageSeo, {})
  const [dirty, setDirty] = useState(false)

  return (
    <form action={formAction} onChange={() => setDirty(true)}>
      <input type="hidden" name="slug" value={page.slug} />

      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && !dirty && <Notice kind="ok">Сохранено. Страница обновлена.</Notice>}

      <p className="mb-5 text-sm text-[#8C90A8]">
        Адрес на сайте:{' '}
        <a
          href={page.url}
          target="_blank"
          rel="noreferrer"
          className="text-[#C4983A] hover:underline"
        >
          {page.url} ↗
        </a>
      </p>

      <div className="space-y-5">
        <Card
          title="Заголовок в результатах поиска (title)"
          hint="До ~60 символов — длиннее Google обрежет. Он же в заголовке вкладки браузера."
        >
          <LangPair name="title" values={page.title} />
        </Card>

        <Card
          title="Описание (description)"
          hint="До ~155 символов. Это текст под ссылкой в результатах поиска."
        >
          <LangPair name="description" values={page.description} multiline rows={3} />
        </Card>

        <Card title="Заголовок на странице (H1)" hint="Крупный заголовок, который видит посетитель.">
          <LangPair name="h1" values={page.h1} />
        </Card>

        <Card title="Надпись на кнопке" hint="Кнопка призыва к действию внизу текстового блока.">
          <LangPair name="ctaLabel" values={page.ctaLabel} />
        </Card>
      </div>

      <Bar dirty={dirty} disabled={!canSave} />
    </form>
  )
}
