import { Router, type Request, type Response } from 'express'
import path from 'path'
import { mediaUpload } from '../middleware/upload.js'
import {
  createJob,
  generateJobId,
  getJob,
  updateJobStatus,
  type JobRecord,
} from '../db/jobs.js'
import { processJob, refineJobChapters } from '../services/processJob.js'
import type { RefineOptions } from '../types/refine.js'
import type { Chapter } from '../types.js'
import { formatSecondsToTimestamp } from '../types.js'
import { getMediaType } from '../utils/media.js'
import { extractRequestMeta } from '../utils/requestMeta.js'

export const jobsRouter = Router()

function jobToResponse(job: JobRecord) {
  const finished = job.status === 'completed' || job.status === 'failed'
  return {
    id: job.id,
    status: job.status,
    fileName: job.fileName,
    autoMode: job.autoMode,
    chapterCount: job.chapterCount,
    chaptersGenerated: job.chaptersGenerated,
    hasTranscript: finished && !!job.segments?.length,
    chapters: job.chapters,
    formatted: job.formatted,
    error: job.errorMessage,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  }
}

jobsRouter.post(
  '/jobs',
  mediaUpload.single('video'),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file received' })
      return
    }

    const autoRaw = req.body.auto
    const autoMode = autoRaw !== 'false' && autoRaw !== false
    const chapterCountRaw = req.body.chapterCount
    const chapterCount =
      chapterCountRaw != null && chapterCountRaw !== ''
        ? Number(chapterCountRaw)
        : null

    const id = generateJobId()
    const meta = extractRequestMeta(req)
    const job = createJob({
      id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      autoMode,
      chapterCount: autoMode ? null : chapterCount,
      fileSizeBytes: req.file.size,
      fileType: req.file.mimetype,
      fileExtension: path.extname(req.file.originalname).toLowerCase(),
      mediaType: getMediaType(req.file.originalname),
      clientIp: meta.clientIp,
      country: meta.country,
      userAgent: meta.userAgent,
      acceptLanguage: meta.acceptLanguage,
      referer: meta.referer,
      clientId: meta.clientId,
    })

    updateJobStatus(id, 'pending')
    void processJob(id)

    res.status(201).json({ id: job.id })
  }
)

jobsRouter.get('/jobs/:id', (req: Request, res: Response) => {
  const id = String(req.params.id)
  const job = getJob(id)
  if (!job) {
    res.status(404).json({ error: 'Job not found' })
    return
  }
  res.json(jobToResponse(job))
})

jobsRouter.post('/jobs/:id/refine', async (req: Request, res: Response) => {
  const id = String(req.params.id)
  const job = getJob(id)
  if (!job) {
    res.status(404).json({ error: 'Job not found' })
    return
  }
  if (job.status !== 'completed' && job.status !== 'failed') {
    res.status(409).json({ error: 'Job is still processing' })
    return
  }
  if (!job.segments?.length) {
    res.status(400).json({ error: 'No transcript available' })
    return
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
  const existingChapters = body.existingChapters as Chapter[] | undefined

  void refineJobChapters(job.id, options, existingChapters)
  res.json({ ok: true })
})

jobsRouter.get('/jobs/:id/download/:type', (req: Request, res: Response) => {
  const id = String(req.params.id)
  const job = getJob(id)
  if (!job) {
    res.status(404).json({ error: 'Job not found' })
    return
  }

  const { type } = req.params
  const baseName = job.fileName.replace(/\.[^.]+$/, '')

  if (type === 'chapters') {
    if (!job.formatted) {
      res.status(404).json({ error: 'Chapters not ready yet' })
      return
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${baseName}-chapters.txt"`)
    res.send(job.formatted)
    return
  }

  if (type === 'transcript') {
    if (!job.segments?.length) {
      res.status(404).json({ error: 'Transcript not ready yet' })
      return
    }
    const text = job.segments
      .map(
        (seg) =>
          `[${formatSecondsToTimestamp(seg.start)} - ${formatSecondsToTimestamp(seg.end)}] ${seg.text}`
      )
      .join('\n')
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${baseName}-transcript.txt"`)
    res.send(text)
    return
  }

  res.status(400).json({ error: 'Invalid download type. Use chapters or transcript.' })
})
