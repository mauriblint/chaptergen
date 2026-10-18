import type { Chapter, TranscriptSegment } from '../types'

const TIME_RE = /^\d{1,2}(:\d{2}){1,2}$/

export function isValidTime(time: string): boolean {
  return TIME_RE.test(time.trim())
}

export function timeToSeconds(time: string): number {
  return time
    .trim()
    .split(':')
    .map(Number)
    .reduce((total, part) => total * 60 + (Number.isFinite(part) ? part : 0), 0)
}

/** YouTube's own style: 0:00, 4:05, 1:02:03. */
export function youtubeTimestamp(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = String(total % 60).padStart(2, '0')
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`
}

export function toYoutubeText(chapters: Chapter[]): string {
  return chapters
    .filter((c) => c.title.trim())
    .map((c) => `${youtubeTimestamp(timeToSeconds(c.time))} ${c.title.trim()}`)
    .join('\n')
}

export interface YoutubeCheck {
  startsAtZero: boolean
  enoughChapters: boolean
  longEnough: boolean
  inOrder: boolean
  ok: boolean
}

/** YouTube only shows chapters when all of these hold. */
export function checkYoutubeRules(chapters: Chapter[], durationSeconds: number | null): YoutubeCheck {
  const times = chapters.map((c) => timeToSeconds(c.time))
  const startsAtZero = times[0] === 0
  const enoughChapters = chapters.length >= 3
  const inOrder = times.every((t, i) => i === 0 || t > times[i - 1])
  const ends = [...times.slice(1), durationSeconds ?? Infinity]
  const longEnough = times.every((t, i) => ends[i] - t >= 10)
  return {
    startsAtZero,
    enoughChapters,
    longEnough,
    inOrder,
    ok: startsAtZero && enoughChapters && longEnough && inOrder,
  }
}

export interface TranscriptBlock {
  title: string
  start: number
  segments: TranscriptSegment[]
}

export function groupByChapter(segments: TranscriptSegment[], chapters: Chapter[] | null): TranscriptBlock[] {
  if (!chapters?.length) return [{ title: '', start: 0, segments }]
  const starts = chapters.map((c) => timeToSeconds(c.time))
  return chapters.map((c, i) => ({
    title: c.title,
    start: starts[i],
    segments: segments.filter(
      (seg) => (i === 0 || seg.start >= starts[i]) && seg.start < (starts[i + 1] ?? Infinity)
    ),
  }))
}
