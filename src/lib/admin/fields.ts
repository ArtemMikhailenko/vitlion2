/**
 * The curated list of editable text fields.
 *
 * The dictionaries hold several hundred strings across nested objects. Dumping
 * all of that into a form would be unusable, so this manifest names the fields
 * an operator actually changes, groups them the way the page reads, and gives
 * each a plain-language label and a hint about where it appears.
 *
 * Anything not listed here stays in the dictionary files and is edited by a
 * developer — which is the right split for strings like accessibility widget
 * labels that should not drift.
 */

export type FieldKind = 'text' | 'multiline'

export interface EditableField {
  /** Dot path into the dictionary, e.g. "hero.subtitle". */
  key: string
  label: string
  /** Where the visitor sees it — shown under the input. */
  hint?: string
  kind?: FieldKind
}

export interface FieldGroup {
  id: string
  title: string
  description: string
  fields: EditableField[]
}

export const FIELD_GROUPS: FieldGroup[] = [
  {
    id: 'hero',
    title: 'Первый экран',
    description: 'То, что видно сразу при открытии главной страницы.',
    fields: [
      { key: 'hero.badge', label: 'Надпись над заголовком', hint: 'Мелкий золотой текст в самом верху.' },
      {
        key: 'hero.title',
        label: 'Главный заголовок',
        hint: 'Крупный текст. Перенос строки задаётся переводом строки в поле.',
        kind: 'multiline',
      },
      {
        key: 'hero.titleSuffix',
        label: 'Продолжение заголовка',
        hint: 'Вторая строка помельче — перечисление продукции. Входит в тот же H1, важно для поиска.',
      },
      { key: 'hero.subtitle', label: 'Описание под заголовком', kind: 'multiline' },
      { key: 'hero.cta', label: 'Основная кнопка' },
      { key: 'hero.ctaSecondary', label: 'Вторая кнопка' },
    ],
  },
  {
    id: 'meta',
    title: 'Для поисковиков',
    description:
      'Заголовок и описание главной страницы в результатах Google и в превью при отправке ссылки.',
    fields: [
      { key: 'meta.title', label: 'Заголовок страницы (title)', hint: 'До ~60 символов, иначе Google обрежет.' },
      {
        key: 'meta.description',
        label: 'Описание (description)',
        hint: 'До ~155 символов. Это текст под ссылкой в выдаче.',
        kind: 'multiline',
      },
      { key: 'meta.ogTitle', label: 'Заголовок для соцсетей' },
      { key: 'meta.ogDescription', label: 'Описание для соцсетей', kind: 'multiline' },
    ],
  },
  {
    id: 'nav',
    title: 'Меню',
    description: 'Пункты верхнего меню.',
    fields: [
      { key: 'nav.home', label: 'Главная' },
      { key: 'nav.services', label: 'Услуги' },
      { key: 'nav.about', label: 'О нас' },
      { key: 'nav.gallery', label: 'Проекты' },
      { key: 'nav.contact', label: 'Контакты' },
      { key: 'nav.callUs', label: 'Кнопка «Позвонить»' },
    ],
  },
  {
    id: 'services',
    title: 'Блок услуг',
    description: 'Заголовок раздела с карточками категорий на главной.',
    fields: [
      { key: 'services.badge', label: 'Надпись над заголовком' },
      { key: 'services.title', label: 'Заголовок' },
      { key: 'services.subtitle', label: 'Описание', kind: 'multiline' },
      { key: 'services.learnMore', label: 'Ссылка «Подробнее»' },
    ],
  },
  {
    id: 'whyUs',
    title: 'Почему мы',
    description: 'Блок с преимуществами.',
    fields: [
      { key: 'whyUs.badge', label: 'Надпись над заголовком' },
      { key: 'whyUs.title', label: 'Заголовок' },
      { key: 'whyUs.subtitle', label: 'Описание', kind: 'multiline' },
    ],
  },
  {
    id: 'contact',
    title: 'Контакты и заявка',
    description: 'Форма обратной связи внизу главной.',
    fields: [
      { key: 'contact.badge', label: 'Надпись над заголовком' },
      { key: 'contact.title', label: 'Заголовок' },
      { key: 'contact.subtitle', label: 'Описание', kind: 'multiline' },
    ],
  },
  {
    id: 'cta',
    title: 'Призыв к действию',
    description: 'Полоса перед подвалом.',
    fields: [
      { key: 'cta.title', label: 'Заголовок' },
      { key: 'cta.subtitle', label: 'Описание', kind: 'multiline' },
      { key: 'cta.button', label: 'Кнопка' },
    ],
  },
]

export const ALL_FIELD_KEYS = FIELD_GROUPS.flatMap(g => g.fields.map(f => f.key))

export function findGroup(id: string): FieldGroup | undefined {
  return FIELD_GROUPS.find(g => g.id === id)
}
