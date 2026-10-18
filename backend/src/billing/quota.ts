import type { Response } from 'express'
import {
  creditsForDuration,
  FREE_JOB_LIMIT,
  FREE_MAX_SECONDS,
  FREE_REFINE_LIMIT,
} from './packs.js'
import {
  countQuotaJobsByClientId,
  countQuotaJobsByClientIp,
  markJobCreditsRefunded,
  updateJobCreditsCharged,
  type JobRecord,
} from '../db/jobs.js'
import {
  addCredits,
  addFreeCredits,
  countFreeGrantsBySignup,
  debitCredits,
  debitFreeCredit,
  getUserById,
  type UserRecord,
} from '../db/users.js'
import type { RequestMeta } from '../utils/requestMeta.js'

export type PaywallReason = 'free_limit' | 'credits' | 'refine' | 'verify'

export class PaywallError extends Error {
  readonly code = 'PAYWALL' as const
  readonly statusCode = 402
  readonly reason: PaywallReason

  constructor(message: string, reason: PaywallReason) {
    super(message)
    this.name = 'PaywallError'
    this.reason = reason
  }
}

export function sendPaywall(res: Response, err: PaywallError): void {
  res.status(402).json({
    error: err.message,
    code: 'PAYWALL',
    checkout: true,
    reason: err.reason,
  })
}

export function totalCredits(user: UserRecord): number {
  return user.creditsRemaining + user.freeCredits
}

/** IPs are shared and reassigned, so they only count for a while; devices count forever. */
const FREE_IP_WINDOW_MS = 30 * 24 * 60 * 60 * 1000

/**
 * How many free videos a newly verified account gets. Anything already used
 * from the same device, or from the same IP in the last 30 days, counts
 * against it: anonymous jobs from before email verification existed, and free
 * credits granted to other accounts.
 */
export function freeAllowanceFor(meta: RequestMeta, userId: string): number {
  const ipSince = new Date(Date.now() - FREE_IP_WINDOW_MS).toISOString()
  const used = Math.max(
    meta.clientId ? countQuotaJobsByClientId(meta.clientId) : 0,
    meta.clientIp ? countQuotaJobsByClientIp(meta.clientIp, ipSince) : 0,
    countFreeGrantsBySignup({ ip: meta.clientIp, clientId: meta.clientId, excludeUserId: userId, ipSince })
  )
  return Math.max(0, FREE_JOB_LIMIT - used)
}

/** Processing costs money, so every new job needs a verified account with credit. */
export function assertCanStartJob(user: UserRecord | null | undefined): void {
  if (!user) {
    throw new PaywallError('Verify your email to start', 'verify')
  }
  if (totalCredits(user) < 1) {
    throw new PaywallError(
      'No credits remaining',
      user.freeGranted && user.creditsRemaining === 0 ? 'free_limit' : 'credits'
    )
  }
}

export function assertCanRefine(user: UserRecord | null | undefined, job: JobRecord): void {
  const ownsPaidJob = user && job.userId === user.id && job.creditSource === 'paid'
  if (ownsPaidJob) return
  if (job.refineCount >= FREE_REFINE_LIMIT) {
    throw new PaywallError('Free refine limit reached', 'refine')
  }
}

/**
 * Charges one credit once the duration is known. Free credits are used first
 * for videos within the free length; longer videos need a paid credit.
 */
export function settleJobBilling(
  job: JobRecord,
  durationSeconds: number | null
): { ok: true } | { ok: false; message: string; reason: string } {
  if (job.creditsCharged != null && job.creditsCharged > 0) {
    return { ok: true }
  }

  if (!job.userId) {
    // Jobs created before email verification was required.
    if (durationSeconds != null && durationSeconds > FREE_MAX_SECONDS) {
      return {
        ok: false,
        message: `Free jobs are limited to ${FREE_MAX_SECONDS / 60} minutes.`,
        reason: 'duration_over_free_limit',
      }
    }
    return { ok: true }
  }

  const user = getUserById(job.userId)
  if (!user) {
    return { ok: false, message: 'Account not found', reason: 'paywall' }
  }

  const cost = creditsForDuration(durationSeconds)
  const withinFreeLength = durationSeconds == null || durationSeconds <= FREE_MAX_SECONDS

  if (withinFreeLength && user.freeCredits >= cost && debitFreeCredit(user.id)) {
    updateJobCreditsCharged(job.id, cost, 'free')
    return { ok: true }
  }
  if (debitCredits(user.id, cost)) {
    updateJobCreditsCharged(job.id, cost, 'paid')
    return { ok: true }
  }
  if (!withinFreeLength && user.freeCredits > 0) {
    return {
      ok: false,
      message: `Free videos are limited to ${FREE_MAX_SECONDS / 60} minutes.`,
      reason: 'duration_over_free_limit',
    }
  }
  return {
    ok: false,
    message: `This file needs ${cost} credits and you do not have enough.`,
    reason: 'insufficient_credits',
  }
}

/** Gives the credit back when processing fails after it was charged. */
export function refundJobCredit(job: JobRecord): boolean {
  if (!job.userId || !job.creditsCharged || job.creditsCharged <= 0) return false
  if (!markJobCreditsRefunded(job.id)) return false
  if (job.creditSource === 'free') {
    addFreeCredits(job.userId, job.creditsCharged)
  } else {
    addCredits(job.userId, job.creditsCharged)
  }
  return true
}
