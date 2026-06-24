export type Language = 'he' | 'ru'

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

export interface Testimonial {
  name: string
  text: string
  rating: number
  city: string
}
