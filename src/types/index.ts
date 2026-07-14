export type Language = 'he' | 'ru' | 'en'

export interface ServiceFeature {
  icon: string
  text: string
}

export interface Service {
  id: string
  slug: string
  icon: string
  nameKey: string
  shortKey: string
  descriptionKey: string
  featuresKey: string
  image: string
  gallery: string[]
  category: 'pergola' | 'glazing' | 'doors' | 'curtains'
}

export interface ServiceItem {
  id: string
  slug: string
  mainImage: string
  gallery: string[]
  name: { he: string; ru: string }
  short: { he: string; ru: string }
  description: { he: string; ru: string }
  features: { he: string[]; ru: string[] }
}

export interface ServiceCategory {
  id: string
  slug: string
  mainImage: string
  name: { he: string; ru: string }
  short: { he: string; ru: string }
  services: ServiceItem[]
}

export interface Testimonial {
  name: string
  text: string
  rating: number
  city: string
}
