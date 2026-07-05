import { onUnmounted, ref } from 'vue'
import type { ProcessingStep } from '../types'
import type { RefineRequest } from '../types/refine'
import type { Job, JobStatus } from '../types/job'
import { getClientId } from '../utils/clientId'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

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

export async function createJob(
  file: File,
  autoMode: boolean,
  chapterCount?: number
): Promise<string> {
  const formData = new FormData()
  formData.append('video', file)
  formData.append('auto', String(autoMode))
  if (!autoMode && chapterCount != null) {
    formData.append('chapterCount', String(chapterCount))
  }

  const response = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'X-Client-Id': getClientId() },
    body: formData,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error ?? `Error ${response.status}`)
  }

  const data = await response.json()
  return data.id as string
}

export async function fetchJob(id: string): Promise<Job> {
  const response = await fetch(`${API_BASE}/jobs/${id}`)
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error ?? `Error ${response.status}`)
  }
  return response.json()
}

export async function refineJob(id: string, options: RefineRequest): Promise<void> {
  const response = await fetch(`${API_BASE}/jobs/${id}/refine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error ?? `Error ${response.status}`)
  }
}

export function downloadJobFile(id: string, type: 'chapters' | 'transcript') {
  window.open(`${API_BASE}/jobs/${id}/download/${type}`, '_blank')
}

export function useJobPoller(jobId: string, intervalMs = 2000) {
  const job = ref<Job | null>(null)
  const error = ref<string | null>(null)
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
      error.value = job.value.error
      loading.value = false
      if (!isJobActive(job.value.status)) {
        stopPolling()
      }
    } catch (err) {
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

  return { job, error, loading, refresh: poll, startPolling }
}
