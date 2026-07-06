<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import Card from '../components/ui/Card.vue'
import ProcessingStatus from '../components/ProcessingStatus.vue'
import TimestampsResult from '../components/TimestampsResult.vue'
import RefineModal from '../components/RefineModal.vue'
import {
  downloadJobFile,
  jobStatusToStep,
  refineJob,
  useJobPoller,
} from '../composables/useJob'
import type { Chapter } from '../types'
import type { RefineOptions } from '../types/refine'
import { trackChapterGenerated } from '../utils/analytics'

const route = useRoute()
const jobId = computed(() => route.params.id as string)

const { job, error: fetchError, loading, startPolling } = useJobPoller(jobId.value)

const autoMode = ref(true)
const chapterCount = ref(10)
const localChapters = ref<Chapter[]>([])
const localFormatted = ref('')
const refining = ref(false)
const showRefineModal = ref(false)

const step = computed(() => {
  if (!job.value) return loading.value ? 'uploading' : 'error'
  if (refining.value) return 'regenerating'
  return jobStatusToStep(job.value.status)
})

const displayError = computed(() => fetchError.value ?? job.value?.error ?? null)

const isDone = computed(() => job.value?.status === 'completed')
const isFailed = computed(() => job.value?.status === 'failed')
const isProcessing = computed(
  () =>
    !isDone.value &&
    !isFailed.value &&
    step.value !== 'error' &&
    (loading.value || !!job.value)
)

watch(
  job,
  (j) => {
    if (j?.chapters && j.formatted) {
      localChapters.value = [...j.chapters]
      localFormatted.value = j.formatted
    }
    if (j) {
      autoMode.value = j.autoMode
      chapterCount.value = j.chapterCount ?? 10
    }
  },
  { immediate: true }
)

function updateChapter(index: number, field: 'time' | 'title', value: string) {
  if (!localChapters.value[index]) return
  localChapters.value[index][field] = value
  localFormatted.value = localChapters.value
    .map((c) => `[${c.time}] ${c.title}`)
    .join('\n')
}

async function onRefine(options: RefineOptions) {
  if (!job.value) return
  showRefineModal.value = false
  refining.value = true
  try {
    await refineJob(job.value.id, {
      ...options,
      existingChapters: localChapters.value,
    })
    startPolling()
  } catch {
    refining.value = false
  }
}

watch(
  () => job.value?.status,
  (status, oldStatus) => {
    if (status === 'completed' && oldStatus && oldStatus !== 'completed' && job.value) {
      const j = job.value
      trackChapterGenerated({
        fileName: j.fileName,
        chapterCount: j.chaptersGenerated ?? j.chapters?.length ?? 0,
        autoMode: j.autoMode,
        isRefine: oldStatus === 'regenerating',
      })
    }

    if (status === 'completed' || status === 'failed') {
      refining.value = false
    }
  }
)
</script>

<template>
  <MarketingLayout>
    <section :key="jobId" class="job-page" :class="{ 'job-page--processing': isProcessing }">
      <div class="job-inner">
        <RouterLink to="/" class="back-link">← Back to generator</RouterLink>

        <div v-if="!isProcessing" class="job-header">
          <template v-if="isDone">
            <div class="job-title-row">
              <h1 class="job-title">Your chapters are ready</h1>
              <span class="done-badge">
                <svg class="done-badge-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3.5 8.5 6.5 11.5 12.5 4.5"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Done
              </span>
            </div>
            <p v-if="job?.fileName" class="job-meta">{{ job.fileName }}</p>
          </template>

          <template v-else-if="isFailed">
            <h1 class="job-title">Something went wrong</h1>
            <p v-if="job?.fileName" class="job-meta">{{ job.fileName }}</p>
          </template>
        </div>

        <Card v-if="fetchError && !job" class="job-card" shadow="lg">
          <div class="error-box">
            <p>{{ fetchError }}</p>
            <RouterLink to="/" class="btn-secondary">Try again</RouterLink>
          </div>
        </Card>

        <Card v-else-if="isProcessing" class="job-card job-card--processing" shadow="lg">
          <ProcessingStatus :step="step" :file-name="job?.fileName" />
        </Card>

        <Card v-else class="job-card" shadow="lg">
          <div v-if="displayError && isFailed" class="error-box">
            <p>{{ displayError }}</p>
            <RouterLink to="/" class="btn-secondary">Try again</RouterLink>
          </div>

          <TimestampsResult
            v-if="isDone || step === 'regenerating'"
            :chapters="localChapters"
            :formatted="localFormatted"
            :loading="step === 'regenerating'"
            :has-transcript="job?.hasTranscript"
            @update="updateChapter"
            @refine="showRefineModal = true"
            @download="(type) => downloadJobFile(jobId, type)"
          />
        </Card>

        <RefineModal
          v-if="showRefineModal"
          :initial-auto-mode="autoMode"
          :initial-chapter-count="chapterCount"
          @close="showRefineModal = false"
          @submit="onRefine"
        />
      </div>
    </section>
  </MarketingLayout>
</template>

<style scoped>
.job-page {
  padding: 2.5rem 1.5rem 4rem;
}

.job-page--processing {
  display: flex;
  align-items: center;
  min-height: calc(100vh - 8rem);
  padding-top: 1.5rem;
  padding-bottom: 2rem;
}

.job-inner {
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}

.job-page--processing .job-inner {
  max-width: 520px;
}

.job-header {
  margin-bottom: 1.75rem;
}

.back-link {
  font-size: 0.875rem;
  color: var(--accent);
  display: inline-block;
  margin-bottom: 1.25rem;
}

.job-page--processing .back-link {
  margin-bottom: 1.5rem;
  color: var(--text-muted);
}

.job-page--processing .back-link:hover {
  color: var(--accent);
}

.back-link:hover {
  opacity: 0.85;
}

.job-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.job-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.done-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  background: #ecfdf5;
  color: #059669;
}

.done-badge-icon {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
}

.job-meta {
  margin-top: 0.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.job-card {
  width: 100%;
}

.job-card--processing {
  border-radius: 1.5rem;
  padding: 0;
  overflow: hidden;
}

.error-box {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.error-box p {
  color: #dc2626;
  font-size: 0.9rem;
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.85rem;
}
</style>
