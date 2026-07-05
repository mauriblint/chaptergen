import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import type { Chapter, TranscriptSegment } from '../types.js'
import type { MediaType } from '../utils/media.js'

export type JobStatus =
  | 'pending'
  | 'extracting'
  | 'transcribing'
  | 'generating'
  | 'regenerating'
  | 'completed'
  | 'failed'

export interface JobRecord {
  id: string
  status: JobStatus
  fileName: string
  filePath: string | null
  autoMode: boolean
  chapterCount: number | null
  chaptersGenerated: number | null
  fileSizeBytes: number | null
  fileType: string | null
  fileExtension: string | null
  mediaType: MediaType | null
  clientIp: string | null
  country: string | null
  userAgent: string | null
  acceptLanguage: string | null
  referer: string | null
  clientId: string | null
  segments: TranscriptSegment[] | null
  chapters: Chapter[] | null
  formatted: string | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

interface JobRow {
  id: string
  status: JobStatus
  file_name: string
  file_path: string | null
  auto_mode: number
  chapter_count: number | null
  chapters_generated: number | null
  file_size_bytes: number | null
  file_type: string | null
  file_extension: string | null
  media_type: string | null
  client_ip: string | null
  country: string | null
  user_agent: string | null
  accept_language: string | null
  referer: string | null
  client_id: string | null
  segments_json: string | null
  chapters_json: string | null
  formatted_text: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}

const dataDir = path.resolve('data')
const dbPath = path.join(dataDir, 'chaptergen.db')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT,
    auto_mode INTEGER NOT NULL DEFAULT 1,
    chapter_count INTEGER,
    segments_json TEXT,
    chapters_json TEXT,
    formatted_text TEXT,
    error_message TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`)

const columnMigrations = [
  'ALTER TABLE jobs ADD COLUMN chapters_generated INTEGER',
  'ALTER TABLE jobs ADD COLUMN file_size_bytes INTEGER',
  'ALTER TABLE jobs ADD COLUMN file_type TEXT',
  'ALTER TABLE jobs ADD COLUMN file_extension TEXT',
  'ALTER TABLE jobs ADD COLUMN media_type TEXT',
  'ALTER TABLE jobs ADD COLUMN client_ip TEXT',
  'ALTER TABLE jobs ADD COLUMN country TEXT',
  'ALTER TABLE jobs ADD COLUMN user_agent TEXT',
  'ALTER TABLE jobs ADD COLUMN accept_language TEXT',
  'ALTER TABLE jobs ADD COLUMN referer TEXT',
  'ALTER TABLE jobs ADD COLUMN client_id TEXT',
]

for (const sql of columnMigrations) {
  try {
    db.exec(sql)
  } catch {
    // column already exists
  }
}

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);
  CREATE INDEX IF NOT EXISTS idx_jobs_client_ip ON jobs(client_ip);
  CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
`)

