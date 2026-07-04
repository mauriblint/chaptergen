<script setup lang="ts">
import { ref } from 'vue'
import ProcessingStatus from './components/ProcessingStatus.vue'
import TimestampsResult from './components/TimestampsResult.vue'
import VideoUploader from './components/VideoUploader.vue'
import { useTimestampGenerator } from './composables/useTimestampGenerator'

const autoMode = ref(true)
const chapterCount = ref(10)
const selectedFile = ref<File | null>(null)

const {
  step,
  error,
  chapters,
  formatted,
  processVideo,
  regenerateChapters,
  updateChapter,
  reset,
} = useTimestampGenerator()

async function onFileSelect(file: File) {
  selectedFile.value = file
  await processVideo(file, autoMode.value, autoMode.value ? undefined : chapterCount.value)
}

async function onRegenerate() {
  await regenerateChapters(
    autoMode.value,
    autoMode.value ? undefined : chapterCount.value
  )
}

function onReset() {
  selectedFile.value = null
  reset()
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>YouTube Timestamps</h1>
      <p class="subtitle">Generá capítulos automáticamente con IA</p>
    </header>

    <main class="main">
      <div v-if="step === 'idle' || step === 'error'" class="controls">
        <VideoUploader @select="onFileSelect" />
      </div>

      <ProcessingStatus :step="step" :file-name="selectedFile?.name" />

      <div v-if="error" class="error-box">
        <p>{{ error }}</p>
        <button class="btn-secondary" @click="onReset">Intentar de nuevo</button>
      </div>

      <div v-if="step === 'done' || step === 'regenerating'" class="chapter-controls">
        <div class="mode-toggle">
          <label class="mode-option">
            <input v-model="autoMode" type="radio" :value="true" />
            Automático
          </label>
          <label class="mode-option">
            <input v-model="autoMode" type="radio" :value="false" />
            Cantidad fija
          </label>
        </div>

        <div v-if="!autoMode" class="slider-group">
          <label for="chapters">
            Capítulos: <strong>{{ chapterCount }}</strong>
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

        <button
          class="btn-regenerate"
          :disabled="step === 'regenerating'"
          @click="onRegenerate"
        >
          Regenerar capítulos
        </button>
      </div>

      <TimestampsResult
        v-if="step === 'done' || step === 'regenerating'"
        :chapters="chapters"
        :formatted="formatted"
        :loading="step === 'regenerating'"
        @update="updateChapter"
      />

      <button v-if="step === 'done' || step === 'regenerating'" class="btn-secondary reset-btn" @click="onReset">
        Procesar otro video
      </button>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.subtitle {
  color: var(--text-muted);
  margin-top: 0.5rem;
  font-size: 0.95rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chapter-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
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
}

.slider-group input[type='range'] {
  width: 100%;
  accent-color: var(--accent);
}

.btn-regenerate {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  align-self: flex-start;
  transition: opacity 0.2s;
}

.btn-regenerate:hover:not(:disabled) {
  opacity: 0.85;
}

.btn-regenerate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-box {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.error-box p {
  color: #fca5a5;
  font-size: 0.9rem;
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--text);
}

.reset-btn {
  margin-top: 1.5rem;
  width: 100%;
}
</style>
