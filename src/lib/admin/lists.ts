/**
 * The repeating blocks of the site: advantages, reviews, the team.
 *
 * These live in the dictionaries as arrays of objects, which is why the text
 * editor could never touch them — its manifest only knows flat strings. The
 * storage was always ready (translations.value is jsonb); this describes the
 * shape of each list so one editor can render all of them.
 */

export interface ListField {
  name: string
  label: string
  kind?: 'text' | 'multiline' | 'number'
  hint?: string
}

export interface EditableList {
  id: string
  /** Dot path into the dictionary. */
  key: string
  title: string
  description: string
  /** Where it sits on the site, for the preview. */
  anchor?: string
  /** Site path the preview should open; defaults to the home page. */
  path?: string
  where: string
  /** Undefined means the list is plain strings rather than objects. */
  fields?: ListField[]
  /** Label for one entry, e.g. "Преимущество 3". */
  itemLabel: string
}

export const EDITABLE_LISTS: EditableList[] = [
  {
    id: 'whyUs',
    key: 'whyUs.items',
    title: 'Преимущества',
    description: 'Карточки в блоке «Почему мы» на главной.',
    anchor: '#why-us',
    where: 'главная, блок «Почему мы»',
    itemLabel: 'Преимущество',
    fields: [
      { name: 'icon', label: 'Значок', hint: 'Один эмодзи — 🏭, 🛡️, ⚡. Скопируйте откуда угодно.' },
      { name: 'title', label: 'Заголовок' },
      { name: 'text', label: 'Текст', kind: 'multiline' },
    ],
  },
  {
    id: 'testimonials',
    key: 'testimonials.items',
    title: 'Отзывы',
    description: 'Отзывы клиентов на главной. Порядок здесь — порядок на сайте.',
    anchor: '#testimonials',
    where: 'главная, ниже галереи',
    itemLabel: 'Отзыв',
    fields: [
      { name: 'name', label: 'Имя' },
      { name: 'city', label: 'Город' },
      { name: 'rating', label: 'Звёзды', kind: 'number', hint: 'От 1 до 5.' },
      { name: 'text', label: 'Текст отзыва', kind: 'multiline' },
    ],
  },
  {
    id: 'team',
    key: 'team.members',
    title: 'Команда',
    description: 'Сотрудники на странице «О нас».',
    path: '/about',
    where: 'страница «О нас»',
    itemLabel: 'Сотрудник',
    fields: [
      { name: 'name', label: 'Имя' },
      { name: 'role', label: 'Должность и описание', kind: 'multiline' },
    ],
  },
  {
    id: 'tempered',
    key: 'glass.temperedFeatures',
    title: 'Закалённое стекло — плюсы',
    description: 'Список в сравнении стёкол на странице «О нас». По одному пункту на строку.',
    path: '/about',
    where: 'страница «О нас»',
    itemLabel: 'Пункт',
  },
  {
    id: 'regular',
    key: 'glass.regularFeatures',
    title: 'Обычное стекло — минусы',
    description: 'Второй столбец того же сравнения.',
    path: '/about',
    where: 'страница «О нас»',
    itemLabel: 'Пункт',
  },
]

export const LIST_KEYS = EDITABLE_LISTS.map(l => l.key)

export function findList(id: string): EditableList | undefined {
  return EDITABLE_LISTS.find(l => l.id === id)
}
