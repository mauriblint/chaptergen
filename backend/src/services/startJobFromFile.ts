import path from 'path'
import {
  createJob,
  generateJobId,
  updateJobStatus,
  type JobRecord,
} from '../db/jobs.js'
import { processJob } from './processJob.js'
import { getMediaType } from '../utils/media.js'
import type { RequestMeta } from '../utils/requestMeta.js'

export interface StartJobInput {
  filePath: string
  fileName: string
  fileSizeBytes: number
  fileType?: string | null
  autoMode: boolean
  chapterCount: number | null
  meta: RequestMeta
}

export function startJobFromFile(input: StartJobInput): JobRecord {
  const id = generateJobId()
  const job = createJob({
    id,
    fileName: input.fileName,
    filePath: input.filePath,
    autoMode: input.autoMode,
    chapterCount: input.autoMode ? null : input.chapterCount,
    fileSizeBytes: input.fileSizeBytes,
    fileType: input.fileType ?? 'application/octet-stream',
    fileExtension: path.extname(input.fileName).toLowerCase(),
    mediaType: getMediaType(input.fileName),
    clientIp: input.meta.clientIp,
    country: input.meta.country,
    userAgent: input.meta.userAgent,
    acceptLanguage: input.meta.acceptLanguage,
    referer: input.meta.referer,
    clientId: input.meta.clientId,
  })

  updateJobStatus(id, 'pending')
  void processJob(id)

  return job
}
