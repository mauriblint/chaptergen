export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://chaptergen.com'
export const BRAND_NAME = 'ChapterGen'

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
