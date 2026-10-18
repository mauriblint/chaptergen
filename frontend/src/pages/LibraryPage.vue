<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import AppLayout from '../layouts/AppLayout.vue'
import StatusBadge from '../components/app/StatusBadge.vue'
import NewVideoPanel from '../components/app/NewVideoPanel.vue'
import { useAuth } from '../composables/useAuth'
import { isJobActive, listJobs } from '../composables/useJob'
import type { JobSummary } from '../types/job'
import { LOCALE_STORAGE_KEY, type Locale } from '../i18n/routing'
import { formatDuration } from '../utils/format'
import { languageName, relativeDate } from '../utils/display'
import { isAudioFile } from '../utils/media'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const { claimCheckout, ensureLoaded, refresh, user } = useAuth()

const layout = ref<InstanceType<typeof AppLayout> | null>(null)
const jobs = ref<JobSummary[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const filter = ref<'all' | 'ready' | 'processing' | 'failed'>('all')
const query = ref('')
const dragging = ref(false)
const purchased = ref<number | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

useHead(computed(() => ({ title: t('app.library.metaTitle'), htmlAttrs: { lang: locale.value } })))

const filters = computed(() => [
  { key: 'all', label: t('app.library.filters.all') },
  { key: 'ready', label: t('app.library.filters.ready') },
  { key: 'processing', label: t('app.library.filters.processing') },
  { key: 'failed', label: t('app.library.filters.failed') },
] as const)

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  return jobs.value.filter((job) => {
    if (q && !job.fileName.toLowerCase().includes(q)) return false
    if (filter.value === 'ready') return job.status === 'completed'
    if (filter.value === 'failed') return job.status === 'failed'
    if (filter.value === 'processing') return isJobActive(job.status)
    return true
  })
})

const firstVideo = computed(() => !loading.value && jobs.value.length === 0)

function applyLocale(next: Locale) {
  locale.value = next
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
  } catch {
    // ignore
  }
}

