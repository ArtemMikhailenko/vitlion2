/**
 * The panel's map.
 *
 * Grouped rather than flat: the operator's day is "check the new enquiries",
 * not "browse eight equivalent screens". Everything that changes daily sits at
 * the top, everything that changes a few times a year sits at the bottom, and
 * the group headings say which is which — so a section that looks unfamiliar
 * can be ignored with confidence instead of clicked warily.
 */

export type IconName =
  | 'inbox'
  | 'home'
  | 'catalog'
  | 'question'
  | 'photo'
  | 'search'
  | 'phone'
  | 'user'

export interface NavItem {
  href: string
  label: string
  icon: IconName
  /** One line under the label, so the section explains itself before it is opened. */
  hint: string
  exact?: boolean
  /** Shows the count of unhandled enquiries. */
  badge?: 'leads'
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Каждый день',
    items: [
      {
        href: '/admin',
        label: 'Обзор',
        icon: 'home',
        hint: 'Что нового и что где менять',
        exact: true,
      },
      {
        href: '/admin/leads',
        label: 'Заявки',
        icon: 'inbox',
        hint: 'Обращения с сайта',
        badge: 'leads',
      },
    ],
  },
  {
    title: 'Содержание сайта',
    items: [
      { href: '/admin/texts', label: 'Главная страница', icon: 'home', hint: 'Заголовки и кнопки' },
      { href: '/admin/catalog', label: 'Каталог', icon: 'catalog', hint: 'Категории и модели' },
      { href: '/admin/faq', label: 'Вопросы и ответы', icon: 'question', hint: 'Блок FAQ' },
      { href: '/admin/media', label: 'Фотографии', icon: 'photo', hint: 'Библиотека изображений' },
    ],
  },
  {
    title: 'Настройки',
    items: [
      { href: '/admin/contacts', label: 'Контакты', icon: 'phone', hint: 'Телефон, адреса, соцсети' },
      { href: '/admin/pages', label: 'Для поисковиков', icon: 'search', hint: 'Заголовки в Google' },
      { href: '/admin/account', label: 'Учётная запись', icon: 'user', hint: 'Смена пароля' },
    ],
  },
]

export const NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items)
