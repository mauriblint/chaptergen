import { Router, type Request, type Response } from 'express'
import {
  canonicalEmail,
  getOrCreateUserByEmail,
  getUserByEmail,
  getUserById,
  grantFreeCredits,
  markEmailVerified,
  markFreeGrantConsidered,
  normalizeEmail,
  updateUserLocale,
} from '../db/users.js'
import { countRecentCodes, createEmailCode, generateCode, verifyEmailCode } from '../db/emailCodes.js'
import { isDisposableEmail, isValidEmail } from '../utils/disposableEmail.js'
import { listPaymentsByUserId } from '../db/payments.js'
import { listJobsByUserId } from '../db/jobs.js'
import { signMagicToken, verifyToken } from '../auth/jwt.js'
import { clearSessionCookie } from '../auth/cookies.js'
import { establishSession, requireUser } from '../auth/session.js'
import {
  sendMagicLinkEmail,
  sendSupportEmail,
  sendVerificationCodeEmail,
} from '../services/email.js'
import { extractRequestMeta } from '../utils/requestMeta.js'
import { FREE_JOB_LIMIT, FREE_MAX_MINUTES } from '../billing/packs.js'
import { freeAllowanceFor, totalCredits } from '../billing/quota.js'
import { isAppLocale, parseAppLocale } from '../types/locale.js'

export const authRouter = Router()

function userPayload(user: NonNullable<Request['user']>) {
  return {
    id: user.id,
    email: user.email,
    credits: user.creditsRemaining,
    freeCredits: user.freeCredits,
    totalCredits: totalCredits(user),
    hasPaid: user.creditsRemaining > 0 || !!user.stripeCustomerId,
    locale: user.locale,
    googleId: user.googleId,
    pictureUrl: null as string | null,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  }
}

authRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = req.user ? getUserById(req.user.id) : null
  res.json({
    user: user ? userPayload(user) : null,
    freeLimit: FREE_JOB_LIMIT,
    freeMaxMinutes: FREE_MAX_MINUTES,
  })
})

// Email verification by 6-digit code. Used both to start the first free video
// and to sign in, so there is a single way into an account.
authRouter.post('/auth/code/request', async (req: Request, res: Response) => {
  const email = typeof req.body?.email === 'string' ? normalizeEmail(req.body.email) : ''
  const locale = parseAppLocale(req.body?.locale)
  const meta = extractRequestMeta(req)

  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Enter a valid email address', code: 'invalid_email' })
    return
  }
  if (isDisposableEmail(email)) {
    res.status(400).json({ error: 'Please use a permanent email address', code: 'disposable_email' })
    return
  }
  // Codes and limits are keyed by the real mailbox, so "+tag" aliases share them.
  const key = canonicalEmail(email)
  const minute = 60 * 1000
  if (countRecentCodes({ email: key, windowMs: minute }) >= 1) {
    res.status(429).json({ error: 'Wait a minute before requesting another code', code: 'rate_limited' })
    return
  }
  if (
    countRecentCodes({ email: key, windowMs: 60 * minute }) >= 5 ||
    countRecentCodes({ clientIp: meta.clientIp, windowMs: 60 * minute }) >= 15
  ) {
    res.status(429).json({ error: 'Too many codes requested. Try again later.', code: 'rate_limited' })
    return
  }

  const code = generateCode()
  createEmailCode({
    email: key,
    code,
    clientIp: meta.clientIp,
    clientId: meta.clientId,
    userAgent: meta.userAgent,
  })
  try {
    const existing = getUserByEmail(email)
    await sendVerificationCodeEmail({ email, locale: existing?.locale ?? locale, code })
  } catch (err) {
    console.error('verification email error:', err)
    res.status(502).json({ error: 'Could not send the email. Try again.', code: 'email_failed' })
    return
  }
  res.json({ ok: true })
})

authRouter.post('/auth/code/verify', async (req: Request, res: Response) => {
  const email = typeof req.body?.email === 'string' ? normalizeEmail(req.body.email) : ''
  const code = typeof req.body?.code === 'string' ? req.body.code.replace(/\D/g, '') : ''
  const locale = parseAppLocale(req.body?.locale)
  const meta = extractRequestMeta(req)

  if (!email || code.length !== 6) {
    res.status(400).json({ error: 'Enter the 6-digit code', code: 'invalid_code' })
    return
  }
  const result = verifyEmailCode(canonicalEmail(email), code)
  if (result !== 'ok') {
    const messages = {
      invalid: 'That code is not right',
      expired: 'That code has expired. Request a new one.',
      too_many_attempts: 'Too many attempts. Request a new code.',
    } as const
    res.status(400).json({ error: messages[result], code: result })
    return
  }

  const { user, created } = getOrCreateUserByEmail({ email, locale })
  markEmailVerified(user.id, {
    ip: meta.clientIp,
    clientId: meta.clientId,
    userAgent: meta.userAgent,
    country: meta.country,
  })

  // Free videos only for brand-new accounts, minus what this IP or device
  // already used. Existing customers keep their balance as it is.
  let freeGranted = 0
  if (created) {
    freeGranted = freeAllowanceFor(meta, user.id)
    if (freeGranted > 0) grantFreeCredits(user.id, freeGranted)
    else markFreeGrantConsidered(user.id)
  }

  const fresh = getUserById(user.id)!
  await establishSession(res, fresh)
  res.json({ user: userPayload(fresh), created, freeGranted })
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
    fileExtension: job.fileExtension,
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

authRouter.post('/support', requireUser, async (req: Request, res: Response) => {
  const subject = typeof req.body?.subject === 'string' ? req.body.subject.trim() : ''
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!subject || !message) {
    res.status(400).json({ error: 'Subject and message are required' })
    return
  }
  if (subject.length > 200 || message.length > 5000) {
    res.status(400).json({ error: 'Subject or message is too long' })
    return
  }
  if (!process.env.SUPPORT_EMAIL?.trim()) {
    res.status(503).json({ error: 'Support is not configured' })
    return
  }

  try {
    await sendSupportEmail({
      fromEmail: req.user!.email,
      userId: req.user!.id,
      subject,
      message,
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('support email error:', err)
    res.status(500).json({ error: 'Could not send the message' })
  }
})