async function load() {
  try {
    jobs.value = await listJobs()
    error.value = null
    // Keep the list fresh while something is processing.
    const active = jobs.value.some((job) => isJobActive(job.status))
    if (active && !timer) timer = setInterval(load, 4000)
    if (!active && timer) {
      clearInterval(timer)
      timer = null
      void refresh()
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('app.common.loadError')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const sessionId = typeof route.query.session_id === 'string' ? route.query.session_id : ''
  if (sessionId) {
    try {
      const before = user.value?.totalCredits ?? 0
      const claimed = await claimCheckout(sessionId)
      applyLocale(claimed.locale)
      purchased.value = Math.max(0, (claimed.totalCredits ?? 0) - before) || null
    } catch (err) {
      error.value = err instanceof Error ? err.message : t('app.common.loadError')
    }
    await router.replace({ path: '/library' })
  }
  const me = await ensureLoaded()
  if (!me.user) {
    await router.replace('/login')
    return
  }
  await load()
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

function onDrop(event: DragEvent) {
  dragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) layout.value?.pickFile(file)
}

function isAudio(job: JobSummary) {
  return job.mediaType === 'audio' || isAudioFile(job.fileName)
}
</script>

<template>
  <AppLayout ref="layout">
    <div v-if="purchased" class="notice" role="status">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      {{ t('app.library.purchased', { n: purchased }) }}
    </div>

    <NewVideoPanel v-if="firstVideo" first @choose="layout?.openPicker()" @pick="layout?.pickFile($event)" />

    <template v-else>
      <div class="page-head">
        <h1 class="page-title">{{ t('app.nav.library') }}</h1>
      </div>

      <div
        class="drop"
        :class="{ dragging }"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <span class="drop-icon small" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
        </span>
        <div class="drop-copy">
          <span class="drop-row-title">{{ t('app.upload.dropRowTitle') }}</span>
          <span class="drop-hint">{{ t('app.upload.formatsCredit') }}</span>
        </div>
        <button type="button" class="btn btn-ink" @click="layout?.openPicker()">{{ t('app.upload.choose') }}</button>
      </div>

      <div class="tools">
        <div class="segmented" role="group" :aria-label="t('app.library.filterLabel')">
          <button
            v-for="f in filters"
            :key="f.key"
            type="button"
            :aria-pressed="filter === f.key"
            :class="{ active: filter === f.key }"
            @click="filter = f.key"
          >
            {{ f.label }}
          </button>
        </div>
        <label class="search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5" /></svg>
          <input v-model="query" type="search" :placeholder="t('app.library.search')" :aria-label="t('app.library.search')" />
        </label>
      </div>

      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <div v-if="loading" class="skeleton" aria-hidden="true">
        <span v-for="n in 4" :key="n" />
      </div>

      <p v-else-if="!visible.length" class="empty">{{ t('app.library.noMatches') }}</p>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('app.library.columns.name') }}</th>
              <th scope="col" class="hide-sm">{{ t('app.library.columns.duration') }}</th>
              <th scope="col" class="hide-md">{{ t('app.library.columns.language') }}</th>
              <th scope="col" class="hide-sm">{{ t('app.library.columns.created') }}</th>
              <th scope="col">{{ t('app.library.columns.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in visible" :key="job.id" @click="router.push(`/videos/${job.id}`)">
              <td>
                <RouterLink :to="`/videos/${job.id}`" class="file" @click.stop>
                  <span class="file-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path v-if="isAudio(job)" d="M9 3h6v11H9zM5 11a7 7 0 0 0 14 0M12 18v3" />
                      <path v-else d="M3 6h18v12H3zM10 9.5l4.5 2.5-4.5 2.5z" />
                    </svg>
                  </span>
                  <span class="file-name">{{ job.fileName }}</span>
                </RouterLink>
              </td>
              <td class="mono muted hide-sm">{{ formatDuration(job.durationSeconds) ?? '—' }}</td>
              <td class="muted hide-md">{{ languageName(job.language, locale) ?? '—' }}</td>
              <td class="muted hide-sm">{{ relativeDate(job.createdAt, locale, t) }}</td>
              <td><StatusBadge :status="job.status" :refunded="job.creditsRefunded" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
.notice {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
  padding: 14px 18px;
  border-radius: 12px;
  background: #e6f6ec;
  color: #116b3a;
  font-size: 0.9rem;
  font-weight: 600;
}

.page-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 1.5rem;
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.drop {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border: 1.5px dashed #c9cad2;
  border-radius: 16px;
  background: #fbfbfc;
  transition: border-color 0.15s, background 0.15s;
}

.drop.dragging {
  border-color: var(--accent);
  background: #fbfbff;
}

.drop-icon {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 16px;
  background: var(--accent-soft);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-icon.small {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}

.drop-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.drop-row-title {
  font-weight: 600;
}

.drop-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.tools {
  margin: 1.5rem 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.segmented {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: var(--bg);
}

.segmented button {
  min-height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.segmented button.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 1px 3px rgba(17, 19, 24, 0.1);
}

.search {
  height: 38px;
  width: 280px;
  max-width: 100%;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-muted);
}

.search input {
  width: 100%;
  border: 0;
  outline: 0;
  font: inherit;
  font-size: 0.85rem;
  color: var(--text);
  background: transparent;
}

.search:focus-within {
  border-color: var(--text);
}

.table-wrap {
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  height: 40px;
  padding: 0 16px;
  background: #fbfbfc;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

.table td {
  height: 60px;
  padding: 0 16px;
  border-top: 1px solid var(--border);
  font-size: 0.85rem;
}

.table tbody tr {
  cursor: pointer;
}

.table tbody tr:hover {
  background: #fbfbfc;
}

.file {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.file-icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 9px;
  background: var(--bg);
  color: #3c3f45;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 360px;
}

.muted {
  color: #3c3f45;
}

.error {
  margin-bottom: 1rem;
  color: #b42318;
  font-size: 0.9rem;
}

.empty {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-muted);
}

.skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton span {
  height: 56px;
  border-radius: 12px;
  background: var(--bg);
}

@media (max-width: 1100px) {
  .hide-md {
    display: none;
  }
}

@media (max-width: 720px) {
  .hide-sm {
    display: none;
  }

  .drop {
    flex-wrap: wrap;
  }

  .drop .btn {
    width: 100%;
  }

  .search {
    width: 100%;
  }

  .file-name {
    max-width: 180px;
  }
}
</style>
