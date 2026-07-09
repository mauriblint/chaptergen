<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UploadProgress } from '../composables/useChunkedUpload'

const props = defineProps<{
  progress: UploadProgress
  retryingChunk?: number | null
}>()

const { t } = useI18n()

const mbUploaded = computed(() =>
  (props.progress.bytesUploaded / (1024 * 1024)).toFixed(0)
)
const mbTotal = computed(() =>
  (props.progress.totalBytes / (1024 * 1024)).toFixed(0)
)
</script>

<template>
  <div class="upload-progress" role="status" aria-live="polite">
    <p class="upload-progress-label">
      {{
        retryingChunk
          ? t('tool.chapterTool.uploadRetry', { current: retryingChunk })
          : t('tool.chapterTool.uploadProgress', { percent: progress.percent })
      }}
    </p>

    <div
      class="upload-progress-bar"
      role="progressbar"
      :aria-valuenow="progress.percent"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="upload-progress-fill" :style="{ width: `${progress.percent}%` }" />
    </div>

    <p class="upload-progress-meta">
      {{ t('tool.chapterTool.uploadChunk', { current: progress.currentChunk, total: progress.totalChunks }) }}
      ·
      {{ mbUploaded }} / {{ mbTotal }} MB
    </p>
  </div>
</template>

<style scoped>
.upload-progress {
  text-align: center;
  padding: 3rem 2rem;
}

.upload-progress-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 1rem;
}

.upload-progress-bar {
  height: 8px;
  background: var(--border);
  border-radius: 999px;
  overflow: hidden;
  max-width: 360px;
  margin: 0 auto 0.75rem;
}

.upload-progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 999px;
  transition: width 0.2s ease;
}

.upload-progress-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
