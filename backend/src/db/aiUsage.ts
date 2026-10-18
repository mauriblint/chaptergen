import crypto from 'crypto'
import { db } from './jobs.js'
import { costFor, type UsageAmounts } from '../services/aiPricing.js'

/** What the call was for: the transcript or the chapters. */
export type UsageStep = 'transcription' | 'chapters'
/** Why it ran: first processing, a chapter refine, or a re-transcription. */
export type UsageReason = 'initial' | 'refine' | 'retranscribe'

/** Passed down to the OpenAI calls so each one is recorded against its job. */
export interface UsageContext {
  jobId: string
  reason: UsageReason
}

export interface UsageRecord {
  id: string
  jobId: string
  step: UsageStep
  reason: UsageReason
  model: string
  inputTokens: number
  cachedInputTokens: number
  audioInputTokens: number
  outputTokens: number
  audioSeconds: number | null
  costUsd: number | null
  createdAt: string
}

interface UsageRow {
  id: string
  job_id: string
  step: UsageStep
  reason: UsageReason
  model: string
  input_tokens: number
  cached_input_tokens: number
  audio_input_tokens: number
  output_tokens: number
  audio_seconds: number | null
  cost_usd: number | null
  created_at: string
}

db.exec(`
  CREATE TABLE IF NOT EXISTS ai_usage (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    step TEXT NOT NULL,
    reason TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    cached_input_tokens INTEGER NOT NULL DEFAULT 0,
    audio_input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    audio_seconds REAL,
    cost_usd REAL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_ai_usage_job_id ON ai_usage(job_id);
  CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at);
`)

function rowToUsage(row: UsageRow): UsageRecord {
  return {
    id: row.id,
    jobId: row.job_id,
    step: row.step,
    reason: row.reason,
    model: row.model,
    inputTokens: row.input_tokens,
    cachedInputTokens: row.cached_input_tokens,
    audioInputTokens: row.audio_input_tokens,
    outputTokens: row.output_tokens,
    audioSeconds: row.audio_seconds,
    costUsd: row.cost_usd,
    createdAt: row.created_at,
  }
}

