import crypto from 'crypto'
import { db } from './jobs.js'
import type { PackId } from '../billing/packs.js'

export type PaymentStatus = 'paid' | 'refunded'

export interface PaymentRecord {
  id: string
  userId: string
  stripeCheckoutSessionId: string
  stripePaymentIntentId: string | null
  pack: PackId
  creditsGranted: number
  amountCents: number
  status: PaymentStatus
  createdAt: string
}

interface PaymentRow {
  id: string
  user_id: string
  stripe_checkout_session_id: string
  stripe_payment_intent_id: string | null
  pack: PackId
  credits_granted: number
  amount_cents: number
  status: PaymentStatus
  created_at: string
}

db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    stripe_checkout_session_id TEXT NOT NULL UNIQUE,
    stripe_payment_intent_id TEXT,
    pack TEXT NOT NULL,
    credits_granted INTEGER NOT NULL,
    amount_cents INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
  CREATE INDEX IF NOT EXISTS idx_payments_payment_intent ON payments(stripe_payment_intent_id);
`)

function rowToPayment(row: PaymentRow): PaymentRecord {
  return {
    id: row.id,
    userId: row.user_id,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    pack: row.pack,
    creditsGranted: row.credits_granted,
    amountCents: row.amount_cents,
    status: row.status,
    createdAt: row.created_at,
  }
}

export function getPaymentBySessionId(sessionId: string): PaymentRecord | null {
  const row = db
    .prepare('SELECT * FROM payments WHERE stripe_checkout_session_id = ?')
    .get(sessionId) as PaymentRow | undefined
  return row ? rowToPayment(row) : null
}

export function getPaymentByPaymentIntentId(paymentIntentId: string): PaymentRecord | null {
  const row = db
    .prepare('SELECT * FROM payments WHERE stripe_payment_intent_id = ?')
    .get(paymentIntentId) as PaymentRow | undefined
  return row ? rowToPayment(row) : null
}

export function insertPayment(input: {
  userId: string
  stripeCheckoutSessionId: string
  stripePaymentIntentId: string | null
  pack: PackId
  creditsGranted: number
  amountCents: number
}): PaymentRecord {
  const now = new Date().toISOString()
  const id = crypto.randomBytes(16).toString('hex')
  db.prepare(`
    INSERT INTO payments (
      id, user_id, stripe_checkout_session_id, stripe_payment_intent_id,
      pack, credits_granted, amount_cents, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'paid', ?)
  `).run(
    id,
    input.userId,
    input.stripeCheckoutSessionId,
    input.stripePaymentIntentId,
    input.pack,
    input.creditsGranted,
    input.amountCents,
    now
  )
  return getPaymentBySessionId(input.stripeCheckoutSessionId)!
}

export function listPaymentsByUserId(userId: string): PaymentRecord[] {
  const rows = db
    .prepare('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId) as PaymentRow[]
  return rows.map(rowToPayment)
}

export function markPaymentRefunded(id: string): void {
  db.prepare(`UPDATE payments SET status = 'refunded' WHERE id = ? AND status = 'paid'`).run(id)
}
