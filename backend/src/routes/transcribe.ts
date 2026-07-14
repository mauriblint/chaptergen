import { Router, type Request, type Response } from 'express'
import { statSync } from 'fs'
import path from 'path'
import { mediaUpload } from '../middleware/upload.js'
import {
  AUDIO_MAX_UPLOAD_BYTES,
  cleanupFiles,
  prepareAudioForTranscription,
} from '../services/extractAudio.js'
import { transcribe } from '../services/transcribe.js'

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

    try {
      audioPath = await prepareAudioForTranscription(filePath, uploadsDir)

      const audioSizeBytes = statSync(audioPath).size
      if (audioSizeBytes > AUDIO_MAX_UPLOAD_BYTES) {
        const sizeMb = (audioSizeBytes / (1024 * 1024)).toFixed(1)
        res.status(413).json({
          error: `El audio es demasiado largo para transcribir: ${sizeMb} MB tras comprimir (límite ~25 MB de OpenAI Whisper).`,
        })
        return
      }

      const segments = await transcribe(audioPath)
      res.json({ segments })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      res.status(500).json({ error: message })
    } finally {
      await cleanupFiles(filePath, ...(audioPath ? [audioPath] : []))
    }
  }
)
