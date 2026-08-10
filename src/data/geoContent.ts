/**
 * GEO/SEO content authored from "SEO_GEO при миграции Vitlion на Next.js SSR".
 *
 * Why this file exists: generative engines (and Google) reward content that
 * answers concrete, verifiable questions. The competitor audit in that document
 * found that none of Klil / Sun-Tech / Tzlalit / Silvergate answer the building
 * permit question (היתר בנייה) — the single most-asked practical question in
 * this niche in Israel. Answering it honestly is the clearest citation win
 * available, so it leads the FAQ.
 *
 * Everything here is rendered server-side and mirrored into FAQPage /
 * LocalBusiness JSON-LD, so crawlers and AI bots read it without running JS.
 */

import type { Lang } from '@/lib/i18n'
import { FAQ_BRIEF } from './briefContent'

export interface FaqItem {
  question: string
  answer: string
}

export interface ServiceRegion {
  /** Region label, e.g. "מרכז" / "Центр". */
  name: string
  /** Cities served in that region — also fed into JSON-LD `areaServed`. */
  cities: string[]
}

export interface GeoBlock {
  heading: string
  body: string[]
}

export interface GeoContent {
  serviceArea: {
    heading: string
    intro: string
    regions: ServiceRegion[]
    /** Same measurement promise everywhere, regardless of distance. */
    note: string
  }
  timeline: GeoBlock
  costFactors: GeoBlock
  faq: {
    heading: string
    items: FaqItem[]
  }
}

const he: GeoContent = {
  serviceArea: {
    heading: 'אזור השירות - פועלים בכל רחבי הארץ',
    intro: 'Vitlion Group מבצעת פרויקטים בכל אזורי הארץ:',
    regions: [
      { name: 'מרכז', cities: ['תל אביב', 'ראשון לציון', 'פתח תקווה', 'רמת גן'] },
      { name: 'צפון', cities: ['חיפה', 'כרמיאל', 'נהריה'] },
      { name: 'דרום', cities: ['באר שבע', 'אשדוד', 'אשקלון'] },
    ],
    note: 'לכל פנייה אנחנו שולחים איש מקצוע למדידה במקום, ללא קשר למרחק מהמפעל, כך שהאיכות וזמן התגובה נשארים אחידים בכל הארץ.',
  },

  timeline: {
    heading: 'לוחות זמנים - מהפנייה ועד ההתקנה',
    body: [
      'התהליך בנוי משלבים קצרים וברורים: מדידה מקצועית באתר מתקיימת בדרך כלל תוך ימים ספורים מהפנייה הראשונה, הצעת מחיר מדויקת מתקבלת תוך יום-יומיים מהמדידה, וזמן הייצור במפעל משתנה בהתאם למורכבות המבנה - פרגולה קבועה בגודל סטנדרטי מוכנה בפרק זמן קצר יותר מפרגולה חשמלית עם תוספות מיוחדות.',
      'ההתקנה בשטח, ברוב המקרים, נמשכת יום עבודה אחד. מרגע האישור ועד למבנה המוגמר מדובר בדרך כלל בפרק זמן של מספר שבועות, כשהטווח המדויק נמסר כחלק מהצעת המחיר בהתאם להיקף הפרויקט.',
    ],
  },

  costFactors: {
    heading: 'מה משפיע על העלות',
    body: [
      'העלות של פרגולה או פתרון זיגוג נקבעת לפי כמה גורמים: גודל השטח ומספר הקורות הנדרשות, סוג הבקרה (שלט, מתג קיר או חיבור לאפליקציה ולבית חכם), רמת ההתאמה האישית - צבע RAL, עיצוב השלבים וסוג הזכוכית - וכן תוספות כמו חיישני רוח וגשם או תאורת LED משולבת.',
      'מכיוון שכל מבנה מיוצר לפי מידה, אין מחיר אחיד: המדידה החינמית באתר היא השלב שמאפשר לנו להכין הצעת מחיר מדויקת ומותאמת לצרכים ולתקציב שלכם, ללא כל התחייבות.',
    ],
  },

  faq: {
    heading: 'שאלות נפוצות',
    items: FAQ_BRIEF.he,
  },
}

const ru: GeoContent = {
  serviceArea: {
    heading: 'Обслуживаемая территория — работаем по всей стране',
    intro: 'Группа Vitlion реализует проекты во всех регионах страны:',
    regions: [
      { name: 'Центр', cities: ['Тель-Авив', 'Ришон-ле-Цион', 'Петах-Тиква', 'Рамат-Ган'] },
      { name: 'Север', cities: ['Хайфа', 'Кармиэль', 'Нагария'] },
      { name: 'Юг', cities: ['Беэр-Шева', 'Ашдод', 'Ашкелон'] },
    ],
    note: 'Для каждого заказа мы направляем специалиста для замеров на месте, независимо от расстояния до завода, чтобы качество и скорость выполнения работ оставались одинаковыми по всей стране.',
  },

  timeline: {
    heading: 'Сроки — от обращения до установки',
    body: [
      'Процесс состоит из коротких и понятных этапов: профессиональный замер на месте обычно проводится в течение нескольких дней после первого контакта, точная смета готовится в течение одного-двух дней после замера, а время изготовления на заводе зависит от сложности конструкции — стандартная стационарная пергола готова в более короткие сроки, чем электрическая пергола со специальными дополнениями.',
      'Установка на месте в большинстве случаев занимает один рабочий день. С момента согласования до готовой конструкции обычно проходит несколько недель, точный диапазон указывается в смете в зависимости от масштаба проекта.',
    ],
  },

  costFactors: {
    heading: 'Что влияет на стоимость',
    body: [
      'Стоимость перголы или остекления определяется несколькими факторами: размером площади и количеством необходимых балок, типом управления (дистанционное управление, настенный выключатель или подключение к приложению и системе «умный дом»), уровнем индивидуализации — цветом RAL, дизайном ламелей и типом стекла — а также дополнительными опциями, такими как датчики ветра и дождя или встроенное светодиодное освещение.',
      'Поскольку каждая конструкция изготавливается на заказ, единой цены нет: бесплатный замер на объекте — это этап, который позволяет нам подготовить точную смету, адаптированную к вашим потребностям и бюджету, без каких-либо обязательств.',
    ],
  },

  faq: {
    heading: 'Часто задаваемые вопросы',
    items: FAQ_BRIEF.ru,
  },
}

export const GEO_CONTENT: Record<Lang, GeoContent> = { he, ru }

export function getGeoContent(lang: Lang): GeoContent {
  return GEO_CONTENT[lang]
}

/** Flat city list for JSON-LD `areaServed`. */
export function servedCities(lang: Lang): string[] {
  return GEO_CONTENT[lang].serviceArea.regions.flatMap(r => r.cities)
}
