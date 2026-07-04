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
  uploading: 'Subiendo video…',
  extracting: 'Extrayendo audio…',
  transcribing: 'Transcribiendo con Whisper…',
  generating: 'Generando capítulos…',
  regenerating: 'Regenerando capítulos…',
  done: 'Listo',
  error: 'Error',
}
