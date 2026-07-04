export interface TranscriptSegment {
  start: number
  end: number
  text: string
}

export interface Chapter {
  time: string
  title: string
}

export interface ProcessResult {
  chapters: Chapter[]
  formatted: string
  segments: TranscriptSegment[]
}

export function formatSecondsToTimestamp(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

export function formatChapters(chapters: Chapter[]): string {
  return chapters.map((c) => `[${c.time}] ${c.title}`).join('\n')
}
