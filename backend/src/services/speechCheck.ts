import type { TranscriptSegment } from '../types.js'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * True when a transcript is not real speech. On silence or music Whisper
 * invents the same short line over and over ("you", "Thank you.", "Gracias
 * por ver el video") instead of returning nothing, so a word count alone
 * misses it.
 */
export function looksLikeNoSpeech(segments: TranscriptSegment[]): boolean {
  const lines = segments.map((s) => normalize(s.text)).filter(Boolean)
  const words = lines.flatMap((line) => line.split(' '))
  if (words.length < 3) return true
  if (lines.length < 4) return false

  // Real speech uses many different words; a looped phrase uses a handful.
  if (new Set(words).size <= 6) return true

  // One line making up most of the transcript, even a long one ("Subtítulos
  // realizados por la comunidad de Amara.org").
  const counts = new Map<string, number>()
  for (const line of lines) counts.set(line, (counts.get(line) ?? 0) + 1)
  const times = Math.max(...counts.values())
  return times / lines.length >= 0.6
}
