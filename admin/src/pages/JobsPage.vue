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
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'pending', label: 'Pending' },
  { value: 'transcribing', label: 'Transcribing' },
  { value: 'generating', label: 'Generating' },
]

onMounted(() => {
  void fetchJobs()
  startAutoRefresh()
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="page-title">Jobs</h1>
        <p class="mt-1 text-sm text-muted">{{ total.toLocaleString('en-US') }} videos processed. Click one for its OpenAI calls.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex rounded-xl border border-border bg-surface p-1">
          <button
            v-for="opt in statusOptions"
            :key="opt.value"
            type="button"
            class="h-7 rounded-lg px-2.5 text-[0.8rem] font-medium transition"
            :class="statusFilter === opt.value ? 'bg-ink text-white' : 'text-muted hover:text-text'"
            @click="setStatusFilter(opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
        <button type="button" class="btn btn-outline" :disabled="loading" @click="fetchJobs">
          {{ loading ? 'Refreshing…' : 'Refresh' }}
        </button>
      </div>
    </div>

    <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

    <div>
      <JobsTable :jobs="jobs" :loading="loading" />
      <PaginationBar :total="total" :offset="offset" :page-size="pageSize" :loading="loading" @prev="prevPage" @next="nextPage" />
    </div>
  </div>
</template>
