import fs from 'fs/promises'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'

// OpenAI Whisper rejects uploads larger than 25 MiB (26214400 bytes).
// We keep a small safety margin below that hard limit because the API reads
// the multipart stream and can abort slightly past the boundary.
export const WHISPER_MAX_UPLOAD_BYTES = 25 * 1024 * 1024
const WHISPER_SAFETY_MARGIN_BYTES = 512 * 1024
export const AUDIO_MAX_UPLOAD_BYTES = WHISPER_MAX_UPLOAD_BYTES - WHISPER_SAFETY_MARGIN_BYTES

// Whisper downsamples audio to 16 kHz mono internally, so re-encoding to that
// format keeps transcription quality while making the file much smaller.
const AUDIO_SAMPLE_RATE = 16000
const AUDIO_BITRATE = '48k'

// Re-encodes any audio or video input into a compact mono 16 kHz MP3 suitable
// for Whisper. The input file is left untouched; callers are responsible for
// cleaning up both the input and the returned output.
export async function prepareAudioForTranscription(
  inputPath: string,
  outputDir: string
): Promise<string> {
  const base = path.basename(inputPath, path.extname(inputPath))
  const outputPath = path.join(outputDir, `${base}-whisper.mp3`)

  await new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioChannels(1)
      .audioFrequency(AUDIO_SAMPLE_RATE)
      .audioBitrate(AUDIO_BITRATE)
      .on('end', () => resolve())
      .on('error', (err) => reject(new Error(`ffmpeg error: ${err.message}`)))
      .save(outputPath)
  })

  return outputPath
}

export async function cleanupFiles(...paths: string[]): Promise<void> {
  await Promise.all(paths.map((p) => fs.unlink(p).catch(() => {})))
}
