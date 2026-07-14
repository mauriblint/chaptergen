<script setup lang="ts">
import { computed } from 'vue'
import type { JobStatus, JobSummary } from '../types/job'

const props = defineProps<{
  jobs: JobSummary[]
  loading: boolean
}>()

const SITE_URL = 'https://chaptergen.com'

const statusLabels: Record<JobStatus, string> = {
  pending: 'Pendiente',
  extracting: 'Extrayendo',
  transcribing: 'Transcribiendo',
  generating: 'Generando',
  regenerating: 'Regenerando',
  completed: 'Completado',
  failed: 'Fallido',
}

const statusColors: Record<JobStatus, string> = {
  pending: 'bg-slate-100 text-slate-700',
  extracting: 'bg-blue-100 text-blue-700',
  transcribing: 'bg-blue-100 text-blue-700',
  generating: 'bg-indigo-100 text-indigo-700',
  regenerating: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatSize(bytes: number | null): string {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDuration(seconds: number | null): string {
  if (seconds == null || !Number.isFinite(seconds)) return '—'
  const total = Math.round(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

const hasJobs = computed(() => props.jobs.length > 0)
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-border bg-surface">
    <table class="w-full min-w-[900px] text-left text-sm">
      <thead>
        <tr class="border-b border-border bg-bg text-xs uppercase tracking-wide text-muted">
          <th class="px-4 py-3 font-medium">Fecha</th>
          <th class="px-4 py-3 font-medium">Archivo</th>
          <th class="px-4 py-3 font-medium">Estado</th>
          <th class="px-4 py-3 font-medium">País</th>
          <th class="px-4 py-3 font-medium">IP</th>
          <th class="px-4 py-3 font-medium">Capítulos</th>
          <th class="px-4 py-3 font-medium">Tamaño</th>
          <th class="px-4 py-3 font-medium">Duración</th>
          <th class="px-4 py-3 font-medium">ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading && !hasJobs">
          <td colspan="9" class="px-4 py-8 text-center text-muted">Cargando jobs…</td>
        </tr>
        <tr v-else-if="!hasJobs">
          <td colspan="9" class="px-4 py-8 text-center text-muted">No hay jobs</td>
        </tr>
        <tr
          v-for="job in jobs"
          :key="job.id"
          class="border-b border-border last:border-0 hover:bg-bg/60"
        >
          <td class="whitespace-nowrap px-4 py-3 text-muted">
            {{ formatDate(job.createdAt) }}
          </td>
          <td class="max-w-[200px] truncate px-4 py-3 font-medium" :title="job.fileName">
            {{ job.fileName }}
          </td>
          <td class="px-4 py-3">
            <span
              class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
              :class="statusColors[job.status]"
            >
              {{ statusLabels[job.status] }}
            </span>
            <span
              v-if="job.failureReason === 'audio_too_large'"
              class="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
            >
              Audio &gt;25MB
            </span>
            <p v-if="job.errorMessage" class="mt-1 max-w-[180px] truncate text-xs text-red-600" :title="job.errorMessage">
              {{ job.errorMessage }}
            </p>
          </td>
          <td class="px-4 py-3 text-muted">{{ job.country ?? '—' }}</td>
          <td class="px-4 py-3 font-mono text-xs text-muted">{{ job.clientIp ?? '—' }}</td>
          <td class="px-4 py-3 text-muted">
            {{ job.chaptersGenerated ?? '—' }}
          </td>
          <td class="px-4 py-3 text-muted">{{ formatSize(job.fileSizeBytes) }}</td>
          <td class="whitespace-nowrap px-4 py-3 text-muted">{{ formatDuration(job.durationSeconds) }}</td>
          <td class="px-4 py-3">
            <a
              :href="`${SITE_URL}/jobs/${job.id}`"
              target="_blank"
              rel="noopener noreferrer"
              class="font-mono text-xs text-primary hover:underline"
            >
              {{ job.id.slice(0, 8) }}…
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
