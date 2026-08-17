'use client'

import { useActionState, useMemo, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Card, LangLines, LangPair, Notice, SaveBar, inputClass } from '@/components/admin/fields'
import { ImageField, ImageLibrary } from '@/components/admin/ImagePicker'
import type { EditableEntity } from '@/lib/admin/catalog'
import type { PickableImage } from '@/lib/admin/images'
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
  images,
}: {
  kind: 'category' | 'model'
  entity: EditableEntity
  categorySlug: string
  canSave: boolean
  images: PickableImage[]
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(saveEntity, {})
  const [dirty, setDirty] = useState(false)
  const [gallery, setGallery] = useState(entity.gallery.join('\n'))
  const [pickingGallery, setPickingGallery] = useState(false)

  const galleryPreview = useMemo(
    () =>
      gallery
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .slice(0, 12),
    [gallery],
  )

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
          hint="Выберите из библиотеки или вставьте адрес. Загрузить новое можно в разделе «Фотографии»."
        >
          <ImageField
            name="mainImage"
            defaultValue={entity.mainImage}
            images={images}
            onChanged={() => setDirty(true)}
          />
        </Card>

        {kind === 'model' && (
          <Card title="Галерея" hint="По одному адресу на строку. Порядок отображения — как здесь.">
            <textarea
              name="gallery"
              value={gallery}
              onChange={e => setGallery(e.target.value)}
              rows={6}
              dir="ltr"
              className={`${inputClass} resize-y leading-relaxed`}
            />

            <button
              type="button"
              onClick={() => setPickingGallery(true)}
              className="mt-2 rounded-lg border border-[#23263A] px-3 py-1.5 text-xs text-[#8C90A8] transition-colors hover:border-[#C4983A] hover:text-[#E4E0D8]"
            >
              Добавить фото из библиотеки
            </button>

            {pickingGallery && (
              <ImageLibrary
                images={images}
                onPick={url => {
                  // Appends rather than replaces: the gallery is a list, and the
                  // operator is adding to it one photo at a time.
                  setGallery(current => (current.trim() ? `${current.replace(/\s+$/, '')}\n${url}` : url))
                  setPickingGallery(false)
                  setDirty(true)
                }}
                onClose={() => setPickingGallery(false)}
              />
            )}

            {galleryPreview.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {galleryPreview.map(src => (
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
