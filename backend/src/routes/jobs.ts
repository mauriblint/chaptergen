import { Router, type Request, type Response } from 'express'
import { mediaUpload } from '../middleware/upload.js'
import { getJob, listJobsByUserId, updateJobResult, type JobRecord } from '../db/jobs.js'
import { refineJobChapters } from '../services/processJob.js'
import { startJobFromFile } from '../services/startJobFromFile.js'
import { markJobWatched } from '../services/jobWatchers.js'
import {
  DEFAULT_SUBTITLE_OPTIONS,
  plainTranscript,
  toDocx,
  toSrt,
  toVtt,
  toZip,
  youtubeChapters,
  type SubtitleOptions,
} from '../services/exports.js'
import type { RefineOptions } from '../types/refine.js'
import { formatChapters, type Chapter } from '../types.js'
import { extractRequestMeta } from '../utils/requestMeta.js'
import { assertCanRefine, assertCanStartJob, PaywallError, sendPaywall } from '../billing/quota.js'
import { FREE_REFINE_LIMIT } from '../billing/packs.js'
import { requireUser } from '../auth/session.js'

export const jobsRouter = Router()

/**
 * Jobs that belong to an account are private to it. Jobs created before
 * accounts were required have no owner and stay reachable by their id.
 */
function canAccess(req: Request, job: JobRecord): boolean {
  if (!job.userId) return true
  return req.user?.id === job.userId
}

function loadJob(req: Request, res: Response): JobRecord | null {
  const job = getJob(String(req.params.id))
  if (!job || !canAccess(req, job)) {
    res.status(404).json({ error: 'Job not found' })
    return null
  }
  return job
}

function jobToResponse(job: JobRecord) {
  const finished = job.status === 'completed' || job.status === 'failed'
  const refineLimited = job.creditSource !== 'paid'
  return {
    id: job.id,
    status: job.status,
    fileName: job.fileName,
    fileExtension: job.fileExtension,
    mediaType: job.mediaType,
    fileSizeBytes: job.fileSizeBytes,
    durationSeconds: job.durationSeconds,
    language: job.transcriptLanguage,
    autoMode: job.autoMode,
    chapterCount: job.chapterCount,
    chaptersGenerated: job.chaptersGenerated,
    hasTranscript: finished && !!job.segments?.length,
    chapters: job.chapters,
    formatted: job.formatted,
    youtube: job.chapters?.length ? youtubeChapters(job.chapters) : null,
    segments: finished ? job.segments : null,
    refineCount: job.refineCount,
    refinesLeft: refineLimited ? Math.max(0, FREE_REFINE_LIMIT - job.refineCount) : null,
    creditSource: job.creditSource,
    creditsRefunded: job.creditsRefunded,
    error: job.errorMessage,
    failureReason: job.failureReason,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  }
}

jobsRouter.get('/jobs', requireUser, (req: Request, res: Response) => {
  const jobs = listJobsByUserId(req.user!.id, 200).map((job) => ({
    id: job.id,
    status: job.status,
    fileName: job.fileName,
    fileExtension: job.fileExtension,
    mediaType: job.mediaType,
    durationSeconds: job.durationSeconds,
    language: job.transcriptLanguage,
    chaptersGenerated: job.chaptersGenerated,
    creditsRefunded: job.creditsRefunded,
    failureReason: job.failureReason,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  }))
  res.json({ jobs })
})

jobsRouter.post('/jobs', mediaUpload.single('video'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file received' })
    return
  }

  try {
    assertCanStartJob(req.user)
  } catch (err) {
    if (err instanceof PaywallError) {
      sendPaywall(res, err)
      return
    }
    throw err
  }

  const autoRaw = req.body.auto
  const autoMode = autoRaw !== 'false' && autoRaw !== false
  const chapterCountRaw = req.body.chapterCount
  const chapterCount =
    chapterCountRaw != null && chapterCountRaw !== '' ? Number(chapterCountRaw) : null

  const job = startJobFromFile({
    filePath: req.file.path,
    fileName: req.file.originalname,
    fileSizeBytes: req.file.size,
    fileType: req.file.mimetype,
    autoMode,
    chapterCount: autoMode ? null : chapterCount,
    meta: extractRequestMeta(req),
    userId: req.user!.id,
  })

  res.status(201).json({ id: job.id })
})

jobsRouter.get('/jobs/:id', (req: Request, res: Response) => {
  const job = loadJob(req, res)
  if (!job) return
  markJobWatched(job.id)
  res.json(jobToResponse(job))
})

function parseChapters(value: unknown): Chapter[] | null {
  if (!Array.isArray(value) || value.length > 100) return null
  const chapters: Chapter[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') return null
    const { time, title } = item as Record<string, unknown>
    if (typeof time !== 'string' || !/^\d{1,2}(:\d{2}){1,2}$/.test(time.trim())) return null
    if (typeof title !== 'string' || title.length > 200) return null
    chapters.push({ time: time.trim(), title: title.trim() })
  }
  return chapters
}

