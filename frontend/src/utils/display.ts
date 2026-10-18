import { languageCode } from './languages'

type Translate = (key: string, values?: Record<string, unknown>) => string

export function languageName(code: string | null | undefined, locale: string): string | null {
  if (!code) return null
  // Whisper reports languages as English names ("spanish") or ISO codes.
  const iso = languageCode(code) ?? code.toLowerCase()
  try {
    const name = new Intl.DisplayNames([locale], { type: 'language' }).of(iso)
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : code
  } catch {
    return code.charAt(0).toUpperCase() + code.slice(1)
  }
}

/** "Today, 14:32", "Yesterday" or a short date. */
export function relativeDate(iso: string, locale: string, t: Translate): string {
  const date = new Date(iso)
  const now = new Date()
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000)
  const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  if (days === 0) return t('app.dates.today', { time })
  if (days === 1) return t('app.dates.yesterday')
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  })
}

export function formatBytes(bytes: number | null | undefined): string | null {
  if (bytes == null || bytes <= 0) return null
  const mb = bytes / (1024 * 1024)
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.max(1, Math.round(mb))} MB`
}
