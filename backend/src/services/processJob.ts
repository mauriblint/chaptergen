import { statSync } from 'fs'
import path from 'path'
import {
  AUDIO_MAX_UPLOAD_BYTES,
  cleanupFiles,
  prepareAudioForTranscription,
} from './extractAudio.js'
import { generateChapters } from './generateChapters.js'
import type { RefineOptions } from '../types/refine.js'
import type { Chapter } from '../types.js'
import { transcribe } from './transcribe.js'
import {
  clearJobFilePath,
  getJob,
  updateJobError,
  updateJobResult,
  updateJobSegments,
  updateJobStatus,
} from '../db/jobs.js'
import { formatChapters } from '../types.js'
import { isAudioFile } from '../utils/media.js'

const uploadsDir = path.resolve('uploads')

export async function processJob(jobId: string): Promise<void> {
  const job = getJob(jobId)
  if (!job?.filePath) {
    updateJobError(jobId, 'Job file not found')
    return
  }

  const filePath = job.filePath
  const isAudio = isAudioFile(job.fileName)
  let audioPath: string | null = null

  try {
    updateJobStatus(jobId, isAudio ? 'transcribing' : 'extracting')
    audioPath = await prepareAudioForTranscription(filePath, uploadsDir)

    const audioSizeBytes = statSync(audioPath).size
    if (audioSizeBytes > AUDIO_MAX_UPLOAD_BYTES) {
      const sizeMb = (audioSizeBytes / (1024 * 1024)).toFixed(1)
      updateJobError(
        jobId,
        `El audio es demasiado largo para transcribir: ${sizeMb} MB tras comprimir (límite ~25 MB de OpenAI Whisper).`,
        'audio_too_large'
      )
      return
    }

    if (!isAudio) {
      updateJobStatus(jobId, 'transcribing')
    }

    const segments = await transcribe(audioPath)
    updateJobSegments(jobId, segments)

    const count = job.autoMode
      ? null
      : Math.min(20, Math.max(3, job.chapterCount ?? 10))

    const chapters = await generateChapters(segments, { chapterCount: count })
    const formatted = formatChapters(chapters)
    updateJobResult(jobId, chapters, formatted, segments)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    updateJobError(jobId, message)
  } finally {
    await cleanupFiles(filePath, ...(audioPath ? [audioPath] : []))
    clearJobFilePath(jobId)
  }
}

export async function refineJobChapters(
  jobId: string,
  options: RefineOptions,
  existingChapters?: Chapter[]
): Promise<void> {
  const job = getJob(jobId)
  if (!job?.segments?.length) {
    updateJobError(jobId, 'No transcript available to refine chapters')
    return
  }

  try {
    updateJobStatus(jobId, 'regenerating')
    const count = options.autoMode
      ? null
      : Math.min(20, Math.max(3, options.chapterCount ?? 10))
    const chapters = await generateChapters(job.segments, {
      chapterCount: count,
      refine: options,
      existingChapters:
        options.mode === 'titles'
          ? (existingChapters ?? job.chapters ?? undefined)
          : undefined,
    })
    const formatted = formatChapters(chapters)
    updateJobResult(jobId, chapters, formatted)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    updateJobError(jobId, message)
  }
}
