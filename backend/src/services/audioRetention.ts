import fs from 'fs'
import path from 'path'
import { clearJobAudio, keepJobAudio, listExpiredJobAudio } from '../db/jobs.js'
import { cleanupFiles } from './extractAudio.js'

// The compressed audio of a finished video is kept for a day so it can be
// re-transcribed in another language when auto-detect got it wrong. A wrong
// language shows on the first look, so a day is plenty.
export const AUDIO_RETENTION_MS = 24 * 60 * 60 * 1000

const audioDir = path.resolve('uploads', 'audio')

/** Moves the job's audio out of the temp files; returns false if it could not be kept. */
export function keepAudioForRetranscribe(jobId: string, audioPath: string): boolean {
  try {
    fs.mkdirSync(audioDir, { recursive: true })
    const kept = path.join(audioDir, `${jobId}${path.extname(audioPath)}`)
    fs.renameSync(audioPath, kept)
    keepJobAudio(jobId, kept, new Date(Date.now() + AUDIO_RETENTION_MS).toISOString())
    return true
  } catch (err) {
    console.error('could not keep audio for re-transcription:', err)
    return false
  }
}

export async function discardJobAudio(jobId: string, audioPath: string): Promise<void> {
  await cleanupFiles(audioPath)
  clearJobAudio(jobId)
}

export async function sweepExpiredAudio(): Promise<number> {
  const expired = listExpiredJobAudio(new Date().toISOString())
  for (const { id, audioPath } of expired) {
    await discardJobAudio(id, audioPath)
  }
  return expired.length
}