/** Never throws: losing a usage row must not fail the job. */
export function recordUsage(
  context: UsageContext | undefined,
  step: UsageStep,
  model: string,
  usage: UsageAmounts
): void {
  if (!context) return
  try {
    db.prepare(`
      INSERT INTO ai_usage (
        id, job_id, step, reason, model, input_tokens, cached_input_tokens,
        audio_input_tokens, output_tokens, audio_seconds, cost_usd, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      context.jobId,
      step,
      context.reason,
      model,
      usage.inputTokens ?? 0,
      usage.cachedInputTokens ?? 0,
      usage.audioInputTokens ?? 0,
      usage.outputTokens ?? 0,
      usage.audioSeconds ?? null,
      costFor(model, usage),
      new Date().toISOString()
    )
  } catch (err) {
    console.error('could not record AI usage:', err)
  }
}

export function listUsageByJob(jobId: string): UsageRecord[] {
  const rows = db
    .prepare('SELECT * FROM ai_usage WHERE job_id = ? ORDER BY created_at')
    .all(jobId) as UsageRow[]
  return rows.map(rowToUsage)
}

export interface UsageByModel {
  step: UsageStep
  model: string
  calls: number
  jobs: number
  inputTokens: number
  outputTokens: number
  audioSeconds: number
  costUsd: number
}

export interface CostOverview {
  since: string
  /** Jobs created in the period, by outcome. */
  jobs: { total: number; completed: number; failed: number; paid: number; free: number }
  /** Audio minutes of the jobs that were transcribed in the period. */
  audioSeconds: number
  costUsd: number
  /** Jobs with at least one recorded call; averages are over these. */
  trackedJobs: number
  revenueCents: number
  payments: number
  byModel: UsageByModel[]
  byDay: { day: string; costUsd: number; jobs: number; revenueCents: number }[]
}

export function getCostOverview(since: string): CostOverview {
  const jobs = db
    .prepare(`
      SELECT
        COUNT(*) AS total,
        SUM(status = 'completed') AS completed,
        SUM(status = 'failed') AS failed,
        SUM(credit_source = 'paid') AS paid,
        SUM(credit_source = 'free') AS free
      FROM jobs WHERE created_at >= ?
    `)
    .get(since) as Record<string, number | null>

  const totals = db
    .prepare(`
      SELECT
        COALESCE(SUM(cost_usd), 0) AS cost,
        COALESCE(SUM(CASE WHEN step = 'transcription' AND reason = 'initial' THEN audio_seconds END), 0) AS audio,
        COUNT(DISTINCT job_id) AS tracked
      FROM ai_usage WHERE created_at >= ?
    `)
    .get(since) as { cost: number; audio: number; tracked: number }

  const revenue = db
    .prepare(`
      SELECT COALESCE(SUM(amount_cents), 0) AS cents, COUNT(*) AS count
      FROM payments WHERE status = 'paid' AND created_at >= ?
    `)
    .get(since) as { cents: number; count: number }

  const byModel = db
    .prepare(`
      SELECT step, model, COUNT(*) AS calls, COUNT(DISTINCT job_id) AS jobs,
        SUM(input_tokens + audio_input_tokens) AS input_tokens, SUM(output_tokens) AS output_tokens,
        COALESCE(SUM(audio_seconds), 0) AS audio_seconds, COALESCE(SUM(cost_usd), 0) AS cost
      FROM ai_usage WHERE created_at >= ?
      GROUP BY step, model ORDER BY cost DESC
    `)
    .all(since) as {
    step: UsageStep
    model: string
    calls: number
    jobs: number
    input_tokens: number
    output_tokens: number
    audio_seconds: number
    cost: number
  }[]

  const costByDay = db
    .prepare(`
      SELECT substr(created_at, 1, 10) AS day, SUM(cost_usd) AS cost
      FROM ai_usage WHERE created_at >= ? GROUP BY day
    `)
    .all(since) as { day: string; cost: number | null }[]
  const jobsByDay = db
    .prepare(`
      SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS jobs
      FROM jobs WHERE created_at >= ? GROUP BY day
    `)
    .all(since) as { day: string; jobs: number }[]
  const revenueByDay = db
    .prepare(`
      SELECT substr(created_at, 1, 10) AS day, SUM(amount_cents) AS cents
      FROM payments WHERE status = 'paid' AND created_at >= ? GROUP BY day
    `)
    .all(since) as { day: string; cents: number }[]

  // Every day of the period, so the chart has no gaps.
  const days = new Map<string, { day: string; costUsd: number; jobs: number; revenueCents: number }>()
  for (let d = new Date(since.slice(0, 10)); d <= new Date(); d.setUTCDate(d.getUTCDate() + 1)) {
    const day = d.toISOString().slice(0, 10)
    days.set(day, { day, costUsd: 0, jobs: 0, revenueCents: 0 })
  }
  for (const row of costByDay) {
    const entry = days.get(row.day)
    if (entry) entry.costUsd = row.cost ?? 0
  }
  for (const row of jobsByDay) {
    const entry = days.get(row.day)
    if (entry) entry.jobs = row.jobs
  }
  for (const row of revenueByDay) {
    const entry = days.get(row.day)
    if (entry) entry.revenueCents = row.cents
  }

  return {
    since,
    jobs: {
      total: jobs.total ?? 0,
      completed: jobs.completed ?? 0,
      failed: jobs.failed ?? 0,
      paid: jobs.paid ?? 0,
      free: jobs.free ?? 0,
    },
    audioSeconds: totals.audio,
    costUsd: totals.cost,
    trackedJobs: totals.tracked,
    revenueCents: revenue.cents,
    payments: revenue.count,
    byModel: byModel.map((row) => ({
      step: row.step,
      model: row.model,
      calls: row.calls,
      jobs: row.jobs,
      inputTokens: row.input_tokens,
      outputTokens: row.output_tokens,
      audioSeconds: row.audio_seconds,
      costUsd: row.cost,
    })),
    byDay: [...days.values()],
  }
}
