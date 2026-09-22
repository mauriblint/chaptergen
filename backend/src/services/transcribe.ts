import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'
import type { TranscriptSegment } from '../types.js'
import {
  AUDIO_MAX_UPLOAD_BYTES,
  cleanupFiles,
  extractAudioSlice,
  getMediaDurationSeconds,
} from './extractAudio.js'
import {
  mergeChunkSegments,
  pickTranscriptLanguage,
  planWhisperChunks,
  type AudioSlice,
  type ChunkTranscript,
} from './whisperChunks.js'

export interface TranscriptionResult {
  segments: TranscriptSegment[]
  language: string | null
}

export class AudioTooLargeError extends Error {
  readonly reason = 'audio_too_large' as const

  constructor(sizeMb: string) {
    super(
      `El audio es demasiado largo para transcribir: ${sizeMb} MB tras comprimir (límite ~25 MB de OpenAI Whisper).`
    )
    this.name = 'AudioTooLargeError'
  }
}

function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no está configurada')
  }
  return new OpenAI({ apiKey })
}

function normalizeLanguage(language: unknown): string | null {
  if (typeof language !== 'string') return null
  const trimmed = language.trim()
  if (!trimmed || trimmed.length > 64) return null
  return trimmed
}

function sizeMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1)
}

async function transcribeFile(audioPath: string): Promise<TranscriptionResult> {
  const openai = getOpenAI()

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['segment'],
  })

  const segments = (transcription as { segments?: TranscriptSegment[] }).segments ?? []

  return {
    segments: segments.map((seg) => ({
      start: seg.start,
      end: seg.end,
      text: seg.text.trim(),
    })),
    language: normalizeLanguage((transcription as { language?: unknown }).language),
  }
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0

  async function worker(): Promise<void> {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index], index)
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker())
  await Promise.all(workers)
  return results
}

async function transcribeInChunks(
  audioPath: string,
  fileSizeBytes: number,
  durationSeconds: number
): Promise<TranscriptionResult> {
  const slices = planWhisperChunks({ fileSizeBytes, durationSeconds })
  if (slices.length <= 1) {
    throw new AudioTooLargeError(sizeMb(fileSizeBytes))
  }

  const dir = path.dirname(audioPath)
  const base = path.basename(audioPath, path.extname(audioPath))
  const chunkPaths: string[] = []
  const prepared: { slice: AudioSlice; chunkPath: string }[] = []

  try {
    for (const [i, slice] of slices.entries()) {
      const chunkPath = path.join(dir, `${base}-chunk-${i}.mp3`)
      await extractAudioSlice(audioPath, chunkPath, slice.start, slice.duration)
      chunkPaths.push(chunkPath)
      const chunkSize = fs.statSync(chunkPath).size
      if (chunkSize > AUDIO_MAX_UPLOAD_BYTES) {
        throw new AudioTooLargeError(sizeMb(chunkSize))
      }
      prepared.push({ slice, chunkPath })
    }

    const transcripts = await mapPool(prepared, 2, async ({ slice, chunkPath }) => {
      const result = await transcribeFile(chunkPath)
      const chunk: ChunkTranscript = {
        offset: slice.start,
        segments: result.segments,
        language: result.language,
      }
      return chunk
    })

    return {
      segments: mergeChunkSegments(transcripts),
      language: pickTranscriptLanguage(transcripts),
    }
  } finally {
    await cleanupFiles(...chunkPaths)
  }
}

export async function transcribe(audioPath: string): Promise<TranscriptionResult> {
  const fileSizeBytes = fs.statSync(audioPath).size
  if (fileSizeBytes <= AUDIO_MAX_UPLOAD_BYTES) {
    return transcribeFile(audioPath)
  }

  const durationSeconds = await getMediaDurationSeconds(audioPath)
  if (durationSeconds == null || durationSeconds <= 0) {
    throw new AudioTooLargeError(sizeMb(fileSizeBytes))
  }

  return transcribeInChunks(audioPath, fileSizeBytes, durationSeconds)
}
