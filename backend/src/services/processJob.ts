import { statSync } from 'fs'
import path from 'path'
import {
  AUDIO_MAX_UPLOAD_BYTES,
  cleanupFiles,
  getMediaDurationSeconds,
  hasAudioStream,
  prepareAudioForTranscription,
} from './extractAudio.js'
import { generateChapters } from './generateChapters.js'
import type { RefineOptions } from '../types/refine.js'
import type { Chapter, TranscriptSegment } from '../types.js'
import { AudioTooLargeError, transcribe } from './transcribe.js'
import {
  claimRetranscribe,
  clearJobFilePath,
  getJob,
  releaseRetranscribe,
  replaceJobTranscript,
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
import { forgetJob, wasJobSeenSince } from './jobWatchers.js'
import { discardJobAudio, keepAudioForRetranscribe } from './audioRetention.js'
import { looksLikeNoSpeech } from './speechCheck.js'
import { AUDIO_LANGUAGES } from '../utils/languages.js'

function chapterCountFor(job: { autoMode: boolean; chapterCount: number | null }): number | null {
  return job.autoMode ? null : Math.min(20, Math.max(3, job.chapterCount ?? 10))
}

// An open job page polls every 2 seconds (slower in a background tab), so it
// picks up the result well within this.
const SEEN_GRACE_MS = 8_000

/** Emails the result unless the open job page picked it up after it finished. */
async function notifyIfUnwatched(jobId: string): Promise<void> {
  const finishedAt = Date.now()
  await new Promise((resolve) => setTimeout(resolve, SEEN_GRACE_MS))
  const seen = wasJobSeenSince(jobId, finishedAt)
  forgetJob(jobId)
  const job = getJob(jobId)
  if (!job?.userId || seen) return
  const user = getUserById(job.userId)
  if (!user) return
  await sendJobReadyEmail({
    email: user.email,
    locale: user.locale,
    userId: user.id,
    jobId: job.id,
    fileName: job.fileName,
    ok: job.status === 'completed',
    durationSeconds: job.durationSeconds,
    chapters: job.chapters,
    wordCount: (job.segments ?? []).reduce((n, s) => n + s.text.trim().split(/\s+/).filter(Boolean).length, 0),
    failureReason: job.failureReason,
    refunded: job.creditsRefunded,
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
    if ((await hasAudioStream(filePath)) === false) {
      failJob(jobId, 'This file has no audio track.', 'no_audio')
      return
    }
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

    const { segments, language } = await transcribe(audioPath, job.audioLanguage, { jobId, reason: 'initial' })
    // Silence or music comes back as nothing, or as one invented line on repeat.
    if (looksLikeNoSpeech(segments)) {
      failJob(jobId, 'No speech was detected in this file.', 'no_speech')
      return
    }
    updateJobSegments(jobId, segments, language)

    const chapters = await generateChapters(segments, {
      chapterCount: chapterCountFor(job),
      language,
      usage: { jobId, reason: 'initial' },
    })
    const formatted = formatChapters(chapters)
    updateJobResult(jobId, chapters, formatted, segments)
    if (job.userId && keepAudioForRetranscribe(jobId, audioPath)) {
      audioPath = null
    }
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
    void notifyIfUnwatched(jobId).catch((err) => console.error('ready email error:', err))
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
      usage: { jobId, reason: 'refine' },
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

/** Throws when the job cannot be re-transcribed; otherwise claims the one retry and starts it. */
export function startRetranscribe(jobId: string, language: string): void {
  if (!claimRetranscribe(jobId)) {
    throw new Error('This video was already re-transcribed')
  }
  updateJobStatus(jobId, 'transcribing')
  void retranscribeJob(jobId, language)
}

async function retranscribeJob(jobId: string, language: string): Promise<void> {
  const job = getJob(jobId)
  if (!job?.audioPath) {
    releaseRetranscribe(jobId)
    updateJobRefineError(jobId, 'The audio of this video is no longer available', 'retranscribe_failed')
    return
  }

  try {
    const { segments, language: reported } = await transcribe(job.audioPath, language, { jobId, reason: 'retranscribe' })
    if (looksLikeNoSpeech(segments)) {
      throw new Error('No speech was detected in this language.')
    }
    updateJobStatus(jobId, 'generating')
    const transcriptLanguage = reported ?? AUDIO_LANGUAGES[language] ?? null
    const chapters = await generateChapters(segments, {
      chapterCount: chapterCountFor(job),
      language: transcriptLanguage,
      usage: { jobId, reason: 'retranscribe' },
    })
    replaceJobTranscript(jobId, {
      segments,
      transcriptLanguage,
      audioLanguage: language,
      chapters,
      formatted: formatChapters(chapters),
    })
    await discardJobAudio(jobId, job.audioPath)
  } catch (err) {
    // The previous result stays and the retry is given back.
    releaseRetranscribe(jobId)
    const message = err instanceof Error ? err.message : 'Unknown error'
    updateJobRefineError(jobId, message, 'retranscribe_failed')
  }
}
