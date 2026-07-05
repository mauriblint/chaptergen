export interface TranscriptSegment {
  start: number
  end: number
  text: string
}

export interface Chapter {
  time: string
  title: string
}

export interface ChaptersResult {
  chapters: Chapter[]
  formatted: string
}

export interface TranscribeResult {
  segments: TranscriptSegment[]
}

export type ProcessingStep =
  | 'idle'
  | 'uploading'
  | 'extracting'
  | 'transcribing'
  | 'generating'
  | 'regenerating'
  | 'done'
  | 'error'

export const STEP_LABELS: Record<ProcessingStep, string> = {
  idle: '',
  uploading: 'Uploading file…',
  extracting: 'Extracting audio…',
  transcribing: 'Transcribing with Whisper…',
  generating: 'Generating chapters…',
  regenerating: 'Refining chapters…',
  done: 'Done',
  error: 'Error',
}
