<script setup lang="ts">
import { onMounted } from 'vue'
import JobsTable from '../components/JobsTable.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { useAdminJobs } from '../composables/useAdminJobs'
import type { JobStatus } from '../types/job'

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
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'extracting', label: 'Extracting' },
  { value: 'transcribing', label: 'Transcribing' },
  { value: 'generating', label: 'Generating' },
  { value: 'regenerating', label: 'Regenerating' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
]

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
  <div>
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <label class="flex items-center gap-2 text-sm text-muted">
        Status
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
        {{ loading ? 'Refreshing…' : 'Refresh' }}
      </button>
    </div>

    <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </p>

    <JobsTable :jobs="jobs" :loading="loading" />
    <PaginationBar
      :total="total"
      :offset="offset"
      :page-size="pageSize"
      :loading="loading"
      @prev="prevPage"
      @next="nextPage"
    />
  </div>
</template>
