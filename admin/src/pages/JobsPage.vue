<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import JobsTable from '../components/JobsTable.vue'
import { useAdminJobs } from '../composables/useAdminJobs'
import { useAuth } from '../composables/useAuth'
import type { JobStatus } from '../types/job'

const router = useRouter()
const { logout } = useAuth()
const {
  jobs,
  total,
  offset,
  pageSize,
  loading,
  error,
  statusFilter,
  fetchJobs,
  nextPage,
  prevPage,
  setStatusFilter,
  startAutoRefresh,
} = useAdminJobs()

const statusOptions: { value: JobStatus | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'extracting', label: 'Extrayendo' },
  { value: 'transcribing', label: 'Transcribiendo' },
  { value: 'generating', label: 'Generando' },
  { value: 'regenerating', label: 'Regenerando' },
  { value: 'completed', label: 'Completado' },
  { value: 'failed', label: 'Fallido' },
]

const pageInfo = computed(() => {
  const start = total.value === 0 ? 0 : offset.value + 1
  const end = Math.min(offset.value + pageSize, total.value)
  return { start, end }
})

const canPrev = computed(() => offset.value > 0)
const canNext = computed(() => offset.value + pageSize < total.value)

function handleLogout() {
  logout()
  void router.push({ name: 'login' })
}

function handleStatusChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as JobStatus | ''
  setStatusFilter(value)
}

onMounted(() => {
  void fetchJobs()
  startAutoRefresh()
})
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b border-border bg-surface">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <h1 class="text-lg font-semibold text-text">ChapterGen Admin</h1>
          <p class="text-sm text-muted">{{ total }} jobs en total</p>
        </div>
        <button
          type="button"
          class="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-bg hover:text-text"
          @click="handleLogout"
        >
          Salir
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <label class="flex items-center gap-2 text-sm text-muted">
          Estado
          <select
            :value="statusFilter"
            class="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text"
            @change="handleStatusChange"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </label>

        <button
          type="button"
          class="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-bg hover:text-text disabled:opacity-50"
          :disabled="loading"
          @click="fetchJobs"
        >
          {{ loading ? 'Actualizando…' : 'Actualizar' }}
        </button>
      </div>

      <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ error }}
      </p>

      <JobsTable :jobs="jobs" :loading="loading" />

      <div class="mt-4 flex items-center justify-between text-sm text-muted">
        <span v-if="total > 0">
          Mostrando {{ pageInfo.start }}–{{ pageInfo.end }} de {{ total }}
        </span>
        <span v-else>Sin resultados</span>

        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-lg border border-border px-3 py-1.5 transition hover:bg-bg disabled:opacity-40"
            :disabled="!canPrev || loading"
            @click="prevPage"
          >
            Anterior
          </button>
          <button
            type="button"
            class="rounded-lg border border-border px-3 py-1.5 transition hover:bg-bg disabled:opacity-40"
            :disabled="!canNext || loading"
            @click="nextPage"
          >
            Siguiente
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
