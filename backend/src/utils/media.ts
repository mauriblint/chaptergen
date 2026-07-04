import path from 'path'

export const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.opus']
export const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.mkv', '.avi', '.m4v']
export const MEDIA_EXTENSIONS = [...VIDEO_EXTENSIONS, ...AUDIO_EXTENSIONS]

export function isAudioFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return AUDIO_EXTENSIONS.includes(ext)
}

export function isVideoFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return VIDEO_EXTENSIONS.includes(ext)
}
