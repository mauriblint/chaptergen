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
import { recordUsage, type UsageContext } from '../db/aiUsage.js'

/**
 * Where transcription runs. Groq serves Whisper large-v3-turbo through an
 * OpenAI-compatible API, with the same segment timestamps, for much less.
 * TRANSCRIBE_PROVIDER picks it; OpenAI stays the default.
 */
export type TranscribeProvider = 'openai' | 'groq'

const PROVIDERS: Record<TranscribeProvider, { model: string; keyEnv: string; baseURL?: string }> = {
  openai: { model: 'whisper-1', keyEnv: 'OPENAI_API_KEY' },
  groq: { model: 'whisper-large-v3-turbo', keyEnv: 'GROQ_API_KEY', baseURL: 'https://api.groq.com/openai/v1' },
}

export function defaultTranscribeProvider(): TranscribeProvider {
  return process.env.TRANSCRIBE_PROVIDER?.trim().toLowerCase() === 'groq' ? 'groq' : 'openai'
}

function clientFor(provider: TranscribeProvider): OpenAI {
  const { keyEnv, baseURL } = PROVIDERS[provider]
  const apiKey = process.env[keyEnv]
  if (!apiKey) {
    throw new Error(`${keyEnv} no está configurada`)
  }
  // Groq: one retry, then the OpenAI fallback takes over instead of waiting out a rate limit.
  return new OpenAI({ apiKey, baseURL, maxRetries: provider === 'groq' ? 1 : 2 })
}

/** Token usage the gpt-4o transcribe models report; whisper-1 reports seconds or nothing. */
interface TranscriptionUsage {
  type?: 'tokens' | 'duration'
  input_tokens?: number
  output_tokens?: number
  input_token_details?: { text_tokens?: number; audio_tokens?: number }
  seconds?: number
}

function recordTranscription(
  usageContext: UsageContext | undefined,
  model: string,
  response: { duration?: number; usage?: TranscriptionUsage },
  fallbackSeconds: number | null,
  durationMs: number
): void {
  const usage = response.usage
  const details = usage?.input_token_details
  recordUsage(usageContext, 'transcription', model, {
    inputTokens: details ? (details.text_tokens ?? 0) : 0,
    audioInputTokens: details ? (details.audio_tokens ?? 0) : (usage?.input_tokens ?? 0),
    outputTokens: usage?.output_tokens ?? 0,
    audioSeconds: usage?.seconds ?? response.duration ?? fallbackSeconds ?? undefined,
  }, durationMs)
}

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

function normalizeLanguage(language: unknown): string | null {
  if (typeof language !== 'string') return null
  const trimmed = language.trim()
  if (!trimmed || trimmed.length > 64) return null
  // Providers differ in case ("Spanish" vs "spanish").
  return trimmed.toLowerCase()
}

function sizeMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1)
}

/** `language` is an ISO-639-1 code; without it Whisper guesses from the first ~30 seconds. */
async function transcribeFile(
  audioPath: string,
  language: string | null | undefined,
  usage: UsageContext | undefined,
  provider: TranscribeProvider,
  durationSeconds: number | null = null
): Promise<TranscriptionResult> {
  const client = clientFor(provider)
  const model = PROVIDERS[provider].model

  const began = Date.now()
  const transcription = await client.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model,
    response_format: 'verbose_json',
    timestamp_granularities: ['segment'],
    ...(language ? { language } : {}),
  })

  recordTranscription(
    usage,
    model,
    transcription as { duration?: number; usage?: TranscriptionUsage },
    durationSeconds,
    Date.now() - began
  )
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
  durationSeconds: number,
  language: string | null | undefined,
  usage: UsageContext | undefined,
  provider: TranscribeProvider
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
      const result = await transcribeFile(chunkPath, language, usage, provider, slice.duration)
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

async function transcribeWith(
  audioPath: string,
  language: string | null | undefined,
  usage: UsageContext | undefined,
  provider: TranscribeProvider
): Promise<TranscriptionResult> {
  const fileSizeBytes = fs.statSync(audioPath).size
  if (fileSizeBytes <= AUDIO_MAX_UPLOAD_BYTES) {
    return transcribeFile(audioPath, language, usage, provider)
  }

  const durationSeconds = await getMediaDurationSeconds(audioPath)
  if (durationSeconds == null || durationSeconds <= 0) {
    throw new AudioTooLargeError(sizeMb(fileSizeBytes))
  }

  return transcribeInChunks(audioPath, fileSizeBytes, durationSeconds, language, usage, provider)
}

// Groq allows 2 hours of audio per hour on our plan, so a longer file would
// hit the limit halfway; it goes straight to OpenAI.
const GROQ_MAX_SECONDS = 2 * 60 * 60

/**
 * Transcribes with the configured provider. When that is Groq, anything it
 * cannot take (a rate limit, an outage, a very long file) falls back to
 * OpenAI, so the user never sees the difference. Passing `provider` forces
 * one provider with no fallback, for comparisons.
 */
export async function transcribe(
  audioPath: string,
  language?: string | null,
  usage?: UsageContext,
  provider?: TranscribeProvider
): Promise<TranscriptionResult> {
  if (provider) return transcribeWith(audioPath, language, usage, provider)

  if (defaultTranscribeProvider() === 'groq') {
    const seconds = await getMediaDurationSeconds(audioPath)
    if (seconds == null || seconds <= GROQ_MAX_SECONDS) {
      try {
        return await transcribeWith(audioPath, language, usage, 'groq')
      } catch (err) {
        if (err instanceof AudioTooLargeError) throw err
        console.warn('Groq transcription failed, falling back to OpenAI:', err instanceof Error ? err.message : err)
      }
    }
  }
  return transcribeWith(audioPath, language, usage, 'openai')
}
