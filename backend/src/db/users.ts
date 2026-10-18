import crypto from 'crypto'
import { db } from './jobs.js'
import { parseAppLocale, type AppLocale } from '../types/locale.js'

export interface UserRecord {
  id: string
  email: string
  googleId: string | null
  stripeCustomerId: string | null
  creditsRemaining: number
  freeCredits: number
  freeGranted: boolean
  emailVerifiedAt: string | null
  locale: AppLocale
  createdAt: string
  lastLoginAt: string | null
}

interface UserRow {
  id: string
  email: string
  google_id: string | null
  stripe_customer_id: string | null
  credits_remaining: number
  free_credits: number | null
  free_granted: number | null
  email_verified_at: string | null
  locale: string
  created_at: string
  last_login_at: string | null
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    google_id TEXT UNIQUE,
    stripe_customer_id TEXT UNIQUE,
    credits_remaining INTEGER NOT NULL DEFAULT 0,
    locale TEXT NOT NULL DEFAULT 'en',
    created_at TEXT NOT NULL,
    last_login_at TEXT
  )
`)

const userColumnMigrations = [
  'ALTER TABLE users ADD COLUMN free_credits INTEGER NOT NULL DEFAULT 0',
  'ALTER TABLE users ADD COLUMN free_granted INTEGER NOT NULL DEFAULT 0',
  'ALTER TABLE users ADD COLUMN free_credits_granted INTEGER NOT NULL DEFAULT 0',
  'ALTER TABLE users ADD COLUMN email_verified_at TEXT',
  'ALTER TABLE users ADD COLUMN signup_ip TEXT',
  'ALTER TABLE users ADD COLUMN signup_client_id TEXT',
  'ALTER TABLE users ADD COLUMN signup_user_agent TEXT',
  'ALTER TABLE users ADD COLUMN signup_country TEXT',
  'ALTER TABLE users ADD COLUMN email_canonical TEXT',
]

for (const sql of userColumnMigrations) {
  try {
    db.exec(sql)
  } catch {
    // column already exists
  }
}

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_users_email_canonical ON users(email_canonical);
  CREATE INDEX IF NOT EXISTS idx_users_signup_ip ON users(signup_ip);
  CREATE INDEX IF NOT EXISTS idx_users_signup_client_id ON users(signup_client_id);
`)

function rowToUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    googleId: row.google_id,
    stripeCustomerId: row.stripe_customer_id,
    creditsRemaining: row.credits_remaining,
    freeCredits: row.free_credits ?? 0,
    freeGranted: row.free_granted === 1,
    emailVerifiedAt: row.email_verified_at,
    locale: parseAppLocale(row.locale),
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * The mailbox an address really delivers to, used to find accounts: drops
 * "+tag" aliases on any domain and, for Gmail, the dots it ignores. So
 * name+1@gmail.com and n.ame@gmail.com both reach name@gmail.com's account.
 */
export function canonicalEmail(email: string): string {
  const normalized = normalizeEmail(email)
  const at = normalized.lastIndexOf('@')
  if (at <= 0) return normalized
  let local = normalized.slice(0, at)
  let domain = normalized.slice(at + 1)
  if (domain === 'googlemail.com') domain = 'gmail.com'
  local = local.split('+')[0] || local
  if (domain === 'gmail.com') local = local.replace(/\./g, '')
  return `${local}@${domain}`
}

// Fill the canonical address for accounts created before it existed.
for (const row of db
  .prepare('SELECT id, email FROM users WHERE email_canonical IS NULL')
  .all() as { id: string; email: string }[]) {
  db.prepare('UPDATE users SET email_canonical = ? WHERE id = ?').run(canonicalEmail(row.email), row.id)
}

export function getUserById(id: string): UserRecord | null {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined
  return row ? rowToUser(row) : null
}

export function getUserByEmail(email: string): UserRecord | null {
  const row = db
    .prepare('SELECT * FROM users WHERE email_canonical = ? ORDER BY created_at LIMIT 1')
    .get(canonicalEmail(email)) as UserRow | undefined
  return row ? rowToUser(row) : null
}

export function getUserByStripeCustomerId(customerId: string): UserRecord | null {
  const row = db
    .prepare('SELECT * FROM users WHERE stripe_customer_id = ?')
    .get(customerId) as UserRow | undefined
  return row ? rowToUser(row) : null
}

export function createUser(input: {
  email: string
  locale?: AppLocale
  stripeCustomerId?: string | null
}): UserRecord {
  const now = new Date().toISOString()
  const id = crypto.randomBytes(16).toString('hex')
  db.prepare(`
    INSERT INTO users (id, email, email_canonical, credits_remaining, locale, stripe_customer_id, created_at, last_login_at)
    VALUES (?, ?, ?, 0, ?, ?, ?, ?)
  `).run(
    id,
    normalizeEmail(input.email),
    canonicalEmail(input.email),
    input.locale ?? 'en',
    input.stripeCustomerId ?? null,
    now,
    now
  )
  return getUserById(id)!
}

