<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { CostOverview, UsageByModel } from '../types/overview'
import { adminGet } from '../utils/api'
import { formatCompact, formatMinutes, formatMoney, formatPercent, formatUsd } from '../utils/format'

type Metric = 'jobs' | 'revenue' | 'cost'

const ranges = [7, 30, 90] as const
const days = ref<number>(30)
const metric = ref<Metric>('jobs')
const data = ref<CostOverview | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    data.value = await adminGet<CostOverview>(`/admin/overview?days=${days.value}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not load the overview'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(days, load)

const revenue = computed(() => (data.value?.revenueCents ?? 0) / 100)
const cost = computed(() => data.value?.costUsd ?? 0)
const audioMinutes = computed(() => (data.value?.audioSeconds ?? 0) / 60)

const kpis = computed(() => {
  const d = data.value
  if (!d) return []
  const margin = revenue.value > 0 ? (revenue.value - cost.value) / revenue.value : null
  return [
    { label: 'Revenue', value: formatMoney(d.revenueCents), hint: `${d.payments} ${d.payments === 1 ? 'payment' : 'payments'}` },
    { label: 'AI cost', value: formatUsd(cost.value), hint: `${d.trackedJobs} tracked ${d.trackedJobs === 1 ? 'job' : 'jobs'}` },
    { label: 'Margin after AI', value: formatPercent(margin), hint: revenue.value > 0 ? `${formatUsd(revenue.value - cost.value)} left` : 'No revenue yet' },
    { label: 'Jobs', value: d.jobs.total.toLocaleString('en-US'), hint: `${d.jobs.completed} completed · ${d.jobs.failed} failed` },
    { label: 'Audio transcribed', value: formatMinutes(d.audioSeconds), hint: `${d.jobs.paid} paid · ${d.jobs.free} free jobs` },
    {
      label: 'Cost per audio minute',
      value: audioMinutes.value > 0 ? formatUsd(cost.value / audioMinutes.value) : '—',
      hint: d.trackedJobs > 0 ? `${formatUsd(cost.value / d.trackedJobs)} per job` : 'No tracked jobs yet',
    },
  ]
})

const series = computed(() =>
  (data.value?.byDay ?? []).map((day) => ({
    day: day.day,
    value: metric.value === 'jobs' ? day.jobs : metric.value === 'revenue' ? day.revenueCents / 100 : day.costUsd,
  }))
)
const maxValue = computed(() => Math.max(...series.value.map((p) => p.value), 0))

function formatMetric(value: number): string {
  if (metric.value === 'jobs') return value.toLocaleString('en-US')
  return metric.value === 'revenue' ? formatMoney(value * 100) : formatUsd(value)
}

function shortDay(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

/** Transcription is compared per audio minute, chapters per job. */
function unitCost(row: UsageByModel): string {
  if (row.step === 'transcription') {
    return row.audioSeconds > 0 ? `${formatUsd(row.costUsd / (row.audioSeconds / 60))} / min` : '—'
  }
  return row.jobs > 0 ? `${formatUsd(row.costUsd / row.jobs)} / job` : '—'
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="page-title">Overview</h1>
        <p class="mt-1 text-sm text-muted">Jobs, revenue and OpenAI cost for the period.</p>
      </div>
      <div class="flex rounded-xl border border-border bg-surface p-1">
        <button
          v-for="range in ranges"
          :key="range"
          type="button"
          class="h-8 rounded-lg px-3 text-sm font-medium transition"
          :class="days === range ? 'bg-ink text-white' : 'text-muted hover:text-text'"
          @click="days = range"
        >
          {{ range }}d
        </button>
      </div>
    </div>

    <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      <div v-for="kpi in kpis" :key="kpi.label" class="card flex flex-col gap-1 p-4">
        <span class="label">{{ kpi.label }}</span>
        <span class="font-display text-[1.6rem] font-extrabold tracking-tight">{{ kpi.value }}</span>
        <span class="text-xs text-muted">{{ kpi.hint }}</span>
      </div>
      <template v-if="!data && loading">
        <div v-for="i in 6" :key="i" class="card h-[104px] animate-pulse bg-bg" />
      </template>
    </div>

    <section class="card p-5">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-display text-lg font-extrabold tracking-tight">Per day</h2>
        <div class="flex gap-1 text-sm">
          <button
            v-for="m in (['jobs', 'revenue', 'cost'] as const)"
            :key="m"
            type="button"
            class="h-8 rounded-lg px-3 font-medium capitalize transition"
            :class="metric === m ? 'bg-primary-soft text-primary' : 'text-muted hover:text-text'"
            @click="metric = m"
          >
            {{ m === 'cost' ? 'AI cost' : m }}
          </button>
        </div>
      </div>
      <div class="flex h-48 items-end gap-[3px]">
        <div
          v-for="point in series"
          :key="point.day"
          class="group relative flex h-full flex-1 items-end"
        >
          <div
            class="w-full rounded-t-[4px] bg-primary/80 transition group-hover:bg-primary"
            :style="{ height: maxValue > 0 && point.value > 0 ? `${Math.max(2, (point.value / maxValue) * 100)}%` : '2px', opacity: point.value > 0 ? 1 : 0.25 }"
          />
          <div class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs text-white group-hover:block">
            {{ shortDay(point.day) }} · {{ formatMetric(point.value) }}
          </div>
        </div>
      </div>
      <div v-if="series.length" class="mt-2 flex justify-between text-xs text-muted">
        <span>{{ shortDay(series[0]!.day) }}</span>
        <span>{{ shortDay(series[series.length - 1]!.day) }}</span>
      </div>
    </section>

    <section class="card overflow-hidden">
      <div class="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 pb-3">
        <h2 class="font-display text-lg font-extrabold tracking-tight">OpenAI cost by model</h2>
        <span class="text-xs text-muted">Transcription compares per audio minute, chapters per job.</span>
      </div>
      <div class="overflow-x-auto">
        <table class="table min-w-[860px]">
          <thead>
            <tr>
              <th>Step</th>
              <th>Model</th>
              <th class="text-right">Calls</th>
              <th class="text-right">Jobs</th>
              <th class="text-right">Input tokens</th>
              <th class="text-right">Output tokens</th>
              <th class="text-right">Audio</th>
              <th class="text-right">Cost</th>
              <th class="text-right">Unit cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="data && !data.byModel.length">
              <td colspan="9" class="py-8 text-center text-muted">No OpenAI calls recorded in this period.</td>
            </tr>
            <tr v-for="row in data?.byModel ?? []" :key="`${row.step}-${row.model}`">
              <td class="capitalize">{{ row.step }}</td>
              <td class="font-mono text-xs">{{ row.model }}</td>
              <td class="num text-right">{{ row.calls }}</td>
              <td class="num text-right">{{ row.jobs }}</td>
              <td class="num text-right text-muted">{{ row.inputTokens ? formatCompact(row.inputTokens) : '—' }}</td>
              <td class="num text-right text-muted">{{ row.outputTokens ? formatCompact(row.outputTokens) : '—' }}</td>
              <td class="num text-right text-muted">{{ row.audioSeconds ? formatMinutes(row.audioSeconds) : '—' }}</td>
              <td class="num text-right font-medium">{{ formatUsd(row.costUsd) }}</td>
              <td class="num text-right">{{ unitCost(row) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="text-xs text-muted">
      Costs are recorded per call at list price since tracking started; older jobs have none. Margin compares payments and AI cost
      in the same period, not per credit.
    </p>
  </div>
</template>