/** Saves edits made in the chapter editor. */
jobsRouter.patch('/jobs/:id/chapters', (req: Request, res: Response) => {
  const job = loadJob(req, res)
  if (!job) return
  if (job.status !== 'completed') {
    res.status(409).json({ error: 'Job is not finished yet' })
    return
  }
  const chapters = parseChapters(req.body?.chapters)
  if (!chapters) {
    res.status(400).json({ error: 'Invalid chapters' })
    return
  }
  updateJobResult(job.id, chapters, formatChapters(chapters))
  res.json(jobToResponse(getJob(job.id)!))
})

jobsRouter.post('/jobs/:id/refine', async (req: Request, res: Response) => {
  const job = loadJob(req, res)
  if (!job) return
  if (job.status !== 'completed' && job.status !== 'failed') {
    res.status(409).json({ error: 'Job is still processing' })
    return
  }
  if (!job.segments?.length) {
    res.status(400).json({ error: 'No transcript available' })
    return
  }

  try {
    assertCanRefine(req.user, job)
  } catch (err) {
    if (err instanceof PaywallError) {
      sendPaywall(res, err)
      return
    }
    throw err
  }

  const body = req.body ?? {}
  const options: RefineOptions = {
    mode: body.mode ?? 'both',
    granularity: body.granularity ?? 'balanced',
    contentType: body.contentType ?? 'auto',
    titleStyle: body.titleStyle ?? 'descriptive',
    autoMode: body.autoMode !== false,
    chapterCount: body.chapterCount,
    instructions: body.instructions,
  }
  const existingChapters = parseChapters(body.existingChapters) ?? undefined

  void refineJobChapters(job.id, options, existingChapters)
  res.json({ ok: true })
})

function subtitleOptions(req: Request): SubtitleOptions {
  const chars = Number(req.query.maxChars)
  const lines = Number(req.query.maxLines)
  return {
    maxCharsPerLine:
      Number.isInteger(chars) && chars >= 16 && chars <= 80 ? chars : DEFAULT_SUBTITLE_OPTIONS.maxCharsPerLine,
    maxLines: Number.isInteger(lines) && lines >= 1 && lines <= 3 ? lines : DEFAULT_SUBTITLE_OPTIONS.maxLines,
  }
}

function sendFile(res: Response, name: string, type: string, body: string | Buffer): void {
  res.setHeader('Content-Type', type)
  // ASCII fallback plus the UTF-8 name, so accents and spaces survive.
  const ascii = name.replace(/[^\x20-\x7e]/g, '_').replace(/"/g, '')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`
  )
  res.send(body)
}

jobsRouter.get('/jobs/:id/download/:type', async (req: Request, res: Response) => {
  const job = loadJob(req, res)
  if (!job) return

  const type = String(req.params.type)
  const baseName = job.fileName.replace(/\.[^.]+$/, '') || 'chaptergen'
  const text = 'text/plain; charset=utf-8'

  if (type === 'chapters') {
    if (!job.chapters?.length) {
      res.status(404).json({ error: 'Chapters not ready yet' })
      return
    }
    sendFile(res, `${baseName}-chapters.txt`, text, youtubeChapters(job.chapters))
    return
  }

  const segments = job.segments
  if (!segments?.length) {
    res.status(404).json({ error: 'Transcript not ready yet' })
    return
  }

  try {
    switch (type) {
      case 'transcript':
        sendFile(res, `${baseName}-transcript.txt`, text, plainTranscript(segments, true))
        return
      case 'text':
        sendFile(res, `${baseName}-transcript.txt`, text, plainTranscript(segments, false))
        return
      case 'srt':
        sendFile(res, `${baseName}.srt`, 'application/x-subrip; charset=utf-8', toSrt(segments, subtitleOptions(req)))
        return
      case 'vtt':
        sendFile(res, `${baseName}.vtt`, 'text/vtt; charset=utf-8', toVtt(segments, subtitleOptions(req)))
        return
      case 'docx':
        sendFile(
          res,
          `${baseName}-transcript.docx`,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          await toDocx({ title: baseName, segments, chapters: job.chapters })
        )
        return
      case 'zip':
        sendFile(
          res,
          `${baseName}-chaptergen.zip`,
          'application/zip',
          await toZip({ baseName, segments, chapters: job.chapters })
        )
        return
      default:
        res.status(400).json({ error: 'Invalid download type' })
    }
  } catch (err) {
    console.error('download error:', err)
    res.status(500).json({ error: 'Could not build the file' })
  }
})

/** Subtitle preview with custom line settings, without downloading a file. */
jobsRouter.get('/jobs/:id/subtitles', (req: Request, res: Response) => {
  const job = loadJob(req, res)
  if (!job) return
  if (!job.segments?.length) {
    res.status(404).json({ error: 'Transcript not ready yet' })
    return
  }
  const format = req.query.format === 'vtt' ? 'vtt' : 'srt'
  const options = subtitleOptions(req)
  res.json({
    format,
    content: format === 'vtt' ? toVtt(job.segments, options) : toSrt(job.segments, options),
  })
})
