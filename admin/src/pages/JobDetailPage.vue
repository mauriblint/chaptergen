<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import StatusBadge from '../components/StatusBadge.vue'
import type { JobDetailResponse, UsageRecord } from '../types/job'
import { adminGet } from '../utils/api'
import { formatCompact, formatDate, formatDuration, formatElapsed, formatMinutes, formatSize, formatUsd, processingSeconds } from '../utils/format'

const route = useRoute()
const data = ref<JobDetailResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const jobId = computed(() => route.params.id as string)

async function load() {
  loading.value = true
  error.value = null
  try {
    data.value = await adminGet<JobDetailResponse>(`/admin/jobs/${jobId.value}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not load the job'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(jobId, load)

const job = computed(() => data.value?.job ?? null)
const usage = computed(() => data.value?.usage ?? [])
const totalCost = computed(() => usage.value.reduce((sum, row) => sum + (row.costUsd ?? 0), 0))

/** Total of the first run, split into AI calls and everything else (audio prep, saving). */
const timing = computed(() => {
  const j = job.value
  if (!j) return null
  const total = processingSeconds(j)
  if (total == null) return null
  const initial = usage.value.filter((row) => row.reason === 'initial' && row.durationMs != null)
  const step = (name: UsageRecord['step']) =>
    initial.filter((row) => row.step === name).reduce((sum, row) => sum + row.durationMs! / 1000, 0)
  const transcription = step('transcription')
  const chapters = step('chapters')
  return { total, transcription, chapters, other: Math.max(0, total - transcription - chapters) }
})

function capitalize(value: string | null): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '—'
}

const facts = computed(() => {
  const j = job.value
  if (!j) return []
  return [
    { label: 'Duration', value: formatDuration(j.durationSeconds) },
    { label: 'Size', value: formatSize(j.fileSizeBytes) },
    { label: 'Type', value: [j.mediaType, j.fileExtension].filter(Boolean).join(' · ') || '—' },
    { label: 'Language', value: capitalize(j.transcriptLanguage) + (j.audioLanguage ? ` (picked: ${j.audioLanguage})` : ' (auto)') },
    { label: 'Chapters', value: j.chaptersGenerated ?? '—' },
    {
      label: 'Credit',
      value: j.creditsRefunded ? 'Refunded' : capitalize(j.creditSource),
    },
    { label: 'Refines', value: j.refineCount },
    { label: 'Re-transcribed', value: j.retranscribed ? 'Yes' : 'No' },
    { label: 'Created', value: formatDate(j.createdAt) },
    { label: 'Updated', value: formatDate(j.updatedAt) },
  ]
})

const client = computed(() => {
  const j = job.value
  if (!j) return []
  return [
    { label: 'Country', value: j.country ?? '—' },
    { label: 'IP', value: j.clientIp ?? '—', mono: true },
    { label: 'Device ID', value: j.clientId ?? '—', mono: true },
    { label: 'Browser languages', value: j.acceptLanguage ?? '—' },
    { label: 'Referrer', value: j.referer ?? '—' },
    { label: 'User agent', value: j.userAgent ?? '—' },
  ]
})

const reasonLabels: Record<UsageRecord['reason'], string> = {
  initial: 'Processing',
  refine: 'Refine',
  retranscribe: 'Re-transcription',
}

function tokens(row: UsageRecord): string {
  const input = row.inputTokens + row.audioInputTokens
  if (!input && !row.outputTokens) return '—'
  const cached = row.cachedInputTokens ? ` (${formatCompact(row.cachedInputTokens)} cached)` : ''
  return `${formatCompact(input)} in${cached} · ${formatCompact(row.outputTokens)} out`
}

function time(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <RouterLink to="/jobs" class="text-sm text-muted hover:text-text">← Jobs</RouterLink>

    <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
    <p v-else-if="loading && !job" class="text-sm text-muted">Loading job…</p>

    <template v-if="job">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="page-title break-all">{{ job.fileName }}</h1>
            <StatusBadge :status="job.status" />
          </div>
          <p class="mt-1 text-sm text-muted">
            <RouterLink v-if="job.userId && job.userEmail" :to="`/users/${job.userId}`" class="text-primary hover:underline">
              {{ job.userEmail }}
            </RouterLink>
            <span v-else>Anonymous</span>
            · <span class="font-mono text-xs">{{ job.id }}</span>
          </p>
        </div>
        <div class="flex gap-3">
          <div class="card px-4 py-3 text-right">
            <p class="label">Processing time</p>
            <p class="font-display text-2xl font-extrabold tracking-tight">{{ formatElapsed(timing?.total) }}</p>
          </div>
          <div class="card px-4 py-3 text-right">
            <p class="label">AI cost</p>
            <p class="font-display text-2xl font-extrabold tracking-tight">{{ formatUsd(usage.length ? totalCost : null) }}</p>
          </div>
        </div>
      </div>

      <div v-if="job.errorMessage" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
        <strong class="font-semibold">{{ job.failureReason ?? 'Error' }}:</strong> {{ job.errorMessage }}
      </div>

      <section v-if="timing" class="card p-5">
        <div class="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="font-display text-lg font-extrabold tracking-tight">Where the time went</h2>
          <span class="text-xs text-muted">From the end of the upload to the result. Refines and re-transcriptions not included.</span>
        </div>
        <div class="flex h-3 overflow-hidden rounded-full bg-bg">
          <div class="bg-[#c9cad2]" :style="{ width: `${(timing.other / timing.total) * 100}%` }" />
          <div class="bg-primary" :style="{ width: `${(timing.transcription / timing.total) * 100}%` }" />
          <div class="bg-[#a99cf9]" :style="{ width: `${(timing.chapters / timing.total) * 100}%` }" />
        </div>
        <div class="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <span class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-[#c9cad2]" />Audio prep and saving <strong class="num">{{ formatElapsed(timing.other) }}</strong></span>
          <span class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-primary" />Transcription <strong class="num">{{ formatElapsed(timing.transcription) }}</strong></span>
          <span class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-[#a99cf9]" />Chapters <strong class="num">{{ formatElapsed(timing.chapters) }}</strong></span>
        </div>
      </section>

      <section class="card overflow-hidden">
        <h2 class="px-5 pt-5 pb-3 font-display text-lg font-extrabold tracking-tight">AI calls</h2>
        <div class="overflow-x-auto">
          <table class="table min-w-[760px]">
            <thead>
              <tr>
                <th>Time</th>
                <th>For</th>
                <th>Step</th>
                <th>Model</th>
                <th>Tokens</th>
                <th class="text-right">Took</th>
                <th class="text-right">Audio</th>
                <th class="text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!usage.length">
                <td colspan="8" class="py-8 text-center text-muted">No calls recorded. Jobs from before cost tracking have none.</td>
              </tr>
              <tr v-for="row in usage" :key="row.id">
                <td class="num whitespace-nowrap text-muted">{{ time(row.createdAt) }}</td>
                <td>{{ reasonLabels[row.reason] }}</td>
                <td class="capitalize">{{ row.step }}</td>
                <td class="font-mono text-xs">{{ row.model }}</td>
                <td class="num text-muted">{{ tokens(row) }}</td>
                <td class="num text-right text-muted">{{ row.durationMs != null ? formatElapsed(row.durationMs / 1000) : '—' }}</td>
                <td class="num text-right text-muted">{{ row.audioSeconds != null ? formatMinutes(row.audioSeconds) : '—' }}</td>
                <td class="num text-right font-medium">{{ formatUsd(row.costUsd) }}</td>
              </tr>
            </tbody>
            <tfoot v-if="usage.length">
              <tr>
                <td colspan="7" class="px-4 py-3 text-right text-sm font-medium">Total</td>
                <td class="num px-4 py-3 text-right font-semibold">{{ formatUsd(totalCost) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <div class="grid gap-4 lg:grid-cols-2">
        <section class="card p-5">
          <h2 class="mb-4 font-display text-lg font-extrabold tracking-tight">Video</h2>
          <dl class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div v-for="fact in facts" :key="fact.label">
              <dt class="label">{{ fact.label }}</dt>
              <dd class="num mt-0.5">{{ fact.value }}</dd>
            </div>
          </dl>
        </section>
        <section class="card p-5">
          <h2 class="mb-4 font-display text-lg font-extrabold tracking-tight">Request</h2>
          <dl class="flex flex-col gap-3 text-sm">
            <div v-for="fact in client" :key="fact.label">
              <dt class="label">{{ fact.label }}</dt>
              <dd class="mt-0.5 break-all" :class="fact.mono ? 'font-mono text-xs' : ''">{{ fact.value }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </template>
  </div>
</template>
