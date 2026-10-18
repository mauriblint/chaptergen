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
  { en: '/pricing', es: '/es/precios' },
  { en: '/video-to-text', es: '/es/video-a-texto' },
  { en: '/subtitle-generator', es: '/es/generador-de-subtitulos' },
  { en: '/about', es: '/es/acerca-de' },
  { en: '/privacy', es: '/es/privacidad' },
  { en: '/terms', es: '/es/terminos' },
]

/** Returns the [en, es] pair a marketing path belongs to, if any. */
export function pathPair(path: string): PathPair | undefined {
  const normalized = path.replace(/\/+$/, '') || '/'
  return PATH_PAIRS.find((p) => p.en === normalized || p.es === normalized)
}

export const APP_PATHS = ['/library', '/new', '/login', '/settings', '/billing'] as const

export function isAuthPath(path: string): boolean {
  return path === '/library' || path === '/new' || path === '/settings' || path === '/billing'
}

/** App screens share one URL for both languages; the locale comes from the account. */
export function isAppPath(path: string): boolean {
  return path === '/login' || isAuthPath(path) || path.startsWith('/videos/')
}

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
  if (isAppPath(normalized)) return normalized
  const pair = PATH_PAIRS.find((p) => p.en === normalized || p.es === normalized)
  if (pair) return pair[target]
  return target === 'es' ? '/es' : '/'
}
