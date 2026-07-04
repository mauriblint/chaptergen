import multer from 'multer'
import path from 'path'
import { MEDIA_EXTENSIONS } from '../utils/media.js'

const uploadsDir = path.resolve('uploads')
const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB ?? 500)

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

export const mediaUpload = multer({
  storage,
  limits: { fileSize: maxFileSizeMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (MEDIA_EXTENSIONS.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error(`Formato no soportado: ${ext}. Usá: ${MEDIA_EXTENSIONS.join(', ')}`))
    }
  },
})
