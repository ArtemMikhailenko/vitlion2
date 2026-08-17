'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Card, LangLines, LangPair, Notice, SaveBar, inputClass } from '@/components/admin/fields'
import type { EditableEntity } from '@/lib/admin/catalog'
import { saveEntity, type SaveState } from './actions'

function Bar({ dirty, disabled }: { dirty: boolean; disabled: boolean }) {
  const { pending } = useFormStatus()
  return <SaveBar dirty={dirty} disabled={disabled} pending={pending} />
}

export default function EntityEditor({
  kind,
  entity,
  categorySlug,
  canSave,
}: {
  kind: 'category' | 'model'
  entity: EditableEntity
  categorySlug: string
  canSave: boolean
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(saveEntity, {})
  const [dirty, setDirty] = useState(false)

  return (
    <form action={formAction} onChange={() => setDirty(true)}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="slug" value={entity.slug} />
      <input type="hidden" name="categorySlug" value={categorySlug} />

      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && !dirty && <Notice kind="ok">Сохранено. Страницы сайта обновлены.</Notice>}

      <div className="space-y-5">
        <Card title="Название" hint="Показывается на карточке и в заголовке страницы.">
          <LangPair name="name" values={entity.name} />
        </Card>

        <Card title="Краткое описание" hint="Одна строка под названием на карточке.">
          <LangPair name="short" values={entity.short} multiline rows={2} />
        </Card>

        {kind === 'model' && (
          <>
            <Card title="Полное описание" hint="Основной текст на странице модели.">
              <LangPair name="description" values={entity.description} multiline rows={6} />
            </Card>

            <Card
              title="Характеристики"
              hint="По одному пункту на строку. Порядок на сайте — как здесь."
            >
              <LangLines name="features" values={entity.features} />
            </Card>
          </>
        )}

        <Card
          title="Главное фото"
          hint="Путь к изображению. Загрузить новое можно в разделе «Фотографии»."
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            {entity.mainImage && (
              <img
                src={entity.mainImage}
                alt=""
                className="h-24 w-32 shrink-0 rounded-lg border border-[#23263A] object-cover"
              />
            )}
            <input name="mainImage" defaultValue={entity.mainImage} className={inputClass} dir="ltr" />
          </div>
        </Card>

        {kind === 'model' && (
          <Card title="Галерея" hint="По одному адресу на строку. Порядок отображения — как здесь.">
            <textarea
              name="gallery"
              defaultValue={entity.gallery.join('\n')}
              rows={6}
              dir="ltr"
              className={`${inputClass} resize-y leading-relaxed`}
            />
            {!!entity.gallery.length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {entity.gallery.slice(0, 12).map(src => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-14 w-20 rounded border border-[#23263A] object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      <Bar dirty={dirty} disabled={!canSave} />
    </form>
  )
}
