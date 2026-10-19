<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import StatusBadge from './StatusBadge.vue'
import type { JobSummary } from '../types/job'
import { formatDate, formatDuration, formatElapsed, formatUsd, processingSeconds } from '../utils/format'

const props = withDefaults(defineProps<{ jobs: JobSummary[]; loading: boolean; showUser?: boolean }>(), {
  showUser: true,
})

const router = useRouter()
const hasJobs = computed(() => props.jobs.length > 0)
const columns = computed(() => (props.showUser ? 9 : 8))

function language(job: JobSummary): string {
  const value = job.transcriptLanguage
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '—'
}
</script>

<template>
  <div class="card overflow-x-auto">
    <table class="table min-w-[1000px]">
      <thead>
        <tr>
          <th>File</th>
          <th>Status</th>
          <th v-if="showUser">User</th>
          <th class="text-right">Duration</th>
          <th>Language</th>
          <th>Credit</th>
          <th class="text-right">Took</th>
          <th class="text-right">AI cost</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading && !hasJobs">
          <td :colspan="columns" class="py-10 text-center text-muted">Loading jobs…</td>
        </tr>
        <tr v-else-if="!hasJobs">
          <td :colspan="columns" class="py-10 text-center text-muted">No jobs</td>
        </tr>
        <tr v-for="job in jobs" :key="job.id" class="row-link" @click="router.push(`/jobs/${job.id}`)">
          <td class="max-w-[240px]">
            <p class="truncate font-medium" :title="job.fileName">{{ job.fileName }}</p>
            <p class="font-mono text-[0.7rem] text-muted">{{ job.id.slice(0, 10) }}</p>
          </td>
          <td>
            <StatusBadge :status="job.status" />
            <p v-if="job.failureReason" class="mt-1 max-w-[180px] truncate text-xs text-red-600" :title="job.errorMessage ?? ''">
              {{ job.failureReason }}
            </p>
          </td>
          <td v-if="showUser" class="max-w-[200px] truncate">
            <RouterLink
              v-if="job.userId && job.userEmail"
              :to="`/users/${job.userId}`"
              class="text-primary hover:underline"
              @click.stop
            >
              {{ job.userEmail }}
            </RouterLink>
            <span v-else class="text-muted">Anonymous</span>
          </td>
          <td class="num text-right text-muted">{{ formatDuration(job.durationSeconds) }}</td>
          <td class="text-muted">{{ language(job) }}</td>
          <td>
            <span v-if="job.creditsRefunded" class="text-xs font-medium text-amber-700">Refunded</span>
            <span v-else-if="job.creditSource" class="text-xs font-medium capitalize" :class="job.creditSource === 'paid' ? 'text-text' : 'text-muted'">
              {{ job.creditSource }}
            </span>
            <span v-else class="text-muted">—</span>
          </td>
          <td class="num text-right text-muted">{{ formatElapsed(processingSeconds(job)) }}</td>
          <td class="num text-right font-medium">{{ formatUsd(job.aiCostUsd) }}</td>
          <td class="whitespace-nowrap text-muted">{{ formatDate(job.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
