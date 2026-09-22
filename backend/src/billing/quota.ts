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
  updateJobCreditsCharged,
  type JobRecord,
} from '../db/jobs.js'
import { debitCredits, getUserById, type UserRecord } from '../db/users.js'
import type { RequestMeta } from '../utils/requestMeta.js'

export type PaywallReason = 'free_limit' | 'credits' | 'refine'

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

export function getFreeUsage(meta: RequestMeta): { used: number; limit: number } {
  let used = 0
  if (meta.clientId) {
    used = Math.max(used, countQuotaJobsByClientId(meta.clientId))
  }
  if (meta.clientIp) {
    used = Math.max(used, countQuotaJobsByClientIp(meta.clientIp))
  }
  return { used, limit: FREE_JOB_LIMIT }
}

export function assertCanStartJob(user: UserRecord | null | undefined, meta: RequestMeta): void {
  if (user) {
    if (user.creditsRemaining < 1) {
      throw new PaywallError('No credits remaining', 'credits')
    }
    return
  }
  const { used, limit } = getFreeUsage(meta)
  if (used >= limit) {
    throw new PaywallError('Free limit reached', 'free_limit')
  }
}

export function assertCanRefine(user: UserRecord | null | undefined, job: JobRecord): void {
  if (user && job.userId === user.id) return
  if (job.refineCount >= FREE_REFINE_LIMIT) {
    throw new PaywallError('Free refine limit reached', 'refine')
  }
}

export function settleJobBilling(
  job: JobRecord,
  durationSeconds: number | null
): { ok: true } | { ok: false; message: string; reason: string } {
  if (job.creditsCharged != null && job.creditsCharged > 0) {
    return { ok: true }
  }

  if (!job.userId) {
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
  if (!debitCredits(user.id, cost)) {
    return {
      ok: false,
      message: `This file needs ${cost} credits and you do not have enough.`,
      reason: 'insufficient_credits',
    }
  }

  updateJobCreditsCharged(job.id, cost)
  return { ok: true }
}
