import fs from 'fs'
import OpenAI from 'openai'
import type { TranscriptSegment } from '../types.js'

export interface TranscriptionResult {
  segments: TranscriptSegment[]
  language: string | null
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

export async function transcribe(audioPath: string): Promise<TranscriptionResult> {
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
