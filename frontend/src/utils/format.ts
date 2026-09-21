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
