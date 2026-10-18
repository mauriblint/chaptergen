// Rebuilds resources/disposable-domains.txt from public, maintained lists of
// throwaway-inbox domains. Run with `npm run update:disposable` now and then.
import { writeFile } from 'node:fs/promises'

const SOURCES = [
  'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt',
  'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf',
  'https://raw.githubusercontent.com/7c/fakefilter/main/txt/data.txt',
]

// Never blocked, even if a list adds them by mistake.
const ALLOW = new Set([
  'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'yahoo.com',
  'icloud.com', 'me.com', 'mac.com', 'proton.me', 'protonmail.com', 'pm.me', 'gmx.com', 'gmx.de',
  'gmx.net', 'web.de', 'yandex.com', 'yandex.ru', 'mail.ru', 'aol.com', 'zoho.com', 'qq.com',
  '163.com', '126.com', 'fastmail.com', 'hey.com', 'tutanota.com', 'tuta.io', 'duck.com',
])

const DOMAIN = /^[a-z0-9.-]+\.[a-z]{2,}$/
const domains = new Set()

for (const url of SOURCES) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  let added = 0
  for (const line of (await res.text()).split('\n')) {
    const domain = line.replace(/#.*/, '').trim().toLowerCase()
    if (DOMAIN.test(domain) && !ALLOW.has(domain) && !domains.has(domain)) {
      domains.add(domain)
      added++
    }
  }
  console.log(`${url}: +${added}`)
}

const file = new URL('../resources/disposable-domains.txt', import.meta.url)
await writeFile(file, [...domains].sort().join('\n') + '\n')
console.log(`Wrote ${domains.size} domains`)
