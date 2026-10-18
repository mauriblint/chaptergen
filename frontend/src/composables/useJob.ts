import { onUnmounted, ref } from 'vue'
import type { ProcessingStep } from '../types'
import type { Chapter } from '../types'
import type { RefineRequest } from '../types/refine'
import type { DownloadType, Job, JobStatus, JobSummary } from '../types/job'
import { API_BASE, apiFetch } from '../utils/api'

export function jobStatusToStep(status: JobStatus): ProcessingStep {
  const map: Record<JobStatus, ProcessingStep> = {
    pending: 'uploading',
    extracting: 'extracting',
    transcribing: 'transcribing',
    generating: 'generating',
    regenerating: 'regenerating',
    completed: 'done',
    failed: 'error',
  }
  return map[status]
}

export function isJobActive(status: JobStatus): boolean {
  return !['completed', 'failed'].includes(status)
}

export function fetchJob(id: string): Promise<Job> {
  return apiFetch<Job>(`/jobs/${id}`)
}

export async function listJobs(): Promise<JobSummary[]> {
  const data = await apiFetch<{ jobs: JobSummary[] }>('/jobs')
  return data.jobs
}

export async function refineJob(id: string, options: RefineRequest): Promise<void> {
  await apiFetch(`/jobs/${id}/refine`, { method: 'POST', body: JSON.stringify(options) })
}

/** Transcribes the video again in `language` (ISO code); free, once per video. */
export function retranscribeJob(id: string, language: string): Promise<Job> {
  return apiFetch<Job>(`/jobs/${id}/retranscribe`, {
    method: 'POST',
    body: JSON.stringify({ language }),
  })
}

export function saveChapters(id: string, chapters: Chapter[]): Promise<Job> {
  return apiFetch<Job>(`/jobs/${id}/chapters`, {
    method: 'PATCH',
    body: JSON.stringify({ chapters }),
  })
}

export interface SubtitleSettings {
  maxChars: number
  maxLines: number
}

export async function fetchSubtitles(
  id: string,
  format: 'srt' | 'vtt',
  settings: SubtitleSettings
): Promise<string> {
  const query = new URLSearchParams({
    format,
    maxChars: String(settings.maxChars),
    maxLines: String(settings.maxLines),
  })
  const data = await apiFetch<{ content: string }>(`/jobs/${id}/subtitles?${query}`)
  return data.content
}

export function downloadUrl(id: string, type: DownloadType, settings?: SubtitleSettings): string {
  const query =
    settings && (type === 'srt' || type === 'vtt')
      ? `?maxChars=${settings.maxChars}&maxLines=${settings.maxLines}`
      : ''
  return `${API_BASE}/jobs/${id}/download/${type}${query}`
}

export function useJobPoller(jobId: string, intervalMs = 2000) {
  const job = ref<Job | null>(null)
  const error = ref<string | null>(null)
  const notFound = ref(false)
  const loading = ref(true)
  let timer: ReturnType<typeof setInterval> | null = null

  function stopPolling() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  async function poll() {
    try {
      job.value = await fetchJob(jobId)
      error.value = null
      loading.value = false
      if (!isJobActive(job.value.status)) stopPolling()
    } catch (err) {
      const status = (err as { status?: number }).status
      notFound.value = status === 404
      error.value = err instanceof Error ? err.message : 'Unknown error'
      loading.value = false
      stopPolling()
    }
  }

  function startPolling() {
    stopPolling()
    void poll()
    timer = setInterval(poll, intervalMs)
  }

  startPolling()
  onUnmounted(stopPolling)

  return { job, error, notFound, loading, refresh: poll, startPolling }
}
