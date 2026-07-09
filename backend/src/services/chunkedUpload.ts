import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'
import { MEDIA_EXTENSIONS } from '../utils/media.js'

const uploadsDir = path.resolve('uploads')
const partsDir = path.join(uploadsDir, 'parts')

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB ?? 500)
const chunkMaxSizeMb = Number(process.env.CHUNK_MAX_SIZE_MB ?? 50)
const chunkMinSizeMb = 5
const uploadSessionTtlHours = Number(process.env.UPLOAD_SESSION_TTL_HOURS ?? 24)

export const CHUNK_MAX_SIZE_BYTES = chunkMaxSizeMb * 1024 * 1024
export const MAX_FILE_SIZE_BYTES = maxFileSizeMb * 1024 * 1024
export const UPLOAD_SESSION_TTL_MS = uploadSessionTtlHours * 60 * 60 * 1000

export interface UploadSessionMeta {
  uploadId: string
  fileName: string
  fileSize: number
  chunkSize: number
  totalChunks: number
  receivedChunks: number[]
  createdAt: string
}

function sessionDir(uploadId: string): string {
  return path.join(partsDir, uploadId)
}

function metaPath(uploadId: string): string {
  return path.join(sessionDir(uploadId), 'meta.json')
}

function chunkPath(uploadId: string, index: number): string {
  return path.join(sessionDir(uploadId), String(index))
}

function ensurePartsDir(): void {
  if (!fs.existsSync(partsDir)) {
    fs.mkdirSync(partsDir, { recursive: true })
  }
}

function readMeta(uploadId: string): UploadSessionMeta | null {
  const file = metaPath(uploadId)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as UploadSessionMeta
}

function writeMeta(meta: UploadSessionMeta): void {
  fs.writeFileSync(metaPath(meta.uploadId), JSON.stringify(meta, null, 2))
}

export function validateFileName(fileName: string): void {
  const ext = path.extname(fileName).toLowerCase()
  if (!MEDIA_EXTENSIONS.includes(ext)) {
    throw new UploadError(
      `Unsupported format: ${ext}. Use: ${MEDIA_EXTENSIONS.join(', ')}`,
      400
    )
  }
}

export function validateChunkSize(chunkSize: number): void {
  const minBytes = chunkMinSizeMb * 1024 * 1024
  if (chunkSize < minBytes || chunkSize > CHUNK_MAX_SIZE_BYTES) {
    throw new UploadError(
      `chunkSize must be between ${chunkMinSizeMb}MB and ${chunkMaxSizeMb}MB`,
      400
    )
  }
}

export class UploadError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message)
    this.name = 'UploadError'
  }
}

export function initSession(input: {
  fileName: string
  fileSize: number
  chunkSize: number
}): UploadSessionMeta {
  ensurePartsDir()
  validateFileName(input.fileName)

  if (input.fileSize <= 0) {
    throw new UploadError('fileSize must be greater than 0', 400)
  }
  if (input.fileSize > MAX_FILE_SIZE_BYTES) {
    throw new UploadError('File exceeds maximum allowed size', 413)
  }

  validateChunkSize(input.chunkSize)

  const uploadId = crypto.randomUUID()
  const totalChunks = Math.ceil(input.fileSize / input.chunkSize)
  const dir = sessionDir(uploadId)
  fs.mkdirSync(dir, { recursive: true })

  const meta: UploadSessionMeta = {
    uploadId,
    fileName: path.basename(input.fileName),
    fileSize: input.fileSize,
    chunkSize: input.chunkSize,
    totalChunks,
    receivedChunks: [],
    createdAt: new Date().toISOString(),
  }

  writeMeta(meta)
  return meta
}

export function getSession(uploadId: string): UploadSessionMeta {
  const meta = readMeta(uploadId)
  if (!meta) {
    throw new UploadError('Upload session not found', 404)
  }
  return meta
}

export function saveChunk(
  uploadId: string,
  index: number,
  tempPath: string
): UploadSessionMeta {
  const meta = getSession(uploadId)

  if (!Number.isInteger(index) || index < 0 || index >= meta.totalChunks) {
    fs.unlinkSync(tempPath)
    throw new UploadError('Invalid chunk index', 400)
  }

  const dest = chunkPath(uploadId, index)
  fs.renameSync(tempPath, dest)

  if (!meta.receivedChunks.includes(index)) {
    meta.receivedChunks.push(index)
    meta.receivedChunks.sort((a, b) => a - b)
    writeMeta(meta)
  }

  return meta
}

export function validateComplete(meta: UploadSessionMeta): void {
  if (meta.receivedChunks.length !== meta.totalChunks) {
    throw new UploadError('Not all chunks have been uploaded', 409)
  }

  for (let i = 0; i < meta.totalChunks; i++) {
    if (!meta.receivedChunks.includes(i)) {
      throw new UploadError(`Missing chunk ${i}`, 409)
    }
    const part = chunkPath(meta.uploadId, i)
    if (!fs.existsSync(part)) {
      throw new UploadError(`Missing chunk file ${i}`, 409)
    }
  }

  let totalSize = 0
  for (let i = 0; i < meta.totalChunks; i++) {
    totalSize += fs.statSync(chunkPath(meta.uploadId, i)).size
  }

  if (totalSize !== meta.fileSize) {
    throw new UploadError('Merged file size does not match expected size', 409)
  }
}

export async function mergeChunks(meta: UploadSessionMeta): Promise<string> {
  validateComplete(meta)

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const ext = path.extname(meta.fileName)
  const finalPath = path.join(uploadsDir, `${unique}${ext}`)
  const writeStream = createWriteStream(finalPath)

  try {
    for (let i = 0; i < meta.totalChunks; i++) {
      const readStream = createReadStream(chunkPath(meta.uploadId, i))
      await pipeline(readStream, writeStream, { end: false })
    }
  } catch (err) {
    writeStream.destroy()
    if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath)
    throw err
  }

  await new Promise<void>((resolve, reject) => {
    writeStream.end(() => resolve())
    writeStream.on('error', reject)
  })

  const finalSize = fs.statSync(finalPath).size
  if (finalSize !== meta.fileSize) {
    fs.unlinkSync(finalPath)
    throw new UploadError('Merged file size verification failed', 500)
  }

  return finalPath
}

export function cleanupSession(uploadId: string): void {
  const dir = sessionDir(uploadId)
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

export function cleanupExpiredSessions(): number {
  ensurePartsDir()
  const now = Date.now()
  let removed = 0

  for (const entry of fs.readdirSync(partsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue

    const uploadId = entry.name
    const metaFile = metaPath(uploadId)
    if (!fs.existsSync(metaFile)) {
      fs.rmSync(path.join(partsDir, uploadId), { recursive: true, force: true })
      removed++
      continue
    }

    try {
      const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8')) as UploadSessionMeta
      const createdAt = new Date(meta.createdAt).getTime()
      if (now - createdAt > UPLOAD_SESSION_TTL_MS) {
        cleanupSession(uploadId)
        removed++
      }
    } catch {
      fs.rmSync(path.join(partsDir, uploadId), { recursive: true, force: true })
      removed++
    }
  }

  return removed
}
