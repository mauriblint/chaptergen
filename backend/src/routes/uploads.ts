import { Router, type Request, type Response } from 'express'
import fs from 'fs'
import { chunkUpload } from '../middleware/chunkUpload.js'
import {
  UploadError,
  cleanupSession,
  getSession,
  initSession,
  mergeChunks,
  saveChunk,
} from '../services/chunkedUpload.js'
import { startJobFromFile } from '../services/startJobFromFile.js'
import { extractRequestMeta } from '../utils/requestMeta.js'

export const uploadsRouter = Router()

function handleUploadError(err: unknown, res: Response): void {
  if (err instanceof UploadError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }
  const message = err instanceof Error ? err.message : 'Unknown error'
  res.status(500).json({ error: message })
}

uploadsRouter.post('/uploads/init', (req: Request, res: Response) => {
  try {
    const { fileName, fileSize, chunkSize } = req.body ?? {}

    if (!fileName || typeof fileName !== 'string') {
      res.status(400).json({ error: 'fileName is required' })
      return
    }
    if (typeof fileSize !== 'number' || !Number.isFinite(fileSize)) {
      res.status(400).json({ error: 'fileSize must be a number' })
      return
    }
    if (typeof chunkSize !== 'number' || !Number.isFinite(chunkSize)) {
      res.status(400).json({ error: 'chunkSize must be a number' })
      return
    }

    const meta = initSession({ fileName, fileSize, chunkSize })
    res.status(201).json({
      uploadId: meta.uploadId,
      totalChunks: meta.totalChunks,
      chunkSize: meta.chunkSize,
    })
  } catch (err) {
    handleUploadError(err, res)
  }
})

uploadsRouter.post(
  '/uploads/:uploadId/chunks/:index',
  chunkUpload.single('chunk'),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No chunk received' })
        return
      }

      const uploadId = String(req.params.uploadId)
      const index = Number(req.params.index)

      if (!Number.isInteger(index)) {
        fs.unlinkSync(req.file.path)
        res.status(400).json({ error: 'Invalid chunk index' })
        return
      }

      const meta = saveChunk(uploadId, index, req.file.path)
      res.json({
        ok: true,
        index,
        receivedCount: meta.receivedChunks.length,
        totalChunks: meta.totalChunks,
      })
    } catch (err) {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
      handleUploadError(err, res)
    }
  }
)

uploadsRouter.post('/uploads/:uploadId/complete', async (req: Request, res: Response) => {
  const uploadId = String(req.params.uploadId)

  try {
    const meta = getSession(uploadId)
    const body = req.body ?? {}
    const autoMode = body.auto !== false
    const chapterCountRaw = body.chapterCount
    const chapterCount =
      chapterCountRaw != null && chapterCountRaw !== ''
        ? Number(chapterCountRaw)
        : null

    const finalPath = await mergeChunks(meta)
    const requestMeta = extractRequestMeta(req)

    const job = startJobFromFile({
      filePath: finalPath,
      fileName: meta.fileName,
      fileSizeBytes: meta.fileSize,
      autoMode,
      chapterCount: autoMode ? null : chapterCount,
      meta: requestMeta,
    })

    cleanupSession(uploadId)
    res.status(201).json({ id: job.id })
  } catch (err) {
    handleUploadError(err, res)
  }
})
