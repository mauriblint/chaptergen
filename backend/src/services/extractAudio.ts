import fs from 'fs/promises'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'

export async function extractAudio(
  videoPath: string,
  outputDir: string
): Promise<string> {
  const audioPath = path.join(
    outputDir,
    `${path.basename(videoPath, path.extname(videoPath))}.mp3`
  )

  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioQuality(2)
      .on('end', () => resolve())
      .on('error', (err) => reject(new Error(`ffmpeg error: ${err.message}`)))
      .save(audioPath)
  })

  await fs.unlink(videoPath).catch(() => {})

  return audioPath
}

export async function cleanupFiles(...paths: string[]): Promise<void> {
  await Promise.all(paths.map((p) => fs.unlink(p).catch(() => {})))
}
