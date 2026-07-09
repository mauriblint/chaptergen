import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { adminRouter } from './routes/admin.js'
import { chaptersRouter } from './routes/chapters.js'
import { jobsRouter } from './routes/jobs.js'
import { transcribeRouter } from './routes/transcribe.js'
import { uploadsRouter } from './routes/uploads.js'
import { cleanupExpiredSessions } from './services/chunkedUpload.js'

dotenv.config()
if (fs.existsSync(path.resolve('.env.production'))) {
  dotenv.config({
    path: '.env.production',
    override: process.env.NODE_ENV === 'production',
  })
}

const app = express()
const port = Number(process.env.PORT ?? 3006)
const uploadsDir = path.resolve('uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set')
}

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', transcribeRouter)
app.use('/api', chaptersRouter)
app.use('/api', jobsRouter)
app.use('/api', uploadsRouter)
app.use('/api', adminRouter)

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(413).json({ error: 'Chunk or file exceeds maximum allowed size' })
        return
      }
    }
    res.status(500).json({ error: err.message })
  }
)

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
  cleanupExpiredSessions()
  setInterval(cleanupExpiredSessions, 6 * 60 * 60 * 1000)
})
