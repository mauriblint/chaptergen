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
}

export interface CostOverview {
  since: string
  jobs: { total: number; completed: number; failed: number; paid: number; free: number }
  audioSeconds: number
  costUsd: number
  trackedJobs: number
  revenueCents: number
  payments: number
  byModel: UsageByModel[]
  byDay: { day: string; costUsd: number; jobs: number; revenueCents: number }[]
}
