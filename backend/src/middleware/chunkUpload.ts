import multer from 'multer'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { CHUNK_MAX_SIZE_BYTES } from '../services/chunkedUpload.js'

const tempDir = path.join(os.tmpdir(), 'chaptergen-chunks')

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tempDir)
  },
  filename: (_req, _file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}`)
  },
})

export const chunkUpload = multer({
  storage,
  limits: { fileSize: CHUNK_MAX_SIZE_BYTES + 1024 * 1024 },
})
