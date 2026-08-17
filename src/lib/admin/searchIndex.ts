import { CATEGORIES } from '@/data/services'
import { FIELD_GROUPS } from './fields'
import { EDITABLE_LISTS } from './lists'
import { NAV_ITEMS } from './nav'

export interface SearchEntry {
  label: string
  /** Where the match lives, shown under the label. */
  context: string
  href: string
  /** Extra words that should match but need not be displayed. */
  keywords?: string
}

/**
 * Everything the panel can jump to, in one flat list.
 *
 * Built from the same manifests the screens render from, so it cannot go stale:
 * a field added to FIELD_GROUPS or a model added to CATEGORIES is searchable
 * without anyone remembering to update an index. This is the answer to "куда
 * идти, чтобы поменять телефон" — the question the sidebar alone cannot answer.
 */
export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const item of NAV_ITEMS) {
    entries.push({ label: item.label, context: 'Раздел панели', href: item.href, keywords: item.hint })
  }

  for (const group of FIELD_GROUPS) {
    for (const field of group.fields) {
      entries.push({
        label: field.label,
        context: `Главная страница · ${group.title}`,
        href: '/admin/texts',
        keywords: `${field.hint ?? ''} ${field.key}`,
      })
    }
  }

  for (const category of CATEGORIES) {
    entries.push({
      label: category.name.ru,
      context: 'Категория каталога',
      href: `/admin/catalog/${category.slug}`,
      keywords: `${category.name.he} ${category.slug}`,
    })
    entries.push({
      label: `${category.name.ru} — текст на странице`,
      context: 'Текст категории',
      href: `/admin/catalog/${category.slug}/text`,
      keywords: category.slug,
    })

    for (const service of category.services) {
      entries.push({
        label: service.name.ru,
        context: `Модель · ${category.name.ru}`,
        href: `/admin/catalog/${category.slug}/${service.slug}`,
        keywords: `${service.name.he} ${service.slug}`,
      })
    }
  }

  for (const list of EDITABLE_LISTS) {
    entries.push({
      label: list.title,
      context: `Блоки на страницах · ${list.where}`,
      href: `/admin/lists?block=${list.id}`,
      keywords: list.description,
    })
  }

  entries.push(
    { label: 'Телефон', context: 'Контакты', href: '/admin/contacts', keywords: 'номер звонок tel' },
    { label: 'WhatsApp', context: 'Контакты', href: '/admin/contacts', keywords: 'ватсап вацап' },
    { label: 'Почта', context: 'Контакты', href: '/admin/contacts', keywords: 'email мейл почта' },
    { label: 'Адрес офиса', context: 'Контакты', href: '/admin/contacts', keywords: 'адрес офис' },
    {
      label: 'Instagram, Facebook, TikTok, YouTube',
      context: 'Контакты',
      href: '/admin/contacts',
      keywords: 'соцсети инстаграм фейсбук тикток ютуб',
    },
    { label: 'Смена пароля', context: 'Учётная запись', href: '/admin/account', keywords: 'пароль вход' },
  )

  return entries
}
