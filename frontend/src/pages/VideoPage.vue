<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import AppLayout from '../layouts/AppLayout.vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import StatusBadge from '../components/app/StatusBadge.vue'
import ProcessingSteps from '../components/video/ProcessingSteps.vue'
import ChaptersTab from '../components/video/ChaptersTab.vue'
import TranscriptTab from '../components/video/TranscriptTab.vue'
import SubtitlesTab from '../components/video/SubtitlesTab.vue'
import RefineModal from '../components/RefineModal.vue'
import PaywallModal from '../components/PaywallModal.vue'
import { useAuth } from '../composables/useAuth'
import { downloadUrl, isJobActive, refineJob, useJobPoller } from '../composables/useJob'
import { PaywallError, type PaywallReason } from '../utils/api'
import type { Job } from '../types/job'
import type { RefineOptions } from '../types/refine'
import { formatDuration } from '../utils/format'
import { formatBytes, languageName, relativeDate } from '../utils/display'
import { isAudioFile } from '../utils/media'
import { trackChapterGenerated } from '../utils/analytics'

type Tab = 'chapters' | 'transcript' | 'subtitles'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { user, refresh } = useAuth()
const jobId = route.params.id as string

const { job, notFound, loading, startPolling } = useJobPoller(jobId)
const layout = ref<InstanceType<typeof AppLayout> | null>(null)
const showRefine = ref(false)
const paywallReason = ref<PaywallReason | null>(null)
const refineRequested = ref(false)

const tab = computed<Tab>(() => {
  const value = route.query.tab
  return value === 'transcript' || value === 'subtitles' ? value : 'chapters'
})

const tabs = computed(() => [
  { key: 'chapters' as const, label: t('app.tabs.chapters'), count: job.value?.chapters?.length ?? 0 },
  {
    key: 'transcript' as const,
    label: t('app.tabs.transcript'),
    count: t('app.tabs.words', {
      n: (job.value?.segments ?? [])
        .reduce((n, s) => n + s.text.trim().split(/\s+/).filter(Boolean).length, 0)
        .toLocaleString(),
    }),
  },
  { key: 'subtitles' as const, label: t('app.tabs.subtitles'), count: 'SRT · VTT' },
])

const state = computed(() => {
  if (!job.value) return loading.value ? 'loading' : 'missing'
  if (job.value.status === 'failed') return 'failed'
  if (job.value.status === 'regenerating' || job.value.status === 'completed') return 'ready'
  return 'processing'
})

const refining = computed(() => job.value?.status === 'regenerating' || refineRequested.value)
const isAudio = computed(() => !!job.value && (job.value.mediaType === 'audio' || isAudioFile(job.value.fileName)))
const language = computed(() => languageName(job.value?.language, locale.value))

const meta = computed(() => {
  const j = job.value
  if (!j) return ''
  return [
    formatDuration(j.durationSeconds),
    language.value,
    formatBytes(j.fileSizeBytes),
    state.value === 'ready' ? t('app.video.processed', { when: relativeDate(j.updatedAt, locale.value, t) }) : null,
  ]
    .filter(Boolean)
    .join(' · ')
})

const failure = computed(() => {
  const reason = job.value?.failureReason
  const known = ['no_speech', 'no_audio', 'audio_too_large', 'duration_over_free_limit', 'insufficient_credits']
  return reason && known.includes(reason) ? reason : 'generic'
})

useHead(
  computed(() => ({
    title: job.value ? `${job.value.fileName} — ChapterGen` : 'ChapterGen',
    htmlAttrs: { lang: locale.value },
    meta: [{ name: 'robots', content: 'noindex' }],
  }))
)

// A signed-out visitor following an old link to an account's video signs in first.
watch(notFound, (missing) => {
  if (missing && !user.value) void router.replace({ path: '/login', query: { next: route.fullPath } })
})

watch(
  () => job.value?.status,
  (status, previous) => {
    if (status && !isJobActive(status)) refineRequested.value = false
    if (status === 'completed' && previous && previous !== 'completed' && job.value) {
      trackChapterGenerated({
        fileName: job.value.fileName,
        chapterCount: job.value.chapters?.length ?? 0,
        autoMode: job.value.autoMode,
        isRefine: previous === 'regenerating',
      })
      void refresh()
    }
    if (status === 'failed') void refresh()
  }
)

function setTab(next: Tab) {
  void router.replace({ query: { ...route.query, tab: next === 'chapters' ? undefined : next } })
}

function onSaved(updated: Job) {
  if (job.value) job.value = { ...job.value, chapters: updated.chapters, youtube: updated.youtube }
}

async function onRefine(options: RefineOptions) {
  if (!job.value) return
  showRefine.value = false
  refineRequested.value = true
  try {
    await refineJob(job.value.id, { ...options, existingChapters: job.value.chapters ?? [] })
    startPolling()
  } catch (err) {
    refineRequested.value = false
    if (err instanceof PaywallError) paywallReason.value = err.reason ?? 'refine'
  }
}
</script>

