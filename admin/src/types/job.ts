export type JobStatus =
  | 'pending'
  | 'extracting'
  | 'transcribing'
  | 'generating'
  | 'regenerating'
  | 'completed'
  | 'failed'

export interface JobSummary {
  id: string
  status: JobStatus
  fileName: string
  autoMode: boolean
  chapterCount: number | null
  chaptersGenerated: number | null
  fileSizeBytes: number | null
  durationSeconds: number | null
  fileType: string | null
  fileExtension: string | null
  mediaType: 'audio' | 'video' | null
  clientIp: string | null
  country: string | null
  userAgent: string | null
  acceptLanguage: string | null
  referer: string | null
  clientId: string | null
  userId: string | null
  userEmail: string | null
  transcriptLanguage: string | null
  audioLanguage: string | null
  creditSource: 'free' | 'paid' | null
  creditsRefunded: boolean
  refineCount: number
  retranscribed: boolean
  /** Sum of the recorded OpenAI calls; null for jobs from before tracking. */
  aiCostUsd: number | null
  errorMessage: string | null
  failureReason: string | null
  createdAt: string
  updatedAt: string
}

export interface JobsListResponse {
  jobs: JobSummary[]
  total: number
}

export type UsageStep = 'transcription' | 'chapters'
export type UsageReason = 'initial' | 'refine' | 'retranscribe'

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

export interface JobDetailResponse {
  job: JobSummary
  usage: UsageRecord[]
}
