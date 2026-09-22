import { Router, type Request, type Response } from 'express'
import {
  isPackId,
  PACK_LIST,
  publicSiteUrl,
  stripePriceId,
} from '../billing/packs.js'
import { parseAppLocale } from '../types/locale.js'
import { extractRequestMeta } from '../utils/requestMeta.js'
import {
  fulfillCheckoutSession,
  getStripe,
  notifyPurchaseIfNew,
  retrieveCheckoutSession,
} from '../billing/fulfill.js'
import { establishSession } from '../auth/session.js'

export const billingRouter = Router()

billingRouter.get('/billing/packs', (_req: Request, res: Response) => {
  res.json({ packs: PACK_LIST })
})

billingRouter.post('/billing/checkout', async (req: Request, res: Response) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(503).json({ error: 'Payments are not configured' })
    return
  }

  const packId = req.body?.pack
  if (!isPackId(packId)) {
    res.status(400).json({ error: 'Invalid pack' })
    return
  }
  const priceId = stripePriceId(packId)
  if (!priceId) {
    res.status(503).json({ error: 'Pack price is not configured' })
    return
  }

  const locale = parseAppLocale(req.body?.locale)
  const meta = extractRequestMeta(req)
  const user = req.user ?? null
  const site = publicSiteUrl()

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${site}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/pricing`,
      customer: user?.stripeCustomerId ?? undefined,
      customer_email: user && !user.stripeCustomerId ? user.email : undefined,
      customer_creation: user?.stripeCustomerId ? undefined : 'always',
      client_reference_id: meta.clientId ?? undefined,
      metadata: {
        pack: packId,
        locale,
        userId: user?.id ?? '',
      },
    })

    if (!session.url) {
      res.status(500).json({ error: 'Could not create checkout session' })
      return
    }
    res.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    console.error('Stripe checkout error:', err)
    res.status(500).json({ error: message })
  }
})

billingRouter.post('/billing/claim', async (req: Request, res: Response) => {
  const sessionId = typeof req.body?.session_id === 'string' ? req.body.session_id : ''
  if (!sessionId) {
    res.status(400).json({ error: 'session_id is required' })
    return
  }

  try {
    const session = await retrieveCheckoutSession(sessionId)
    const result = fulfillCheckoutSession(session)
    if (!result) {
      res.status(400).json({ error: 'Payment is not complete' })
      return
    }
    await establishSession(res, result.user)
    void notifyPurchaseIfNew(result)
    res.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        credits: result.user.creditsRemaining,
        locale: result.user.locale,
        googleId: result.user.googleId,
      },
      payment: {
        pack: result.payment.pack,
        creditsGranted: result.payment.creditsGranted,
        created: result.created,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Claim failed'
    console.error('Stripe claim error:', err)
    res.status(500).json({ error: message })
  }
})