<template>
  <component
    :is="user ? AppLayout : MarketingLayout"
    :ref="(el: unknown) => (layout = user ? (el as InstanceType<typeof AppLayout>) : null)"
  >
    <div class="video" :class="{ standalone: !user }">
      <div v-if="state === 'loading'" class="skeleton" aria-hidden="true">
        <span class="sk-title" />
        <span class="sk-block" />
      </div>

      <div v-else-if="state === 'missing'" class="missing">
        <h1 class="title">{{ t('app.video.notFoundTitle') }}</h1>
        <p class="muted">{{ t('app.video.notFoundBody') }}</p>
        <RouterLink :to="user ? '/library' : '/'" class="btn btn-ink">{{ t('app.video.backToLibrary') }}</RouterLink>
      </div>

      <template v-else-if="job">
        <header class="head">
          <div class="head-main">
            <RouterLink v-if="user" to="/library" class="back">← {{ t('app.nav.library') }}</RouterLink>
            <div class="title-row">
              <h1 class="title">{{ job.fileName }}</h1>
              <StatusBadge :status="job.status === 'regenerating' ? 'completed' : job.status" :refunded="job.creditsRefunded" />
            </div>
            <p class="muted">{{ meta }}</p>
          </div>
          <a v-if="state === 'ready'" class="btn btn-ghost" :href="downloadUrl(job.id, 'zip')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>
            {{ t('app.video.downloadAll') }}
          </a>
        </header>

        <div v-if="state === 'processing'" class="processing">
          <div class="processing-main">
            <ProcessingSteps :status="job.status" :is-audio="isAudio" :language="language" />
            <p v-if="user" class="note">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg>
              <i18n-t keypath="app.processing.emailNote" tag="span">
                <template #email><strong>{{ user.email }}</strong></template>
              </i18n-t>
            </p>
          </div>
          <aside class="card">
            <h2 class="card-title">{{ t('app.processing.youGet') }}</h2>
            <ul class="outputs">
              <li v-for="key in ['chapters', 'transcript', 'subtitles']" :key="key">
                <strong>{{ t(`app.outputs.${key}.title`) }}</strong>
                <span>{{ t(`app.outputs.${key}.description`) }}</span>
              </li>
            </ul>
          </aside>
        </div>

        <div v-else-if="state === 'failed'" class="failed">
          <h2 class="failed-title">{{ t(`app.video.failure.${failure}.title`) }}</h2>
          <p class="muted">{{ t(`app.video.failure.${failure}.body`) }}</p>
          <p v-if="job.creditsRefunded" class="refunded">{{ t('app.video.creditReturned') }}</p>
          <div class="failed-actions">
            <button
              v-if="failure === 'duration_over_free_limit' || failure === 'insufficient_credits'"
              type="button"
              class="btn btn-ink"
              @click="paywallReason = failure === 'insufficient_credits' ? 'credits' : 'free_duration'"
            >
              {{ t('app.nav.buyCredits') }}
            </button>
            <button v-if="user" type="button" class="btn btn-ghost" @click="layout?.openPicker()">{{ t('app.video.uploadAnother') }}</button>
          </div>
        </div>

        <template v-else>
          <nav class="tabs" :aria-label="t('app.tabs.label')">
            <button
              v-for="item in tabs"
              :key="item.key"
              type="button"
              class="tab"
              :class="{ active: tab === item.key }"
              :aria-current="tab === item.key ? 'page' : undefined"
              @click="setTab(item.key)"
            >
              {{ item.label }}
              <span class="count">{{ item.count }}</span>
            </button>
          </nav>

          <ChaptersTab
            v-if="tab === 'chapters'"
            :job="job"
            :refining="refining"
            @refine="showRefine = true"
            @saved="onSaved"
          />
          <TranscriptTab v-else-if="tab === 'transcript'" :job="job" />
          <SubtitlesTab v-else :job="job" />
        </template>
      </template>
    </div>

    <RefineModal
      v-if="showRefine && job"
      :initial-auto-mode="job.autoMode"
      :initial-chapter-count="job.chapterCount ?? job.chapters?.length ?? 10"
      @close="showRefine = false"
      @submit="onRefine"
    />
    <PaywallModal v-if="paywallReason" :reason="paywallReason" @close="paywallReason = null" />
  </component>
</template>

<style scoped>
@import '../components/video/tab.css';

.video {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.video.standalone {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.head-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.back {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.back:hover {
  color: var(--text);
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.title {
  min-width: 0;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
}

.muted {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.tabs {
  display: flex;
  gap: 28px;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
}

.tab {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
}

.tab.active {
  border-bottom-color: var(--ink);
  color: var(--text);
  font-weight: 600;
}

.count {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--bg);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

.processing {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 28px;
  align-items: start;
}

.processing-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.note {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 12px;
  background: var(--bg);
  font-size: 0.875rem;
}

.note svg {
  flex-shrink: 0;
  color: var(--accent);
}

.outputs {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.outputs li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.outputs strong {
  font-size: 0.875rem;
  color: var(--text);
}

.failed {
  max-width: 640px;
  padding: 28px;
  border: 1px solid #f5c2c0;
  border-radius: 18px;
  background: #fffafa;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.failed-title {
  font-size: 1.15rem;
  font-weight: 700;
}

.refunded {
  font-size: 0.875rem;
  font-weight: 600;
  color: #116b3a;
}

.failed-actions {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.missing {
  max-width: 520px;
  margin: 4rem auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sk-title {
  width: 40%;
  height: 32px;
  border-radius: 8px;
  background: var(--bg);
}

.sk-block {
  height: 320px;
  border-radius: 16px;
  background: var(--bg);
}

@media (max-width: 1100px) {
  .processing {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
