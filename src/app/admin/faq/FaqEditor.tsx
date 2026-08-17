'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useSaveEffect } from '@/components/admin/useSaveEffect'
import { Notice, SaveBar, inputClass } from '@/components/admin/fields'
import { saveFaq, type FaqPair, type FaqState } from './actions'

function Bar({ dirty, disabled }: { dirty: boolean; disabled: boolean }) {
  const { pending } = useFormStatus()
  return <SaveBar dirty={dirty} disabled={disabled} pending={pending} />
}

const EMPTY_PAIR: FaqPair = {
  he: { question: '', answer: '' },
  ru: { question: '', answer: '' },
}

export default function FaqEditor({ initial, canSave }: { initial: FaqPair[]; canSave: boolean }) {
  const [state, formAction] = useActionState<FaqState, FormData>(saveFaq, {})
  const [pairs, setPairs] = useState<FaqPair[]>(initial.length ? initial : [EMPTY_PAIR])
  const [dirty, setDirty] = useState(false)

  useSaveEffect(state, () => setDirty(false))

  const touch = () => setDirty(true)

  const move = (from: number, to: number) => {
    if (to < 0 || to >= pairs.length) return
    const next = [...pairs]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setPairs(next)
    touch()
  }

  const remove = (index: number) => {
    setPairs(pairs.filter((_, i) => i !== index))
    touch()
  }

  return (
    <form action={formAction} onChange={touch}>
      <input type="hidden" name="count" value={pairs.length} />

      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && !dirty && (
        <Notice kind="ok">Сохранено. Страница услуг и разметка для поисковиков обновлены.</Notice>
      )}

      <div className="space-y-4">
        {pairs.map((pair, index) => (
          // Keyed by index deliberately: entries have no stable id, and the
          // whole list is rewritten on save.
          <div key={index} className="rounded-xl border border-[#23263A] bg-[#13161F] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#E4E0D8]">Вопрос {index + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  title="Выше"
                  className="rounded border border-[#23263A] px-2 py-1 text-xs text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8] disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === pairs.length - 1}
                  title="Ниже"
                  className="rounded border border-[#23263A] px-2 py-1 text-xs text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8] disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="ms-2 rounded border border-transparent px-2 py-1 text-xs text-[#8C5A5A] transition-colors hover:border-[#5A2A2A] hover:text-[#FFB4B4]"
                >
                  Удалить
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {(['he', 'ru'] as const).map(lang => (
                <div key={lang} className="space-y-2">
                  <span className="block text-xs uppercase tracking-wider text-[#585C78]">
                    {lang === 'he' ? 'עברית' : 'Русский'}
                  </span>
                  <input
                    name={`q::${lang}::${index}`}
                    defaultValue={pair[lang].question}
                    placeholder="Вопрос"
                    dir={lang === 'he' ? 'rtl' : 'ltr'}
                    className={inputClass}
                  />
                  <textarea
                    name={`a::${lang}::${index}`}
                    defaultValue={pair[lang].answer}
                    placeholder="Ответ"
                    rows={6}
                    dir={lang === 'he' ? 'rtl' : 'ltr'}
                    className={`${inputClass} resize-y leading-relaxed`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setPairs([...pairs, EMPTY_PAIR])
          touch()
        }}
        className="mt-4 w-full rounded-xl border border-dashed border-[#23263A] py-3 text-sm text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
      >
        + Добавить вопрос
      </button>

      <Bar dirty={dirty} disabled={!canSave} />
    </form>
  )
}
