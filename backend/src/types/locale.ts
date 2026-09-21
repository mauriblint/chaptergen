export const APP_LOCALES = ['en', 'es'] as const
export type AppLocale = (typeof APP_LOCALES)[number]

export function isAppLocale(value: unknown): value is AppLocale {
  return value === 'en' || value === 'es'
}

export function parseAppLocale(value: unknown, fallback: AppLocale = 'en'): AppLocale {
  return isAppLocale(value) ? value : fallback
}
