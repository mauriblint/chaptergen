import { Router, type Request, type Response } from 'express'
import { getUserByEmail, getUserById, updateUserLocale } from '../db/users.js'
import { listPaymentsByUserId } from '../db/payments.js'
import { listJobsByUserId } from '../db/jobs.js'
import { signMagicToken, verifyToken } from '../auth/jwt.js'
import { clearSessionCookie } from '../auth/cookies.js'
import { establishSession, requireUser } from '../auth/session.js'
import { sendMagicLinkEmail } from '../services/email.js'
import { extractRequestMeta } from '../utils/requestMeta.js'
import { FREE_JOB_LIMIT, FREE_MAX_MINUTES } from '../billing/packs.js'
import { getFreeUsage } from '../billing/quota.js'
import { isAppLocale } from '../types/locale.js'

export const authRouter = Router()

function userPayload(user: NonNullable<Request['user']>) {
  return {
    id: user.id,
    email: user.email,
    credits: user.creditsRemaining,
    locale: user.locale,
    googleId: user.googleId,
    pictureUrl: null as string | null,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  }
}

authRouter.get('/auth/me', (req: Request, res: Response) => {
  const meta = extractRequestMeta(req)
  const free = getFreeUsage(meta)
  const user = req.user ? getUserById(req.user.id) : null
  res.json({
    user: user ? userPayload(user) : null,
    freeUsed: free.used,
    freeLimit: FREE_JOB_LIMIT,
    freeMaxMinutes: FREE_MAX_MINUTES,
  })
})

authRouter.patch('/auth/me', requireUser, (req: Request, res: Response) => {
  const locale = req.body?.locale
  if (!isAppLocale(locale)) {
    res.status(400).json({ error: 'locale must be en or es' })
    return
  }
  updateUserLocale(req.user!.id, locale)
  const user = getUserById(req.user!.id)!
  res.json({ user: userPayload(user) })
})

authRouter.post('/auth/logout', (req: Request, res: Response) => {
  clearSessionCookie(res)
  res.json({ ok: true })
})

authRouter.post('/auth/magic-link', async (req: Request, res: Response) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const generic = { ok: true }
  if (!email || !email.includes('@') || email.length > 254) {
    res.json(generic)
    return
  }

  const user = getUserByEmail(email)
  if (!user) {
    res.json(generic)
    return
  }

  try {
    const token = await signMagicToken(user.id, user.email)
    await sendMagicLinkEmail({ email: user.email, locale: user.locale, token })
  } catch (err) {
    console.error('magic-link error:', err)
  }
  res.json(generic)
})

authRouter.post('/auth/magic-login', async (req: Request, res: Response) => {
  const token = typeof req.body?.token === 'string' ? req.body.token : ''
  const payload = await verifyToken(token, 'magic')
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired link' })
    return
  }
  const user = getUserById(payload.userId)
  if (!user) {
    res.status(401).json({ error: 'Invalid or expired link' })
    return
  }
  await establishSession(res, user)
  res.json({ user: userPayload(user) })
})

authRouter.get('/account', requireUser, (req: Request, res: Response) => {
  const user = getUserById(req.user!.id)!
  const payments = listPaymentsByUserId(user.id)
  const jobs = listJobsByUserId(user.id).map((job) => ({
    id: job.id,
    status: job.status,
    fileName: job.fileName,
    chaptersGenerated: job.chaptersGenerated,
    durationSeconds: job.durationSeconds,
    createdAt: job.createdAt,
  }))
  res.json({
    user: userPayload(user),
    payments: payments.map((p) => ({
      id: p.id,
      pack: p.pack,
      creditsGranted: p.creditsGranted,
      amountCents: p.amountCents,
      status: p.status,
      createdAt: p.createdAt,
    })),
    jobs,
  })
})
