<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from '../ui/Card.vue'
import VideoUploader from '../VideoUploader.vue'
import UploadProgress from '../UploadProgress.vue'
import PaywallModal from '../PaywallModal.vue'
import { useChunkedUpload } from '../../composables/useChunkedUpload'
import { PaywallError, type PaywallReason } from '../../utils/api'
import { useAuth } from '../../composables/useAuth'
import { trackUpload, trackUploadError } from '../../utils/analytics'

const props = withDefaults(
  defineProps<{
    variant?: 'video' | 'audio'
    compact?: boolean
  }>(),
  { variant: 'video', compact: false }
)

const { t } = useI18n()
const router = useRouter()
const uploading = ref(false)
const error = ref<string | null>(null)
const showPaywall = ref(false)
const paywallReason = ref<PaywallReason>('free_limit')
const { progress, retryingChunk, uploadAndCreateJob } = useChunkedUpload()
const { ensureLoaded } = useAuth()

const trustItems = computed(() => [
  t('tool.chapterTool.noSignup'),
  t('tool.chapterTool.filesDeleted'),
  t('tool.chapterTool.languages'),
])

onMounted(() => {
  void ensureLoaded()
})

async function onFileSelect(file: File) {
  const me = await ensureLoaded()
  if (!me.user && me.freeUsed >= me.freeLimit) {
    paywallReason.value = 'free_limit'
    showPaywall.value = true
    return
  }

  uploading.value = true
  error.value = null
  trackUpload()

  try {
    const jobId = await uploadAndCreateJob(file, true)
    await router.push({ name: 'job', params: { id: jobId } })
  } catch (err) {
    if (err instanceof PaywallError) {
      paywallReason.value = err.reason ?? (me.user ? 'credits' : 'free_limit')
      showPaywall.value = true
      uploading.value = false
      return
    }
    const message =
      err instanceof Error ? err.message : t('tool.chapterTool.uploadFailed')
    trackUploadError(message)
    error.value = message
    uploading.value = false
  }
}
</script>

<template>
  <Card class="chapter-tool" :class="{ compact }" :shadow="compact ? 'lg' : 'none'">
    <div v-if="!uploading" class="controls">
      <VideoUploader :variant="variant" :compact="compact" @select="onFileSelect" />

      <ul v-if="!props.compact" class="trust-strip">
        <li v-for="item in trustItems" :key="item" class="trust-item">
          <svg class="trust-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          {{ item }}
        </li>
      </ul>
    </div>

    <UploadProgress
      v-else-if="progress"
      :progress="progress"
      :retrying-chunk="retryingChunk"
    />

    <div v-else class="uploading-state">
      <div class="spinner" aria-hidden="true" />
      <p>{{ t('tool.chapterTool.uploading') }}</p>
    </div>

    <div v-if="error" class="error-box">
      <p>{{ error }}</p>
      <button class="btn-secondary" @click="error = null; uploading = false">
        {{ t('tool.chapterTool.tryAgain') }}
      </button>
    </div>
  </Card>

  <PaywallModal v-if="showPaywall" :reason="paywallReason" @close="showPaywall = false" />
</template>

<style scoped>
.chapter-tool {
  width: 100%;
}

.chapter-tool.compact {
  padding: 0.65rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.uploading-state {
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 3rem 2rem;
  color: var(--text-muted);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
  cursor: pointer;
  white-space: nowrap;
}

.chapter-tool:not(.compact) {
  padding: 0;
  border: none;
  background: transparent;
}

.chapter-tool:not(.compact) :deep(.upload-progress) {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
}

.trust-strip {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.trust-icon {
  color: var(--accent);
  flex-shrink: 0;
}
</style>
