import type { Chapter, TranscriptSegment } from '../types'

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
  fileExtension: string | null
  mediaType: 'audio' | 'video' | null
  fileSizeBytes: number | null
  durationSeconds: number | null
  language: string | null
  autoMode: boolean
  chapterCount: number | null
  chaptersGenerated: number | null
  hasTranscript: boolean
  chapters: Chapter[] | null
  formatted: string | null
  /** Chapters as pasted into YouTube: "0:00 Title" per line. */
  youtube: string | null
  segments: TranscriptSegment[] | null
  refineCount: number
  /** Null when refines are unlimited (paid videos). */
  refinesLeft: number | null
  creditSource: 'free' | 'paid' | null
  creditsRefunded: boolean
  error: string | null
  failureReason: string | null
  createdAt: string
  updatedAt: string
}

export interface JobSummary {
  id: string
  status: JobStatus
  fileName: string
  fileExtension: string | null
  mediaType: 'audio' | 'video' | null
  durationSeconds: number | null
  language: string | null
  chaptersGenerated: number | null
  creditsRefunded: boolean
  failureReason: string | null
  createdAt: string
  updatedAt: string
}

export type DownloadType = 'chapters' | 'transcript' | 'text' | 'srt' | 'vtt' | 'docx' | 'zip'

export interface CreateJobResponse {
  id: string
}
