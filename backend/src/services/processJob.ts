import { statSync } from 'fs'
import path from 'path'
import {
  AUDIO_MAX_UPLOAD_BYTES,
  cleanupFiles,
  getMediaDurationSeconds,
  prepareAudioForTranscription,
} from './extractAudio.js'
import { generateChapters } from './generateChapters.js'
import type { RefineOptions } from '../types/refine.js'
import type { Chapter } from '../types.js'
import { AudioTooLargeError, transcribe } from './transcribe.js'
import {
  clearJobFilePath,
  getJob,
  incrementRefineCount,
  updateJobDuration,
  updateJobError,
  updateJobResult,
  updateJobSegments,
  updateJobRefineError,
  updateJobStatus,
} from '../db/jobs.js'
import { formatChapters } from '../types.js'
import { isAudioFile } from '../utils/media.js'
import { refundJobCredit, settleJobBilling } from '../billing/quota.js'
import { getUserById } from '../db/users.js'
import { sendJobReadyEmail } from './email.js'
import { forgetJob, isJobWatched } from './jobWatchers.js'

async function notifyIfUnwatched(jobId: string): Promise<void> {
  const job = getJob(jobId)
  if (!job?.userId || isJobWatched(jobId)) return
  const user = getUserById(job.userId)
  if (!user) return
  await sendJobReadyEmail({
    email: user.email,
    locale: user.locale,
    userId: user.id,
    jobId: job.id,
    fileName: job.fileName,
    ok: job.status === 'completed',
  })
}

/** Fails the job and gives back its credit if one was already charged. */
function failJob(jobId: string, message: string, reason: string | null = null): void {
  updateJobError(jobId, message, reason)
  const job = getJob(jobId)
  if (job) refundJobCredit(job)
}

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

    const durationSeconds = await getMediaDurationSeconds(audioPath)
    if (durationSeconds != null) {
      updateJobDuration(jobId, durationSeconds)
    }

    const audioSizeBytes = statSync(audioPath).size
    if (
      audioSizeBytes > AUDIO_MAX_UPLOAD_BYTES &&
      (durationSeconds == null || durationSeconds <= 0)
    ) {
      const sizeMb = (audioSizeBytes / (1024 * 1024)).toFixed(1)
      updateJobError(
        jobId,
        `El audio es demasiado largo para transcribir: ${sizeMb} MB tras comprimir (límite ~25 MB de OpenAI Whisper).`,
        'audio_too_large'
      )
      return
    }

    const billed = settleJobBilling(getJob(jobId) ?? job, durationSeconds)
    if (!billed.ok) {
      updateJobError(jobId, billed.message, billed.reason)
      return
    }

    if (!isAudio) {
      updateJobStatus(jobId, 'transcribing')
    }

    const { segments, language } = await transcribe(audioPath)
    // Silence or music comes back as nothing or a single garbled token.
    const words = segments.reduce((n, seg) => n + seg.text.trim().split(/\s+/).filter(Boolean).length, 0)
    if (words < 3) {
      failJob(jobId, 'No speech was detected in this file.', 'no_speech')
      return
    }
    updateJobSegments(jobId, segments, language)

    const count = job.autoMode
      ? null
      : Math.min(20, Math.max(3, job.chapterCount ?? 10))

    const chapters = await generateChapters(segments, {
      chapterCount: count,
      language,
    })
    const formatted = formatChapters(chapters)
    updateJobResult(jobId, chapters, formatted, segments)
  } catch (err) {
    if (err instanceof AudioTooLargeError) {
      failJob(jobId, err.message, err.reason)
    } else {
      const message = err instanceof Error ? err.message : 'Unknown error'
      failJob(jobId, message)
    }
  } finally {
    await cleanupFiles(filePath, ...(audioPath ? [audioPath] : []))
    clearJobFilePath(jobId)
    await notifyIfUnwatched(jobId).catch((err) => console.error('ready email error:', err))
    forgetJob(jobId)
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
      language: job.transcriptLanguage,
      existingChapters:
        options.mode === 'titles'
          ? (existingChapters ?? job.chapters ?? undefined)
          : undefined,
    })
    const formatted = formatChapters(chapters)
    updateJobResult(jobId, chapters, formatted)
    incrementRefineCount(jobId)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    updateJobRefineError(jobId, message)
  }
}