function rowToJob(row: JobRow): JobRecord {
  return {
    id: row.id,
    status: row.status,
    fileName: row.file_name,
    filePath: row.file_path,
    autoMode: row.auto_mode === 1,
    chapterCount: row.chapter_count,
    chaptersGenerated: row.chapters_generated,
    fileSizeBytes: row.file_size_bytes,
    fileType: row.file_type,
    fileExtension: row.file_extension,
    mediaType: row.media_type === 'audio' || row.media_type === 'video' ? row.media_type : null,
    clientIp: row.client_ip,
    country: row.country,
    userAgent: row.user_agent,
    acceptLanguage: row.accept_language,
    referer: row.referer,
    clientId: row.client_id,
    segments: row.segments_json ? JSON.parse(row.segments_json) : null,
    chapters: row.chapters_json ? JSON.parse(row.chapters_json) : null,
    formatted: row.formatted_text,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function generateJobId(): string {
  return crypto.randomBytes(16).toString('hex')
}

export function createJob(input: {
  id: string
  fileName: string
  filePath: string
  autoMode: boolean
  chapterCount: number | null
  fileSizeBytes: number
  fileType: string
  fileExtension: string
  mediaType: MediaType
  clientIp: string | null
  country: string | null
  userAgent: string | null
  acceptLanguage: string | null
  referer: string | null
  clientId: string | null
}): JobRecord {
  const now = new Date().toISOString()
  db.prepare(`
    INSERT INTO jobs (
      id, status, file_name, file_path, auto_mode, chapter_count,
      file_size_bytes, file_type, file_extension, media_type,
      client_ip, country, user_agent, accept_language, referer, client_id,
      created_at, updated_at
    )
    VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.id,
    input.fileName,
    input.filePath,
    input.autoMode ? 1 : 0,
    input.chapterCount,
    input.fileSizeBytes,
    input.fileType,
    input.fileExtension,
    input.mediaType,
    input.clientIp,
    input.country,
    input.userAgent,
    input.acceptLanguage,
    input.referer,
    input.clientId,
    now,
    now
  )
  return getJob(input.id)!
}

export function getJob(id: string): JobRecord | null {
  const row = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id) as JobRow | undefined
  return row ? rowToJob(row) : null
}

export function countJobsByClientId(clientId: string, status?: JobStatus): number {
  if (status) {
    const row = db
      .prepare('SELECT COUNT(*) AS count FROM jobs WHERE client_id = ? AND status = ?')
      .get(clientId, status) as { count: number }
    return row.count
  }
  const row = db
    .prepare('SELECT COUNT(*) AS count FROM jobs WHERE client_id = ?')
    .get(clientId) as { count: number }
  return row.count
}

export function countJobsByClientIp(clientIp: string, status?: JobStatus): number {
  if (status) {
    const row = db
      .prepare('SELECT COUNT(*) AS count FROM jobs WHERE client_ip = ? AND status = ?')
      .get(clientIp, status) as { count: number }
    return row.count
  }
  const row = db
    .prepare('SELECT COUNT(*) AS count FROM jobs WHERE client_ip = ?')
    .get(clientIp) as { count: number }
  return row.count
}

export function updateJobStatus(id: string, status: JobStatus): void {
  const now = new Date().toISOString()
  db.prepare('UPDATE jobs SET status = ?, updated_at = ?, error_message = NULL WHERE id = ?').run(
    status,
    now,
    id
  )
}

export function updateJobSegments(id: string, segments: TranscriptSegment[]): void {
  const now = new Date().toISOString()
  db.prepare(`
    UPDATE jobs SET segments_json = ?, status = 'generating', updated_at = ?, error_message = NULL
    WHERE id = ?
  `).run(JSON.stringify(segments), now, id)
}

export function updateJobResult(
  id: string,
  chapters: Chapter[],
  formatted: string,
  segments?: TranscriptSegment[]
): void {
  const now = new Date().toISOString()
  const chaptersGenerated = chapters.length
  if (segments) {
    db.prepare(`
      UPDATE jobs SET chapters_json = ?, formatted_text = ?, segments_json = ?,
        chapters_generated = ?, status = 'completed', updated_at = ?, error_message = NULL,
        file_path = NULL
      WHERE id = ?
    `).run(
      JSON.stringify(chapters),
      formatted,
      JSON.stringify(segments),
      chaptersGenerated,
      now,
      id
    )
  } else {
    db.prepare(`
      UPDATE jobs SET chapters_json = ?, formatted_text = ?, chapters_generated = ?,
        status = 'completed', updated_at = ?, error_message = NULL
      WHERE id = ?
    `).run(JSON.stringify(chapters), formatted, chaptersGenerated, now, id)
  }
}

export function updateJobError(id: string, message: string): void {
  const now = new Date().toISOString()
  db.prepare(`
    UPDATE jobs SET status = 'failed', error_message = ?, updated_at = ?, file_path = NULL
    WHERE id = ?
  `).run(message, now, id)
}

export function clearJobFilePath(id: string): void {
  db.prepare('UPDATE jobs SET file_path = NULL WHERE id = ?').run(id)
}

export { db }
