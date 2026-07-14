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
  fileType: string | null
  fileExtension: string | null
  mediaType: 'audio' | 'video' | null
  clientIp: string | null
  country: string | null
  userAgent: string | null
  acceptLanguage: string | null
  referer: string | null
  clientId: string | null
  errorMessage: string | null
  failureReason: string | null
  createdAt: string
  updatedAt: string
}

export interface JobsListResponse {
  jobs: JobSummary[]
  total: number
}
