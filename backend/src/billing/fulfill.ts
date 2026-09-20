import Stripe from 'stripe'
import { db } from '../db/jobs.js'
import {
  addCredits,
  getOrCreateUserByEmail,
  getUserById,
  setStripeCustomerId,
  subtractCreditsFloorZero,
  type UserRecord,
} from '../db/users.js'
import {
  getPaymentByPaymentIntentId,
  getPaymentBySessionId,
  insertPayment,
  markPaymentRefunded,
  type PaymentRecord,
} from '../db/payments.js'
import { isPackId, packFromPriceId, PACKS, type PackId } from './packs.js'
import { parseAppLocale, type AppLocale } from '../types/locale.js'
import { sendPurchaseEmail } from '../services/email.js'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key)
  }
  return stripeClient
}

function customerIdFromSession(session: Stripe.Checkout.Session): string | null {
  if (typeof session.customer === 'string') return session.customer
  if (session.customer && typeof session.customer === 'object' && 'id' in session.customer) {
    return session.customer.id
  }
  return null
}

function emailFromSession(session: Stripe.Checkout.Session): string | null {
  const email = session.customer_details?.email ?? session.customer_email
  return email?.trim() ? email.trim() : null
}

function packFromSession(session: Stripe.Checkout.Session): PackId | null {
  const metaPack = session.metadata?.pack
  if (isPackId(metaPack)) return metaPack
  const item = session.line_items?.data[0]
  const price = item?.price
  const priceId = typeof price === 'string' ? price : price?.id
  if (!priceId) return null
  return packFromPriceId(priceId)?.id ?? null
}

function paymentIntentIdFromSession(session: Stripe.Checkout.Session): string | null {
  if (typeof session.payment_intent === 'string') return session.payment_intent
  if (session.payment_intent && typeof session.payment_intent === 'object') {
    return session.payment_intent.id
  }
  return null
}

export async function retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  })
}

export function fulfillCheckoutSession(session: Stripe.Checkout.Session): {
  user: UserRecord
  payment: PaymentRecord
  created: boolean
} | null {
  if (session.mode !== 'payment') return null
  if (session.payment_status !== 'paid' && session.status !== 'complete') return null

  const email = emailFromSession(session)
  if (!email) return null

  const packId = packFromSession(session)
  if (!packId) return null

  const pack = PACKS[packId]
  const customerId = customerIdFromSession(session)
  const locale = parseAppLocale(session.metadata?.locale)

  return db.transaction(() => {
    const existing = getPaymentBySessionId(session.id)
    if (existing) {
      const user = getUserById(existing.userId)
      if (!user) return null
      return { user, payment: existing, created: false }
    }

    const { user } = getOrCreateUserByEmail({
      email,
      locale,
      stripeCustomerId: customerId,
    })
    if (customerId) setStripeCustomerId(user.id, customerId)

    const payment = insertPayment({
      userId: user.id,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentIdFromSession(session),
      pack: packId,
      creditsGranted: pack.credits,
      amountCents: session.amount_total ?? pack.amountCents,
    })
    addCredits(user.id, pack.credits)
    const updated = getUserById(user.id)!
    return { user: updated, payment, created: true }
  })()
}

export async function notifyPurchaseIfNew(
  result: { user: UserRecord; payment: PaymentRecord; created: boolean } | null
): Promise<void> {
  if (!result?.created) return
  await sendPurchaseEmail({
    email: result.user.email,
    locale: result.user.locale,
    creditsGranted: result.payment.creditsGranted,
    creditsRemaining: result.user.creditsRemaining,
  })
}

export function refundPaymentIntent(paymentIntentId: string): void {
  db.transaction(() => {
    const payment = getPaymentByPaymentIntentId(paymentIntentId)
    if (!payment || payment.status === 'refunded') return
    markPaymentRefunded(payment.id)
    subtractCreditsFloorZero(payment.userId, payment.creditsGranted)
  })()
}
