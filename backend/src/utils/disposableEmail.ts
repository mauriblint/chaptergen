// Common throwaway-inbox providers. Not exhaustive: it catches the casual
// "new email for new free credits" case, which is most of the abuse.
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', '10minutemail.net', '20minutemail.com', 'anonaddy.me', 'burnermail.io',
  'byom.de', 'cock.li', 'deadaddress.com', 'discard.email', 'discardmail.com', 'dispostable.com',
  'dropmail.me', 'emailondeck.com', 'emailfake.com', 'fakeinbox.com', 'fakemail.net',
  'getairmail.com', 'getnada.com', 'guerrillamail.biz', 'guerrillamail.com', 'guerrillamail.de',
  'guerrillamail.info', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com',
  'harakirimail.com', 'inboxbear.com', 'inboxkitten.com', 'jetable.org', 'mail-temp.com',
  'mail.tm', 'mailcatch.com', 'maildrop.cc', 'mailinator.com', 'mailinator.net', 'mailinator2.com',
  'mailnesia.com', 'mailpoof.com', 'mailsac.com', 'mintemail.com', 'mohmal.com', 'moakt.com',
  'mytemp.email', 'nada.email', 'emlhub.com', 'one-time.email', 'sharklasers.com', 'spam4.me',
  'spambox.us', 'spamgourmet.com', 'temp-mail.io', 'temp-mail.org', 'tempail.com', 'tempinbox.com',
  'tempm.com', 'tempmail.com', 'tempmail.dev', 'tempmail.net', 'tempmail.plus', 'tempmailo.com',
  'tempr.email', 'throwawaymail.com', 'tmail.ws', 'tmpmail.net', 'tmpmail.org', 'trashmail.com',
  'trashmail.de', 'trashmail.net', 'wegwerfmail.de', 'yopmail.com', 'yopmail.fr', 'yopmail.net',
  'zetmail.com', 'linshiyouxiang.net', 'minuteinbox.com', 'emailtemporal.org', 'correotemporal.org',
  'luxusmail.org', 'smailpro.com', 'internxt.com', 'chitthi.in', 'grr.la', 'pokemail.net',
])

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  if (DISPOSABLE_DOMAINS.has(domain)) return true
  // Catch subdomains such as foo.mailinator.com
  return [...DISPOSABLE_DOMAINS].some((d) => domain.endsWith(`.${d}`))
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email)
}
