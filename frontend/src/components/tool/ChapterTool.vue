<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from '../ui/Card.vue'
import VideoUploader from '../VideoUploader.vue'
import { createJob } from '../../composables/useJob'

const props = withDefaults(
  defineProps<{
    variant?: 'video' | 'audio'
  }>(),
  { variant: 'video' }
)

const router = useRouter()
const autoMode = ref(true)
const chapterCount = ref(10)
const uploading = ref(false)
const error = ref<string | null>(null)

async function onFileSelect(file: File) {
  uploading.value = true
  error.value = null

  try {
    const jobId = await createJob(
      file,
      autoMode.value,
      autoMode.value ? undefined : chapterCount.value
    )
    await router.push({ name: 'job', params: { id: jobId } })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
    uploading.value = false
  }
}
</script>

<template>
  <Card class="chapter-tool" shadow="lg">
    <div v-if="!uploading" class="controls">
      <div class="chapter-controls settings">
        <div class="mode-toggle">
          <label class="mode-option">
            <input v-model="autoMode" type="radio" :value="true" />
            Automatic
          </label>
          <label class="mode-option">
            <input v-model="autoMode" type="radio" :value="false" />
            Fixed count
          </label>
        </div>

        <div v-if="!autoMode" class="slider-group">
          <label for="chapters">
            Chapters: <strong>{{ chapterCount }}</strong>
          </label>
          <input
            id="chapters"
            v-model.number="chapterCount"
            type="range"
            min="5"
            max="20"
            step="1"
          />
        </div>
      </div>

      <VideoUploader :variant="variant" @select="onFileSelect" />
    </div>

    <div v-else class="uploading-state">
      <div class="spinner" aria-hidden="true" />
      <p>Uploading file and starting processing…</p>
    </div>

    <div v-if="error" class="error-box">
      <p>{{ error }}</p>
      <button class="btn-secondary" @click="error = null; uploading = false">Try again</button>
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

.chapter-controls.settings {
  margin-top: 0;
  padding: 1rem 1.25rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.mode-toggle {
  display: flex;
  gap: 1.5rem;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  cursor: pointer;
}

.mode-option input {
  accent-color: var(--accent);
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 0.75rem;
}

.slider-group input[type='range'] {
  width: 100%;
  accent-color: var(--accent);
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
</style>
