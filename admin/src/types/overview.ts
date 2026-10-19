import type { UsageStep } from './job'

export interface UsageByModel {
  step: UsageStep
  model: string
  calls: number
  jobs: number
  inputTokens: number
  outputTokens: number
  audioSeconds: number
  costUsd: number
  avgDurationMs: number | null
  speed: number | null
}

export interface CostOverview {
  since: string
  jobs: { total: number; completed: number; failed: number; paid: number; free: number }
  audioSeconds: number
  costUsd: number
  trackedJobs: number
  revenueCents: number
  payments: number
  processing: { jobs: number; avgSeconds: number | null; medianSeconds: number | null; maxSeconds: number | null }
  byModel: UsageByModel[]
  byDay: { day: string; costUsd: number; jobs: number; revenueCents: number }[]
}
