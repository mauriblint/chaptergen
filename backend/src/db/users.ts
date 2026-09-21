import crypto from 'crypto'
import { db } from './jobs.js'
import { parseAppLocale, type AppLocale } from '../types/locale.js'

export interface UserRecord {
  id: string
  email: string
  googleId: string | null
  stripeCustomerId: string | null
  creditsRemaining: number
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

function rowToUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    googleId: row.google_id,
    stripeCustomerId: row.stripe_customer_id,
    creditsRemaining: row.credits_remaining,
    locale: parseAppLocale(row.locale),
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function getUserById(id: string): UserRecord | null {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined
  return row ? rowToUser(row) : null
}

export function getUserByEmail(email: string): UserRecord | null {
  const row = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(normalizeEmail(email)) as UserRow | undefined
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
    INSERT INTO users (id, email, credits_remaining, locale, stripe_customer_id, created_at, last_login_at)
    VALUES (?, ?, 0, ?, ?, ?, ?)
  `).run(
    id,
    normalizeEmail(input.email),
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

export function updateUserLocale(userId: string, locale: AppLocale): void {
  db.prepare('UPDATE users SET locale = ? WHERE id = ?').run(locale, userId)
}

export function touchLastLogin(userId: string): void {
  db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').run(new Date().toISOString(), userId)
}