export function getOrCreateUserByEmail(input: {
  email: string
  locale?: AppLocale
  stripeCustomerId?: string | null
}): { user: UserRecord; created: boolean } {
  const existing = getUserByEmail(input.email)
  if (existing) {
    if (!existing.stripeCustomerId && input.stripeCustomerId) {
      setStripeCustomerId(existing.id, input.stripeCustomerId)
      return { user: getUserById(existing.id)!, created: false }
    }
    return { user: existing, created: false }
  }
  return { user: createUser(input), created: true }
}

export function setStripeCustomerId(userId: string, stripeCustomerId: string): void {
  db.prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ? AND stripe_customer_id IS NULL').run(
    stripeCustomerId,
    userId
  )
}

export function addCredits(userId: string, amount: number): void {
  db.prepare(
    'UPDATE users SET credits_remaining = credits_remaining + ? WHERE id = ?'
  ).run(amount, userId)
}

export function debitCredits(userId: string, amount: number): boolean {
  const result = db
    .prepare(
      'UPDATE users SET credits_remaining = credits_remaining - ? WHERE id = ? AND credits_remaining >= ?'
    )
    .run(amount, userId, amount)
  return result.changes === 1
}

export function subtractCreditsFloorZero(userId: string, amount: number): void {
  db.prepare(
    'UPDATE users SET credits_remaining = MAX(0, credits_remaining - ?) WHERE id = ?'
  ).run(amount, userId)
}

/**
 * Marks the email as verified and stores where the account was created from,
 * so later free-credit grants can be checked against the same IP or device.
 */
export function markEmailVerified(
  userId: string,
  signup: { ip: string | null; clientId: string | null; userAgent: string | null; country: string | null }
): void {
  db.prepare(`
    UPDATE users SET
      email_verified_at = COALESCE(email_verified_at, ?),
      signup_ip = COALESCE(signup_ip, ?),
      signup_client_id = COALESCE(signup_client_id, ?),
      signup_user_agent = COALESCE(signup_user_agent, ?),
      signup_country = COALESCE(signup_country, ?)
    WHERE id = ?
  `).run(new Date().toISOString(), signup.ip, signup.clientId, signup.userAgent, signup.country, userId)
}

export function grantFreeCredits(userId: string, amount: number): void {
  db.prepare(
    'UPDATE users SET free_credits = free_credits + ?, free_credits_granted = ?, free_granted = 1 WHERE id = ? AND free_granted = 0'
  ).run(amount, amount, userId)
}

/** Records that the free grant was considered, even when nothing was granted. */
export function markFreeGrantConsidered(userId: string): void {
  db.prepare('UPDATE users SET free_granted = 1 WHERE id = ?').run(userId)
}

export function debitFreeCredit(userId: string): boolean {
  const result = db
    .prepare('UPDATE users SET free_credits = free_credits - 1 WHERE id = ? AND free_credits >= 1')
    .run(userId)
  return result.changes === 1
}

export function addFreeCredits(userId: string, amount: number): void {
  db.prepare('UPDATE users SET free_credits = free_credits + ? WHERE id = ?').run(amount, userId)
}

/**
 * Free credits already handed to other accounts created from this device or,
 * within `ipSince`, from this IP. Uses the larger of the two so switching
 * networks or browsers alone does not reset it.
 */
export function countFreeGrantsBySignup(input: {
  ip: string | null
  clientId: string | null
  excludeUserId: string
  ipSince: string
}): number {
  const byDevice = input.clientId
    ? (db
        .prepare(
          'SELECT COALESCE(SUM(free_credits_granted), 0) AS total FROM users WHERE signup_client_id = ? AND id != ?'
        )
        .get(input.clientId, input.excludeUserId) as { total: number }).total
    : 0
  const byIp = input.ip
    ? (db
        .prepare(
          'SELECT COALESCE(SUM(free_credits_granted), 0) AS total FROM users WHERE signup_ip = ? AND id != ? AND created_at >= ?'
        )
        .get(input.ip, input.excludeUserId, input.ipSince) as { total: number }).total
    : 0
  return Math.max(byDevice, byIp)
}

export function updateUserLocale(userId: string, locale: AppLocale): void {
  db.prepare('UPDATE users SET locale = ? WHERE id = ?').run(locale, userId)
}

export function touchLastLogin(userId: string): void {
  db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').run(new Date().toISOString(), userId)
}

export interface AdminUserSummary extends UserRecord {
  jobCount: number
  paymentCount: number
}

interface AdminUserRow extends UserRow {
  job_count: number
  payment_count: number
}

export function listUsers(input: {
  limit: number
  offset: number
}): { users: AdminUserSummary[]; total: number } {
  const totalRow = db.prepare('SELECT COUNT(*) AS count FROM users').get() as { count: number }
  const rows = db
    .prepare(
      `
      SELECT
        users.*,
        (SELECT COUNT(*) FROM jobs WHERE jobs.user_id = users.id) AS job_count,
        (SELECT COUNT(*) FROM payments WHERE payments.user_id = users.id) AS payment_count
      FROM users
      ORDER BY users.created_at DESC
      LIMIT ? OFFSET ?
    `
    )
    .all(input.limit, input.offset) as AdminUserRow[]

  return {
    users: rows.map((row) => ({
      ...rowToUser(row),
      jobCount: row.job_count,
      paymentCount: row.payment_count,
    })),
    total: totalRow.count,
  }
}
