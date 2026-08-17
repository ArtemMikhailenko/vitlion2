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
  /** Warns past this many characters, where length has a visible consequence. */
  limit?: number
}

export interface FieldGroup {
  id: string
  title: string
  description: string
  /**
   * CSS selector for the matching block on the live page, so the preview can
   * scroll to what is being edited. Groups with no on-page block leave it out.
   */
  anchor?: string
  /** Shown instead of the "show on the site" button when there is no anchor. */
  invisibleNote?: string
  /** Position in the page, so the list reads in the same order as the site. */
  where: string
  fields: EditableField[]
}

export const FIELD_GROUPS: FieldGroup[] = [
  {
    id: 'hero',
    title: 'Первый экран',
    description: 'То, что видно сразу при открытии главной страницы.',
    where: '1-й блок сверху',
    anchor: '#home',
    fields: [
      {
        key: 'hero.badge',
        label: 'Надпись над заголовком',
        hint: 'Мелкий золотой текст в самом верху.',
      },
      {
        key: 'hero.title',
        label: 'Главный заголовок',
        hint: 'Самый крупный текст на сайте. Перенос строки задаётся переводом строки прямо в поле.',
        kind: 'multiline',
      },
      {
        key: 'hero.titleSuffix',
        label: 'Продолжение заголовка',
        hint: 'Вторая строка помельче — перечисление продукции. Входит в тот же заголовок, поэтому важна для поиска.',
      },
      {
        key: 'hero.subtitle',
        label: 'Описание под заголовком',
        hint: 'Абзац в 2–3 строки: чем занимается компания и где работает.',
        kind: 'multiline',
      },
      { key: 'hero.cta', label: 'Основная кнопка', hint: 'Золотая кнопка — главное действие.' },
      {
        key: 'hero.ctaSecondary',
        label: 'Вторая кнопка',
        hint: 'Кнопка рядом, с прозрачным фоном.',
      },
    ],
  },
  {
    id: 'meta',
    title: 'Для поисковиков',
    description:
      'Заголовок и описание главной страницы в результатах Google и в превью при отправке ссылки в WhatsApp или Telegram.',
    where: 'на странице не видно',
    invisibleNote:
      'Эти тексты не показываются на самой странице. Их видно только в результатах поиска и в превью ссылки, поэтому в предпросмотре справа они не меняются.',
    fields: [
      {
        key: 'meta.title',
        label: 'Заголовок страницы (title)',
        hint: 'Синяя ссылка в результатах Google. Длиннее — обрежет многоточием.',
        limit: 60,
      },
      {
        key: 'meta.description',
        label: 'Описание (description)',
        hint: 'Серый текст под ссылкой в результатах поиска.',
        kind: 'multiline',
        limit: 155,
      },
      {
        key: 'meta.ogTitle',
        label: 'Заголовок для соцсетей',
        hint: 'Что видно, когда ссылку кидают в WhatsApp.',
      },
      {
        key: 'meta.ogDescription',
        label: 'Описание для соцсетей',
        hint: 'Подпись под картинкой в том же превью.',
        kind: 'multiline',
      },
    ],
  },
  {
    id: 'nav',
    title: 'Меню',
    description: 'Пункты верхнего меню — они же в мобильном меню.',
    where: 'шапка, на всех страницах',
    anchor: 'header',
    fields: [
      { key: 'nav.home', label: 'Главная' },
      { key: 'nav.services', label: 'Услуги' },
      { key: 'nav.about', label: 'О нас' },
      { key: 'nav.gallery', label: 'Проекты' },
      { key: 'nav.contact', label: 'Контакты' },
      { key: 'nav.callUs', label: 'Кнопка «Позвонить»', hint: 'Золотая кнопка справа в шапке.' },
    ],
  },
  {
    id: 'services',
    title: 'Блок услуг',
    description: 'Заголовок раздела с карточками категорий. Сами карточки меняются в «Каталоге».',
    where: '2-й блок сверху',
    anchor: '#services',
    fields: [
      { key: 'services.badge', label: 'Надпись над заголовком', hint: 'Мелкий золотой текст.' },
      { key: 'services.title', label: 'Заголовок' },
      { key: 'services.subtitle', label: 'Описание', hint: 'Строка под заголовком.', kind: 'multiline' },
      {
        key: 'services.learnMore',
        label: 'Ссылка «Подробнее»',
        hint: 'Повторяется на каждой карточке категории.',
      },
    ],
  },
  {
    id: 'whyUs',
    title: 'Почему мы',
    description: 'Заголовок блока с преимуществами. Сами преимущества пока меняются в коде.',
    where: 'после видео',
    anchor: '#why-us',
    fields: [
      { key: 'whyUs.badge', label: 'Надпись над заголовком' },
      { key: 'whyUs.title', label: 'Заголовок' },
      { key: 'whyUs.subtitle', label: 'Описание', kind: 'multiline' },
    ],
  },
  {
    id: 'contact',
    title: 'Контакты и заявка',
    description:
      'Заголовок блока с формой внизу главной. Сам телефон и адреса меняются в разделе «Контакты».',
    where: 'внизу главной',
    anchor: '#contact',
    fields: [
      { key: 'contact.badge', label: 'Надпись над заголовком' },
      { key: 'contact.title', label: 'Заголовок' },
      { key: 'contact.subtitle', label: 'Описание', kind: 'multiline' },
    ],
  },
  {
    id: 'cta',
    title: 'Призыв к действию',
    description: 'Золотая полоса перед подвалом — последнее, что видит посетитель.',
    where: 'перед подвалом',
    anchor: '#cta',
    fields: [
      { key: 'cta.badge', label: 'Надпись над заголовком', hint: 'Мелкий золотой текст.' },
      { key: 'cta.title', label: 'Заголовок', hint: 'Крупный вопрос по центру полосы.' },
      { key: 'cta.subtitle', label: 'Описание', hint: 'Строка под ним.', kind: 'multiline' },
      { key: 'cta.primary', label: 'Основная кнопка', hint: 'Открывает калькулятор стоимости.' },
      { key: 'cta.secondary', label: 'Вторая кнопка', hint: 'Ведёт в WhatsApp.' },
    ],
  },
]

export const ALL_FIELD_KEYS = FIELD_GROUPS.flatMap(g => g.fields.map(f => f.key))

export function findGroup(id: string): FieldGroup | undefined {
  return FIELD_GROUPS.find(g => g.id === id)
}
