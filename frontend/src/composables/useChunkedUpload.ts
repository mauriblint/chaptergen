import { ref } from 'vue'
import { getClientId } from '../utils/clientId'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'
const CHUNK_SIZE_MB = Number(import.meta.env.VITE_UPLOAD_CHUNK_SIZE_MB ?? 20)
const MAX_RETRIES = Number(import.meta.env.VITE_UPLOAD_MAX_RETRIES ?? 3)
const CHUNK_SIZE_BYTES = CHUNK_SIZE_MB * 1024 * 1024

export interface UploadProgress {
  bytesUploaded: number
  totalBytes: number
  percent: number
  currentChunk: number
  totalChunks: number
}

export interface UploadCallbacks {
  onProgress?: (progress: UploadProgress) => void
  onRetry?: (chunkIndex: number) => void
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function parseError(response: Response): Promise<string> {
  const data = await response.json().catch(() => ({}))
  return (data as { error?: string }).error ?? `Error ${response.status}`
}

async function initUpload(
  file: File,
  chunkSize: number
): Promise<{ uploadId: string; totalChunks: number; chunkSize: number }> {
  const response = await fetch(`${API_BASE}/uploads/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileSize: file.size,
      chunkSize,
    }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return response.json()
}

async function uploadChunk(
  uploadId: string,
  index: number,
  chunk: Blob
): Promise<void> {
  const formData = new FormData()
  formData.append('chunk', chunk, `chunk-${index}`)

  const response = await fetch(`${API_BASE}/uploads/${uploadId}/chunks/${index}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }
}

async function uploadChunkWithRetry(
  uploadId: string,
  index: number,
  chunk: Blob,
  onRetry?: (chunkIndex: number) => void
): Promise<void> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await uploadChunk(uploadId, index, chunk)
      return
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Upload failed')
      if (attempt < MAX_RETRIES - 1) {
        onRetry?.(index + 1)
        await sleep(1000 * 2 ** attempt)
      }
    }
  }

  throw lastError ?? new Error('Upload failed')
}

async function completeUpload(
  uploadId: string,
  autoMode: boolean,
  chapterCount?: number
): Promise<string> {
  const body: Record<string, unknown> = { auto: autoMode }
  if (!autoMode && chapterCount != null) {
    body.chapterCount = chapterCount
  }

  const response = await fetch(`${API_BASE}/uploads/${uploadId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': getClientId(),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const data = await response.json()
  return data.id as string
}

export async function uploadFileAndCreateJob(
  file: File,
  autoMode: boolean,
  chapterCount?: number,
  callbacks: UploadCallbacks = {}
): Promise<string> {
  const { uploadId, totalChunks, chunkSize } = await initUpload(file, CHUNK_SIZE_BYTES)
  let bytesUploaded = 0

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)

    await uploadChunkWithRetry(uploadId, i, chunk, callbacks.onRetry)

    bytesUploaded += chunk.size
    callbacks.onProgress?.({
      bytesUploaded,
      totalBytes: file.size,
      percent: Math.round((bytesUploaded / file.size) * 100),
      currentChunk: i + 1,
      totalChunks,
    })
  }

  return completeUpload(uploadId, autoMode, chapterCount)
}

export function useChunkedUpload() {
  const progress = ref<UploadProgress | null>(null)
  const retryingChunk = ref<number | null>(null)

  async function uploadAndCreateJob(
    file: File,
    autoMode: boolean,
    chapterCount?: number
  ): Promise<string> {
    progress.value = null
    retryingChunk.value = null

    return uploadFileAndCreateJob(file, autoMode, chapterCount, {
      onProgress: (p) => {
        progress.value = p
        retryingChunk.value = null
      },
      onRetry: (chunk) => {
        retryingChunk.value = chunk
      },
    })
  }

  return { progress, retryingChunk, uploadAndCreateJob }
}
