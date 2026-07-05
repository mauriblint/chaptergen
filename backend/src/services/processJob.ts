import path from 'path'
import { cleanupFiles, extractAudio } from './extractAudio.js'
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
  let audioPath: string | null = null
  let tempAudioPath: string | null = null

  try {
    if (isAudioFile(job.fileName)) {
      updateJobStatus(jobId, 'transcribing')
      audioPath = filePath
    } else {
      updateJobStatus(jobId, 'extracting')
      tempAudioPath = await extractAudio(filePath, uploadsDir)
      audioPath = tempAudioPath
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
    if (isAudioFile(job.fileName)) {
      await cleanupFiles(filePath)
    } else {
      await cleanupFiles(filePath, ...(tempAudioPath ? [tempAudioPath] : []))
    }
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
