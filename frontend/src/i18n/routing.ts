export const LOCALES = ['en', 'es'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'cg_lang'

interface PathPair {
  en: string
  es: string
}

const PATH_PAIRS: PathPair[] = [
  { en: '/', es: '/es' },
  { en: '/podcast-chapters', es: '/es/capitulos-podcast' },
]

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/**
 * Returns the locale a given path belongs to, based on the `/es` prefix.
 */
export function localeFromPath(path: string): Locale {
  if (path === '/es' || path.startsWith('/es/')) return 'es'
  return 'en'
}

/**
 * Given a path, returns the equivalent path in the target locale.
 * Falls back to the locale root when no explicit mapping exists.
 */
export function localizedPath(path: string, target: Locale): string {
  const normalized = path.replace(/\/+$/, '') || '/'
  const pair = PATH_PAIRS.find((p) => p.en === normalized || p.es === normalized)
  if (pair) return pair[target]
  return target === 'es' ? '/es' : '/'
}
