import type { Request, Response } from 'express'
import { getStripe, fulfillCheckoutSession, notifyPurchaseIfNew, refundPaymentIntent } from '../billing/fulfill.js'

export async function stripeWebhookHandler(req: Request, res: Response): Promise<void> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    res.status(503).json({ error: 'Webhook is not configured' })
    return
  }

  const signature = req.headers['stripe-signature']
  if (typeof signature !== 'string') {
    res.status(400).json({ error: 'Missing stripe-signature' })
    return
  }

  let event
  try {
    event = getStripe().webhooks.constructEvent(req.body, signature, secret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    res.status(400).json({ error: message })
    return
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const result = fulfillCheckoutSession(event.data.object)
      void notifyPurchaseIfNew(result)
    } else if (event.type === 'charge.refunded') {
      const charge = event.data.object
      const paymentIntent =
        typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.payment_intent?.id
      if (paymentIntent) refundPaymentIntent(paymentIntent)
    }
    res.json({ received: true })
  } catch (err) {
    console.error('Stripe webhook handler error:', err)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
}
