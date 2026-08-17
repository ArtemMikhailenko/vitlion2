'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useSaveEffect } from '@/components/admin/useSaveEffect'
import { Card, Notice, SaveBar, inputClass } from '@/components/admin/fields'
import type { ContentBlock } from '@/components/sections/ContentBlocks'
import { saveBlocks, type BlocksState } from './blocks-actions'

export interface BlocksValue {
  he: ContentBlock[]
  ru: ContentBlock[]
}

type Lang = 'he' | 'ru'

function Bar({ dirty, disabled }: { dirty: boolean; disabled: boolean }) {
  const { pending } = useFormStatus()
  return <SaveBar dirty={dirty} disabled={disabled} pending={pending} />
}

const lines = (list?: string[]) => (list ?? []).join('\n')
const toLines = (value: string) => value.split('\n')

/**
 * Body text of a catalogue page: a list of blocks, each a heading with
 * paragraphs, a bulleted list and a closing paragraph.
 *
 * Blocks are added and removed for both languages at once, because the Hebrew
 * and Russian versions of a page are translations of the same structure — a
 * section that exists in one and not the other is a mistake, not a feature.
 */
export default function BlocksEditor({
  ownerType,
  ownerSlug,
  categorySlug,
  initial,
  canSave,
}: {
  ownerType: 'category' | 'model'
  ownerSlug: string
  categorySlug: string
  initial: BlocksValue
  canSave: boolean
}) {
  const [state, formAction] = useActionState<BlocksState, FormData>(saveBlocks, {})
  const [blocks, setBlocks] = useState<BlocksValue>(initial)
  const [dirty, setDirty] = useState(false)

  useSaveEffect(state, () => setDirty(false))

  const count = Math.max(blocks.he.length, blocks.ru.length)

  const patch = (lang: Lang, index: number, field: keyof ContentBlock, value: string) => {
    setDirty(true)
    setBlocks(current => {
      const next = [...current[lang]]
      while (next.length <= index) next.push({})
      next[index] = {
        ...next[index],
        [field]: field === 'heading' ? value : toLines(value),
      }
      return { ...current, [lang]: next }
    })
  }

  const addBlock = () => {
    setDirty(true)
    setBlocks(c => ({ he: [...c.he, {}], ru: [...c.ru, {}] }))
  }

  const removeBlock = (index: number) => {
    setDirty(true)
    setBlocks(c => ({
      he: c.he.filter((_, i) => i !== index),
      ru: c.ru.filter((_, i) => i !== index),
    }))
  }

  const move = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= count) return
    setDirty(true)
    setBlocks(c => {
      const swap = (list: ContentBlock[]) => {
        const next = [...list]
        while (next.length <= Math.max(index, target)) next.push({})
        ;[next[index], next[target]] = [next[target], next[index]]
        return next
      }
      return { he: swap(c.he), ru: swap(c.ru) }
    })
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="ownerType" value={ownerType} />
      <input type="hidden" name="ownerSlug" value={ownerSlug} />
      <input type="hidden" name="categorySlug" value={categorySlug} />
      <input type="hidden" name="blocks" value={JSON.stringify(blocks)} />

      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && !dirty && <Notice kind="ok">Сохранено. Страница на сайте обновлена.</Notice>}

      <div className="space-y-5">
        {Array.from({ length: count }, (_, index) => (
          <Card
            key={index}
            title={`Блок ${index + 1}`}
            hint="Абзацы и пункты списка — по одному на строку."
            actions={
              <div className="flex gap-1">
                <MiniButton onClick={() => move(index, -1)} disabled={index === 0} label="↑" />
                <MiniButton
                  onClick={() => move(index, 1)}
                  disabled={index === count - 1}
                  label="↓"
                />
                <MiniButton onClick={() => removeBlock(index)} label="Удалить" danger />
              </div>
            }
          >
            <div className="grid gap-5 lg:grid-cols-2">
              {(['he', 'ru'] as Lang[]).map(lang => {
                const block = blocks[lang][index] ?? {}
                return (
                  <div key={lang} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#585C78]">
                      {lang === 'he' ? 'Иврит' : 'Русский'}
                    </p>

                    <Field label="Заголовок">
                      <input
                        value={block.heading ?? ''}
                        onChange={e => patch(lang, index, 'heading', e.target.value)}
                        dir={lang === 'he' ? 'rtl' : 'ltr'}
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Абзацы">
                      <textarea
                        value={lines(block.paragraphs)}
                        onChange={e => patch(lang, index, 'paragraphs', e.target.value)}
                        rows={4}
                        dir={lang === 'he' ? 'rtl' : 'ltr'}
                        className={`${inputClass} resize-y leading-relaxed`}
                      />
                    </Field>

                    <Field label="Пункты списка">
                      <textarea
                        value={lines(block.items)}
                        onChange={e => patch(lang, index, 'items', e.target.value)}
                        rows={4}
                        dir={lang === 'he' ? 'rtl' : 'ltr'}
                        className={`${inputClass} resize-y leading-relaxed`}
                      />
                    </Field>

                    <Field label="Заключение">
                      <textarea
                        value={lines(block.outro)}
                        onChange={e => patch(lang, index, 'outro', e.target.value)}
                        rows={2}
                        dir={lang === 'he' ? 'rtl' : 'ltr'}
                        className={`${inputClass} resize-y leading-relaxed`}
                      />
                    </Field>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}

        {count === 0 && (
          <p className="rounded-2xl border border-dashed border-[#23263A] p-8 text-center text-sm text-[#585C78]">
            На этой странице пока нет текстовых блоков.
          </p>
        )}

        <button
          type="button"
          onClick={addBlock}
          className="w-full rounded-2xl border border-dashed border-[#23263A] py-3 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
        >
          + Добавить блок
        </button>
      </div>

      <Bar dirty={dirty} disabled={!canSave} />
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-[#8C90A8]">{label}</span>
      {children}
    </label>
  )
}

function MiniButton({
  onClick,
  label,
  disabled,
  danger,
}: {
  onClick: () => void
  label: string
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded border border-[#23263A] px-2 py-1 text-[11px] transition-colors disabled:opacity-30 ${
        danger
          ? 'text-[#8C90A8] hover:border-[#5A2A2A] hover:text-[#E5A0A0]'
          : 'text-[#8C90A8] hover:border-[#C4983A] hover:text-[#E4E0D8]'
      }`}
    >
      {label}
    </button>
  )
}
