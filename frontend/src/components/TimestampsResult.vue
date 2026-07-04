<script setup lang="ts">
import { ref } from 'vue'
import type { Chapter } from '../types'

const props = defineProps<{
  chapters: Chapter[]
  formatted: string
  loading?: boolean
}>()

const emit = defineEmits<{
  update: [index: number, field: 'time' | 'title', value: string]
}>()

const copied = ref(false)

async function copyToClipboard() {
  await navigator.clipboard.writeText(props.formatted)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="result" :class="{ loading }">
    <div class="result-header">
      <h2>Timestamps generados</h2>
      <button class="btn-copy" @click="copyToClipboard">
        {{ copied ? 'Copiado ✓' : 'Copiar al portapapeles' }}
      </button>
    </div>

    <div class="chapter-list">
      <div v-for="(chapter, i) in chapters" :key="i" class="chapter-row">
        <input
          class="chapter-time"
          :value="chapter.time"
          @input="emit('update', i, 'time', ($event.target as HTMLInputElement).value)"
        />
        <input
          class="chapter-title"
          :value="chapter.title"
          @input="emit('update', i, 'title', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <pre class="preview">{{ formatted }}</pre>
  </div>
</template>

<style scoped>
.result.loading {
  opacity: 0.5;
  pointer-events: none;
}

.result {
  margin-top: 2rem;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.result-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-copy {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-copy:hover {
  opacity: 0.85;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.chapter-row {
  display: flex;
  gap: 0.75rem;
}

.chapter-time {
  width: 7rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  color: var(--accent);
}

.chapter-title {
  flex: 1;
  font-size: 0.9rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  color: var(--text);
}

.chapter-time:focus,
.chapter-title:focus {
  outline: none;
  border-color: var(--accent);
}

.preview {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--text-muted);
  white-space: pre-wrap;
  overflow-x: auto;
}
</style>
