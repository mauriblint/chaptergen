import type { Chapter } from '../types'

export type JobStatus =
  | 'pending'
  | 'extracting'
  | 'transcribing'
  | 'generating'
  | 'regenerating'
  | 'completed'
  | 'failed'

export interface Job {
  id: string
  status: JobStatus
  fileName: string
  autoMode: boolean
  chapterCount: number | null
  chaptersGenerated: number | null
  hasTranscript: boolean
  chapters: Chapter[] | null
  formatted: string | null
  error: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateJobResponse {
  id: string
}
