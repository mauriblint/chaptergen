export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://chaptergen.com'
export const BRAND_NAME = 'ChapterGen'
// Public contact address (forwarded via Cloudflare Email Routing).
export const SUPPORT_EMAIL = 'hello@chaptergen.com'

export interface FAQItem {
  question: string
  answer: string
}

export interface StepItem {
  title: string
  description: string
}

export interface UseCaseItem {
  title: string
  description: string
  link?: string
  linkLabel?: string
}

export interface ChapterExample {
  time: string
  title: string
}

export interface PreviewContent {
  fileName: string
  duration: string
  label: string
  copy: string
  refine: string
  activeIndex: number
  chapters: ChapterExample[]
}

export interface PlanTeaser {
  name: string
  price: string
  unit?: string
  badge?: string
  features: string[]
  cta: string
  featured?: boolean
}
