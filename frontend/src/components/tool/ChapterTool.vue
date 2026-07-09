<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from '../ui/Card.vue'
import VideoUploader from '../VideoUploader.vue'
import UploadProgress from '../UploadProgress.vue'
import { useChunkedUpload } from '../../composables/useChunkedUpload'

const props = withDefaults(
  defineProps<{
    variant?: 'video' | 'audio'
  }>(),
  { variant: 'video' }
)

const { t } = useI18n()
const router = useRouter()
const uploading = ref(false)
const error = ref<string | null>(null)
const { progress, retryingChunk, uploadAndCreateJob } = useChunkedUpload()

async function onFileSelect(file: File) {
  uploading.value = true
  error.value = null

  try {
    const jobId = await uploadAndCreateJob(file, true)
    await router.push({ name: 'job', params: { id: jobId } })
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : t('tool.chapterTool.uploadFailed')
    uploading.value = false
  }
}
</script>

<template>
  <Card class="chapter-tool" shadow="lg">
    <div v-if="!uploading" class="controls">
      <VideoUploader :variant="variant" @select="onFileSelect" />

      <div class="trust-strip">
        <span class="trust-item">
          <span class="stars" aria-hidden="true">★★★★★</span>
          <strong>{{ t('tool.chapterTool.rating') }}</strong> · {{ t('tool.chapterTool.ratingSuffix') }}
        </span>
        <span class="trust-item">
          <svg class="trust-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          {{ t('tool.chapterTool.filesDeleted') }}
        </span>
        <span class="trust-item">{{ t('tool.chapterTool.noSignup') }}</span>
      </div>
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
</template>

<style scoped>
.chapter-tool {
  width: 100%;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.uploading-state {
  text-align: center;
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

.trust-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem 1.5rem;
  padding-top: 0.25rem;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  position: relative;
}

.trust-item + .trust-item::before {
  content: '';
  position: absolute;
  left: -0.8rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 14px;
  background: var(--border);
}

.trust-item strong {
  color: var(--text);
  font-weight: 600;
}

.stars {
  color: #f59e0b;
  letter-spacing: 0.05em;
}

.trust-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

@media (max-width: 560px) {
  .trust-item + .trust-item::before {
    display: none;
  }
}
</style>
