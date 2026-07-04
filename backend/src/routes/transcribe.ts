import { Router, type Request, type Response } from 'express'
import path from 'path'
import { mediaUpload } from '../middleware/upload.js'
import { cleanupFiles, extractAudio } from '../services/extractAudio.js'
import { transcribe } from '../services/transcribe.js'
import { isAudioFile } from '../utils/media.js'

const uploadsDir = path.resolve('uploads')

export const transcribeRouter = Router()

transcribeRouter.post(
  '/transcribe',
  mediaUpload.single('video'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'No se recibió ningún archivo' })
      return
    }

    const filePath = req.file.path
    let audioPath: string | null = null
    let tempAudioPath: string | null = null

    try {
      if (isAudioFile(req.file.originalname)) {
        audioPath = filePath
      } else {
        tempAudioPath = await extractAudio(filePath, uploadsDir)
        audioPath = tempAudioPath
      }

      const segments = await transcribe(audioPath)
      res.json({ segments })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      res.status(500).json({ error: message })
    } finally {
      if (isAudioFile(req.file.originalname)) {
        await cleanupFiles(filePath)
      } else {
        await cleanupFiles(filePath, ...(tempAudioPath ? [tempAudioPath] : []))
      }
    }
  }
)
