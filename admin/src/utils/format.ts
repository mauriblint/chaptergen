export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatSize(bytes: number | null): string {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDuration(seconds: number | null): string {
  if (seconds == null || !Number.isFinite(seconds)) return '—'
  const total = Math.round(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

export function formatMoney(amountCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountCents / 100)
}

export function packLabel(pack: string): string {
  if (pack === 'starter') return 'Starter'
  if (pack === 'creator') return 'Creator'
  if (pack === 'studio') return 'Studio'
  return pack
}

/** AI costs are often fractions of a cent, so small amounts keep more decimals. */
export function formatUsd(value: number | null | undefined): string {
  if (value == null) return '—'
  if (value === 0) return '$0'
  const digits = value >= 100 ? 0 : value >= 1 ? 2 : value >= 0.01 ? 3 : 4
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatMinutes(seconds: number | null | undefined): string {
  if (seconds == null) return '—'
  const minutes = seconds / 60
  return `${minutes >= 10 ? Math.round(minutes).toLocaleString('en-US') : minutes.toFixed(1)} min`
}

export function formatPercent(value: number | null): string {
  return value == null || !Number.isFinite(value) ? '—' : `${Math.round(value * 100)}%`
}
