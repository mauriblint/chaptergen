import { onUnmounted, ref } from 'vue'
import type { JobStatus, JobsListResponse } from '../types/job'
import { apiFetch } from '../utils/api'
import { useAuth } from './useAuth'

const PAGE_SIZE = 50

export function useAdminJobs() {
  const { getToken } = useAuth()
  const jobs = ref<JobsListResponse['jobs']>([])
  const total = ref(0)
  const offset = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const statusFilter = ref<JobStatus | ''>('')

  let refreshTimer: ReturnType<typeof setInterval> | null = null

  async function fetchJobs(): Promise<void> {
    const token = getToken()
    if (!token) return

    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset.value),
      })
      if (statusFilter.value) {
        params.set('status', statusFilter.value)
      }

      const res = await apiFetch(`/admin/jobs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 401) {
        error.value = 'Sesión expirada'
        return
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? 'Error al cargar jobs')
      }

      const data = (await res.json()) as JobsListResponse
      jobs.value = data.jobs
      total.value = data.total
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error desconocido'
    } finally {
      loading.value = false
    }
  }

  function nextPage(): void {
    if (offset.value + PAGE_SIZE < total.value) {
      offset.value += PAGE_SIZE
      void fetchJobs()
    }
  }

  function prevPage(): void {
    if (offset.value > 0) {
      offset.value = Math.max(0, offset.value - PAGE_SIZE)
      void fetchJobs()
    }
  }

  function setStatusFilter(status: JobStatus | ''): void {
    statusFilter.value = status
    offset.value = 0
    void fetchJobs()
  }

  function startAutoRefresh(): void {
    refreshTimer = setInterval(() => {
      void fetchJobs()
    }, 30_000)
  }

  function stopAutoRefresh(): void {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  onUnmounted(stopAutoRefresh)

  return {
    jobs,
    total,
    offset,
    pageSize: PAGE_SIZE,
    loading,
    error,
    statusFilter,
    fetchJobs,
    nextPage,
    prevPage,
    setStatusFilter,
    startAutoRefresh,
    stopAutoRefresh,
  }
}
