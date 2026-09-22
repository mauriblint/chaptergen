export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDuration(seconds: number | null | undefined): string | null {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return null
  const total = Math.round(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

export function formatFileKind(fileName: string, fileExtension?: string | null): string | null {
  const raw = (fileExtension || fileName.split('.').pop() || '').replace(/^\./, '').trim()
  if (!raw || raw === fileName) return null
  return raw.toUpperCase()
}
