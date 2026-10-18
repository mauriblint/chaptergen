import { readFileSync } from 'node:fs'

// ~100k throwaway-inbox domains, merged from public lists on GitHub by
// scripts/update-disposable-domains.mjs (`npm run update:disposable`).
// Resolved from this file so it works from both src/ and dist/.
const LIST_URL = new URL('../../resources/disposable-domains.txt', import.meta.url)

function loadDomains(): Set<string> {
  try {
    const lines = readFileSync(LIST_URL, 'utf8').split('\n')
    return new Set(lines.map((l) => l.trim()).filter(Boolean))
  } catch (err) {
    console.error('Could not load the disposable email list:', err)
    return new Set()
  }
}

const DISPOSABLE_DOMAINS = loadDomains()

/** True for listed domains and their subdomains (foo.mailinator.com). */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  const labels = domain.split('.')
  for (let i = 0; i < labels.length - 1; i++) {
    if (DISPOSABLE_DOMAINS.has(labels.slice(i).join('.'))) return true
  }
  return false
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email)
}
