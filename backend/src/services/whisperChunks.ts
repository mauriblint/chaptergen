import type { TranscriptSegment } from '../types.js'
import { AUDIO_MAX_UPLOAD_BYTES } from './extractAudio.js'

// Whisper segments are typically a few seconds. A 12s overlap is enough for a
// word (or short phrase) cut at the boundary to exist fully in one of the two
// chunks. A 60s overlap would only add cost and a large region of duplicate
// text that is harder to merge cleanly.
export const WHISPER_CHUNK_OVERLAP_SECONDS = 12

export interface AudioSlice {
  start: number
  duration: number
}

export interface ChunkTranscript {
  offset: number
  segments: TranscriptSegment[]
  language: string | null
}

export function planWhisperChunks(input: {
  fileSizeBytes: number
  durationSeconds: number
  maxUploadBytes?: number
  overlapSeconds?: number
}): AudioSlice[] {
  const maxBytes = input.maxUploadBytes ?? AUDIO_MAX_UPLOAD_BYTES
  const overlap = input.overlapSeconds ?? WHISPER_CHUNK_OVERLAP_SECONDS
  const { fileSizeBytes, durationSeconds } = input

  if (fileSizeBytes <= maxBytes || durationSeconds <= 0) {
    return [{ start: 0, duration: durationSeconds }]
  }

  // Headroom so a re-encoded slice stays under the hard 25 MB API limit.
  const targetBytes = Math.floor(maxBytes * 0.88)
  const bytesPerSecond = fileSizeBytes / durationSeconds
  const chunkDuration = Math.max(overlap + 1, targetBytes / bytesPerSecond)
  const step = chunkDuration - overlap

  if (step <= 0) {
    return [{ start: 0, duration: durationSeconds }]
  }

  const slices: AudioSlice[] = []
  let start = 0
  while (start < durationSeconds) {
    const duration = Math.min(chunkDuration, durationSeconds - start)
    slices.push({ start, duration })
    if (start + duration >= durationSeconds - 0.01) break
    start += step
  }

  // A last slice shorter than the overlap is almost entirely duplicate audio.
  if (slices.length >= 2) {
    const last = slices[slices.length - 1]
    const prev = slices[slices.length - 2]
    if (last && prev && last.duration <= overlap) {
      slices.pop()
      prev.duration = durationSeconds - prev.start
    }
  }

  return slices
}

export function mergeChunkSegments(
  chunks: ChunkTranscript[],
  overlapSeconds = WHISPER_CHUNK_OVERLAP_SECONDS
): TranscriptSegment[] {
  if (chunks.length === 0) return []
  if (chunks.length === 1) {
    return shiftSegments(chunks[0].segments, chunks[0].offset)
  }

  const merged: TranscriptSegment[] = []

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const next = chunks[i + 1]

    // Own the first half of the overlap with the previous chunk, and leave the
    // second half to the next chunk. A word split at the raw cut then lands
    // fully inside one side of the overlap and is kept from that chunk only.
    const keepFrom = i === 0 ? -Infinity : chunk.offset + overlapSeconds / 2
    const keepUntil = next ? next.offset + overlapSeconds / 2 : Infinity

    for (const seg of chunk.segments) {
      const start = chunk.offset + seg.start
      const end = chunk.offset + seg.end
      const text = seg.text.trim()
      if (!text) continue
      if (start >= keepFrom && start < keepUntil) {
        merged.push({ start, end, text })
      }
    }
  }

  return merged
}

export function pickTranscriptLanguage(chunks: ChunkTranscript[]): string | null {
  for (const chunk of chunks) {
    if (chunk.language) return chunk.language
  }
  return null
}

function shiftSegments(segments: TranscriptSegment[], offset: number): TranscriptSegment[] {
  if (offset === 0) {
    return segments.map((seg) => ({
      start: seg.start,
      end: seg.end,
      text: seg.text.trim(),
    }))
  }
  return segments.map((seg) => ({
    start: offset + seg.start,
    end: offset + seg.end,
    text: seg.text.trim(),
  }))
}
