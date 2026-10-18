import crypto from 'crypto'
import { db } from './jobs.js'

/** Codes are short-lived and single-use; only a hash is stored. */
const CODE_TTL_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5

db.exec(`
  CREATE TABLE IF NOT EXISTS email_codes (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    consumed_at TEXT,
    expires_at TEXT NOT NULL,
    client_ip TEXT,
    client_id TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_email_codes_email ON email_codes(email);
  CREATE INDEX IF NOT EXISTS idx_email_codes_ip ON email_codes(client_ip);
`)

function hashCode(email: string, code: string): string {
  const secret = process.env.AUTH_SECRET ?? 'dev-secret'
  return crypto.createHmac('sha256', secret).update(`${email}:${code}`).digest('hex')
}

export function generateCode(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')
}

export function createEmailCode(input: {
  email: string
  code: string
  clientIp: string | null
  clientId: string | null
  userAgent: string | null
}): void {
  const now = Date.now()
  // A new code replaces any earlier one for the same email.
  db.prepare('UPDATE email_codes SET consumed_at = ? WHERE email = ? AND consumed_at IS NULL').run(
    new Date(now).toISOString(),
    input.email
  )
  db.prepare(`
    INSERT INTO email_codes (id, email, code_hash, expires_at, client_ip, client_id, user_agent, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomBytes(12).toString('hex'),
    input.email,
    hashCode(input.email, input.code),
    new Date(now + CODE_TTL_MS).toISOString(),
    input.clientIp,
    input.clientId,
    input.userAgent,
    new Date(now).toISOString()
  )
}

export type VerifyCodeResult = 'ok' | 'invalid' | 'expired' | 'too_many_attempts'

export function verifyEmailCode(email: string, code: string): VerifyCodeResult {
  const row = db
    .prepare(
      'SELECT id, code_hash, attempts, expires_at FROM email_codes WHERE email = ? AND consumed_at IS NULL ORDER BY created_at DESC LIMIT 1'
    )
    .get(email) as { id: string; code_hash: string; attempts: number; expires_at: string } | undefined
  if (!row) return 'expired'
  if (Date.parse(row.expires_at) < Date.now()) return 'expired'
  if (row.attempts >= MAX_ATTEMPTS) return 'too_many_attempts'

  const expected = Buffer.from(row.code_hash, 'hex')
  const actual = Buffer.from(hashCode(email, code), 'hex')
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    db.prepare('UPDATE email_codes SET attempts = attempts + 1 WHERE id = ?').run(row.id)
    return row.attempts + 1 >= MAX_ATTEMPTS ? 'too_many_attempts' : 'invalid'
  }

  db.prepare('UPDATE email_codes SET consumed_at = ? WHERE id = ?').run(new Date().toISOString(), row.id)
  return 'ok'
}

/** Codes requested in the last `windowMs`, by email or by IP, for rate limiting. */
export function countRecentCodes(input: { email?: string; clientIp?: string | null; windowMs: number }): number {
  const since = new Date(Date.now() - input.windowMs).toISOString()
  if (input.email) {
    const row = db
      .prepare('SELECT COUNT(*) AS count FROM email_codes WHERE email = ? AND created_at >= ?')
      .get(input.email, since) as { count: number }
    return row.count
  }
  if (input.clientIp) {
    const row = db
      .prepare('SELECT COUNT(*) AS count FROM email_codes WHERE client_ip = ? AND created_at >= ?')
      .get(input.clientIp, since) as { count: number }
    return row.count
  }
  return 0
}
