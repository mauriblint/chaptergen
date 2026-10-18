import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx'
import JSZip from 'jszip'
import type { Chapter, TranscriptSegment } from '../types.js'

export function timeToSeconds(time: string): number {
  return time
    .split(':')
    .map(Number)
    .reduce((total, part) => total * 60 + (Number.isFinite(part) ? part : 0), 0)
}

/** YouTube's own style: 0:00, 4:05, 1:02:03 (no leading zero on the first unit). */
export function youtubeTimestamp(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`
}

/** The text users paste into the YouTube description. */
export function youtubeChapters(chapters: Chapter[]): string {
  return chapters.map((c) => `${youtubeTimestamp(timeToSeconds(c.time))} ${c.title}`).join('\n')
}

export interface ChapterBlock {
  title: string
  start: number
  segments: TranscriptSegment[]
}

/** Transcript split under each chapter heading, for reading and .docx export. */
export function transcriptByChapter(
  segments: TranscriptSegment[],
  chapters: Chapter[] | null
): ChapterBlock[] {
  if (!chapters?.length) return [{ title: '', start: 0, segments }]
  const starts = chapters.map((c) => timeToSeconds(c.time))
  return chapters.map((c, i) => ({
    title: c.title,
    start: starts[i],
    segments: segments.filter(
      (seg) => seg.start >= (i === 0 ? -Infinity : starts[i]) && seg.start < (starts[i + 1] ?? Infinity)
    ),
  }))
}

export function plainTranscript(segments: TranscriptSegment[], withTimestamps: boolean): string {
  if (withTimestamps) {
    return segments.map((s) => `[${youtubeTimestamp(s.start)}] ${s.text.trim()}`).join('\n')
  }
  return segments.map((s) => s.text.trim()).join(' ').replace(/\s+/g, ' ').trim()
}

export interface SubtitleOptions {
  maxCharsPerLine: number
  maxLines: number
}

export const DEFAULT_SUBTITLE_OPTIONS: SubtitleOptions = { maxCharsPerLine: 42, maxLines: 2 }

interface Cue {
  start: number
  end: number
  lines: string[]
}

function wrapWords(words: string[], maxChars: number): string[] {
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if (!current) current = word
    else if (current.length + 1 + word.length <= maxChars) current += ` ${word}`
    else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

/** Wraps into as few lines as needed, with similar lengths (no one-word last line). */
function wrapBalanced(words: string[], maxChars: number): string[] {
  const length = words.join(' ').length
  const lineCount = Math.max(1, Math.ceil(length / maxChars))
  if (lineCount === 1) return [words.join(' ')]
  const target = length / lineCount
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    const overTarget = current.length >= target && lines.length < lineCount - 1
    if (current && (next.length > maxChars || overTarget)) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

/**
 * Whisper segments can run 20+ seconds. Each one is split into readable cues
 * (max chars per line, max lines per cue) of similar size, so no cue is left
 * with a single orphan word. Its time is shared out by characters.
 */
export function buildCues(segments: TranscriptSegment[], options: SubtitleOptions): Cue[] {
  const cues: Cue[] = []
  const capacity = options.maxCharsPerLine * options.maxLines
  for (const seg of segments) {
    const words = seg.text.trim().split(/\s+/).filter(Boolean)
    if (!words.length) continue
    const text = words.join(' ')
    const cueCount = Math.max(1, Math.ceil(text.length / capacity))
    const target = text.length / cueCount

    // Fill each cue up to an even share of the text, never past its capacity.
    const groups: string[][] = []
    let current: string[] = []
    let length = 0
    for (const word of words) {
      const next = length ? length + 1 + word.length : word.length
      const full = next > capacity || (length >= target && groups.length < cueCount - 1)
      if (current.length && full) {
        groups.push(current)
        current = []
        length = 0
      }
      current.push(word)
      length = length ? length + 1 + word.length : word.length
    }
    if (current.length) groups.push(current)

    const cueTexts = groups.map((g) => wrapBalanced(g, options.maxCharsPerLine))
    const totalChars = groups.reduce((n, g) => n + g.join(' ').length, 0) || 1
    const duration = Math.max(0.5, seg.end - seg.start)
    let cursor = seg.start
    cueTexts.forEach((lines, index) => {
      const share = (groups[index].join(' ').length / totalChars) * duration
      const end = index === cueTexts.length - 1 ? seg.end : cursor + share
      cues.push({ start: cursor, end: Math.max(end, cursor + 0.3), lines })
      cursor = end
    })
  }
  return cues
}

function clock(seconds: number, separator: ',' | '.'): string {
  const ms = Math.max(0, Math.round(seconds * 1000))
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  const s = Math.floor((ms % 60_000) / 1000)
  const rest = ms % 1000
  const pad = (n: number, w = 2) => String(n).padStart(w, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}${separator}${pad(rest, 3)}`
}

export function toSrt(segments: TranscriptSegment[], options = DEFAULT_SUBTITLE_OPTIONS): string {
  return buildCues(segments, options)
    .map((cue, i) => `${i + 1}\n${clock(cue.start, ',')} --> ${clock(cue.end, ',')}\n${cue.lines.join('\n')}\n`)
    .join('\n')
}

export function toVtt(segments: TranscriptSegment[], options = DEFAULT_SUBTITLE_OPTIONS): string {
  const body = buildCues(segments, options)
    .map((cue) => `${clock(cue.start, '.')} --> ${clock(cue.end, '.')}\n${cue.lines.join('\n')}\n`)
    .join('\n')
  return `WEBVTT\n\n${body}`
}

export async function toDocx(input: {
  title: string
  segments: TranscriptSegment[]
  chapters: Chapter[] | null
}): Promise<Buffer> {
  const children: Paragraph[] = [new Paragraph({ text: input.title, heading: HeadingLevel.TITLE })]
  for (const block of transcriptByChapter(input.segments, input.chapters)) {
    if (block.title) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({ text: `${youtubeTimestamp(block.start)}  `, color: '4C3FF0' }),
            new TextRun({ text: block.title }),
          ],
        })
      )
    }
    const text = block.segments.map((s) => s.text.trim()).join(' ').replace(/\s+/g, ' ').trim()
    if (text) children.push(new Paragraph({ children: [new TextRun(text)], spacing: { after: 200 } }))
  }
  const doc = new Document({ sections: [{ children }] })
  return Packer.toBuffer(doc)
}

export async function toZip(input: {
  baseName: string
  segments: TranscriptSegment[]
  chapters: Chapter[] | null
}): Promise<Buffer> {
  const zip = new JSZip()
  const { baseName, segments, chapters } = input
  if (chapters?.length) zip.file(`${baseName}-chapters.txt`, youtubeChapters(chapters))
  zip.file(`${baseName}-transcript.txt`, plainTranscript(segments, true))
  zip.file(`${baseName}.srt`, toSrt(segments))
  zip.file(`${baseName}.vtt`, toVtt(segments))
  zip.file(`${baseName}-transcript.docx`, await toDocx({ title: baseName, segments, chapters }))
  return zip.generateAsync({ type: 'nodebuffer' })
}
