import { ref } from 'vue'
import type {
  Chapter,
  ChaptersResult,
  ProcessingStep,
  TranscribeResult,
  TranscriptSegment,
} from '../types'
import { isAudioFile } from '../utils/media'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export function useTimestampGenerator() {
  const step = ref<ProcessingStep>('idle')
  const error = ref<string | null>(null)
  const segments = ref<TranscriptSegment[]>([])
  const chapters = ref<Chapter[]>([])
  const formatted = ref('')

  async function generateChapters(auto: boolean, chapterCount?: number) {
    const body: Record<string, unknown> = {
      segments: segments.value,
      auto,
    }
    if (!auto && chapterCount != null) {
      body.chapterCount = chapterCount
    }

    const response = await fetch(`${API_BASE}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error ?? `Error ${response.status}`)
    }

    const data: ChaptersResult = await response.json()
    chapters.value = data.chapters
    formatted.value = data.formatted
  }

  async function processVideo(file: File, auto: boolean, chapterCount?: number) {
    step.value = 'uploading'
    error.value = null
    segments.value = []
    chapters.value = []
    formatted.value = ''

    const formData = new FormData()
    formData.append('video', file)

    try {
      step.value = isAudioFile(file.name) ? 'transcribing' : 'extracting'

      const response = await fetch(`${API_BASE}/transcribe`, {
        method: 'POST',
        body: formData,
      })

      step.value = 'transcribing'

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error ?? `Error ${response.status}`)
      }

      const data: TranscribeResult = await response.json()
      segments.value = data.segments

      step.value = 'generating'
      await generateChapters(auto, chapterCount)

      step.value = 'done'
    } catch (err) {
      step.value = 'error'
      error.value = err instanceof Error ? err.message : 'Unknown error'
    }
  }

  async function regenerateChapters(auto: boolean, chapterCount?: number) {
    if (segments.value.length === 0) return

    error.value = null
    step.value = 'regenerating'

    try {
      await generateChapters(auto, chapterCount)
      step.value = 'done'
    } catch (err) {
      step.value = 'done'
      error.value = err instanceof Error ? err.message : 'Unknown error'
    }
  }

  function updateChapter(index: number, field: 'time' | 'title', value: string) {
    if (!chapters.value[index]) return
    chapters.value[index][field] = value
    formatted.value = chapters.value
      .map((c) => `[${c.time}] ${c.title}`)
      .join('\n')
  }

  function reset() {
    step.value = 'idle'
    error.value = null
    segments.value = []
    chapters.value = []
    formatted.value = ''
  }

  return {
    step,
    error,
    segments,
    chapters,
    formatted,
    processVideo,
    regenerateChapters,
    updateChapter,
    reset,
  }
}
