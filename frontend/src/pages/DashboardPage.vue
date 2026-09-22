<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import Card from '../components/ui/Card.vue'
import ChapterTool from '../components/tool/ChapterTool.vue'
import { useAuth, type AccountJob } from '../composables/useAuth'
import { LOCALE_STORAGE_KEY, type Locale } from '../i18n/routing'
import { formatDate, formatFileKind } from '../utils/format'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const { claimCheckout, fetchAccount, user, ensureLoaded } = useAuth()

const loading = ref(true)
const error = ref<string | null>(null)
const jobs = ref<AccountJob[]>([])

const creditsLevel = computed(() => {
  const credits = user.value?.credits ?? 0
  if (credits <= 0) return 'low'
  if (credits <= 2) return 'mid'
  return 'high'
})

const filesLabel = computed(() => {
  const count = jobs.value.length
  return count === 1 ? t('dashboard.fileCountOne') : t('dashboard.fileCount', { count })
})

useHead(
  computed(() => ({
    title: t('dashboard.metaTitle'),
    htmlAttrs: { lang: locale.value },
  }))
)

function applyLocale(next: Locale) {
  locale.value = next
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
  } catch {
    // ignore
  }
}

function statusKind(status: string): 'completed' | 'failed' | 'progress' {
  if (status === 'completed') return 'completed'
  if (status === 'failed') return 'failed'
  return 'progress'
}

onMounted(async () => {
  try {
    const sessionId =
      typeof route.query.session_id === 'string' ? route.query.session_id : ''
    if (sessionId) {
      const claimed = await claimCheckout(sessionId)
      applyLocale(claimed.locale)
      await router.replace({ path: '/dashboard' })
    }

    const me = await ensureLoaded()
    if (!me.user) {
      await router.replace('/login')
      return
    }
    applyLocale(me.user.locale)

    const account = await fetchAccount()
    jobs.value = account.jobs
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.loadError')
    const me = await ensureLoaded().catch(() => null)
    if (!me?.user) {
      await router.replace('/login')
      return
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <MarketingLayout>
    <div class="wrap">
      <div v-if="loading" class="muted">{{ t('dashboard.loading') }}</div>

      <template v-else-if="user">
        <header class="hero">
          <h1>{{ t('dashboard.title') }}</h1>
          <p class="credits-pill" :class="creditsLevel">
            <span class="dot" aria-hidden="true" />
            <strong>{{ user.credits }}</strong>
            {{ t('dashboard.creditsWord') }}
          </p>
        </header>

        <p v-if="error" class="error">{{ error }}</p>

        <ChapterTool compact />

        <Card class="history-card">
          <div class="history-head">
            <h2>{{ t('dashboard.history') }}</h2>
            <span class="history-count">{{ filesLabel }}</span>
          </div>
          <p v-if="!jobs.length" class="empty">{{ t('dashboard.noHistory') }}</p>
          <ul v-else class="list">
            <li v-for="job in jobs" :key="job.id">
              <span v-if="formatFileKind(job.fileName, job.fileExtension)" class="kind">
                {{ formatFileKind(job.fileName, job.fileExtension) }}
              </span>
              <p class="job-name">{{ job.fileName }}</p>
              <span class="status" :class="statusKind(job.status)">
                {{ t(`dashboard.status.${job.status}`) }}
              </span>
              <span class="job-date">{{ formatDate(job.createdAt, locale) }}</span>
              <RouterLink class="open" :to="{ name: 'job', params: { id: job.id } }">
                {{ t('dashboard.open') }}
              </RouterLink>
            </li>
          </ul>
        </Card>
      </template>
    </div>
  </MarketingLayout>
</template>

<style scoped>
.wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.4rem;
}

h1 {
  font-size: 1.8rem;
}

.credits-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.4rem 0.85rem 0.4rem 0.7rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1;
  white-space: nowrap;
  background: var(--surface);
}

.credits-pill strong {
  color: var(--text);
  font-size: 1rem;
  font-weight: 700;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.credits-pill.low .dot {
  background: #ef4444;
}

.credits-pill.mid .dot {
  background: #f59e0b;
}

.credits-pill.high .dot {
  background: #22c55e;
}

.history-card {
  padding: 0;
}

.history-head {
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  padding: 0.85rem 1.15rem;
  border-bottom: 1px solid var(--border);
}

.history-head h2 {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
}

.history-count {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.empty {
  padding: 1.1rem 1.15rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.list {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.list li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.15rem;
}

.list li + li {
  border-top: 1px solid var(--border);
}

.kind {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.job-name {
  font-weight: 600;
  font-size: 0.92rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status {
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.2rem 0.65rem;
  white-space: nowrap;
}

.status.completed {
  color: #059669;
  background: #ecfdf5;
}

.status.failed {
  color: #b91c1c;
  background: #fef2f2;
}

.status.progress {
  color: #4338ca;
  background: #eef2ff;
}

.job-date {
  color: var(--text-muted);
  font-size: 0.85rem;
  white-space: nowrap;
}

.open {
  flex-shrink: 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
}

.open:hover {
  opacity: 0.8;
}

.muted {
  color: var(--text-muted);
}

.error {
  color: #dc2626;
}

@media (max-width: 700px) {
  .hero {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.35rem;
  }

  .list li {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      'kind name open'
      'kind status date';
  }

  .kind {
    grid-area: kind;
  }

  .job-name {
    grid-area: name;
  }

  .open {
    grid-area: open;
  }

  .status {
    grid-area: status;
    justify-self: start;
  }

  .job-date {
    grid-area: date;
  }
}
</style>
