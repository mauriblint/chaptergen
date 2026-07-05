<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Chapter } from '../types'

const props = defineProps<{
  chapters: Chapter[]
  formatted: string
  loading?: boolean
  hasTranscript?: boolean
}>()

const emit = defineEmits<{
  update: [index: number, field: 'time' | 'title', value: string]
  refine: []
  download: [type: 'chapters' | 'transcript']
}>()

const copied = ref(false)

const chapterCount = computed(() => props.chapters.length)
const hasChapters = computed(() => !!props.formatted)

async function copyToClipboard() {
  await navigator.clipboard.writeText(props.formatted)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="result" :class="{ loading }">
    <div class="result-header">
      <div class="result-heading">
        <h2>Generated timestamps</h2>
        <p class="result-sub">
          {{ chapterCount }} {{ chapterCount === 1 ? 'chapter' : 'chapters' }} · tap any field to
          edit
        </p>
      </div>

      <div class="result-actions">
        <button
          class="action action-primary"
          :disabled="!hasChapters"
          @click="copyToClipboard"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              v-if="!copied"
              d="M5.5 5.5V3.5A1.5 1.5 0 0 1 7 2h5.5A1.5 1.5 0 0 1 14 3.5V9a1.5 1.5 0 0 1-1.5 1.5h-2M3.5 5.5H9A1.5 1.5 0 0 1 10.5 7v5.5A1.5 1.5 0 0 1 9 14H3.5A1.5 1.5 0 0 1 2 12.5V7a1.5 1.5 0 0 1 1.5-1.5Z"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else
              d="M3 8.5 6.5 12 13 4.5"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ copied ? 'Copied' : 'Copy' }}
        </button>

        <button class="action action-ghost" :disabled="loading" @click="emit('refine')">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="m9.5 2.5 1 2.5 2.5 1-2.5 1-1 2.5-1-2.5L6 6.5l2.5-1 1-2.5ZM4 9l.6 1.4L6 11l-1.4.6L4 13l-.6-1.4L2 11l1.4-.6L4 9Z"
              fill="currentColor"
            />
          </svg>
          Refine
        </button>

        <span class="action-divider" aria-hidden="true" />

        <button
          class="action action-ghost"
          :disabled="!hasChapters"
          title="Download chapters"
          @click="emit('download', 'chapters')"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 2v8m0 0L5 7m3 3 3-3M3 13h10"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Chapters
        </button>

        <button
          class="action action-ghost"
          :disabled="!hasTranscript"
          title="Download transcript"
          @click="emit('download', 'transcript')"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 2v8m0 0L5 7m3 3 3-3M3 13h10"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Transcript
        </button>
      </div>
    </div>

    <div class="chapter-list">
      <div v-for="(chapter, i) in chapters" :key="i" class="chapter-row">
        <input
          class="chapter-time"
          :value="chapter.time"
          :aria-label="`Chapter ${i + 1} timestamp`"
          @input="emit('update', i, 'time', ($event.target as HTMLInputElement).value)"
        />
        <input
          class="chapter-title"
          :value="chapter.title"
          :aria-label="`Chapter ${i + 1} title`"
          @input="emit('update', i, 'title', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <details class="preview-wrap">
      <summary>Preview raw text</summary>
      <pre class="preview">{{ formatted }}</pre>
    </details>
  </div>
</template>

<style scoped>
.result.loading {
  opacity: 0.5;
  pointer-events: none;
}

.result {
  margin-top: 0;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.result-heading h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
}

.result-sub {
  margin-top: 0.2rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.result-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s, color 0.15s, opacity 0.15s;
}

.action svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.action-primary {
  background: var(--accent);
  color: #fff;
}

.action-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.action-ghost {
  background: transparent;
  color: var(--text-muted);
  border-color: var(--border);
}

.action-ghost:hover:not(:disabled) {
  color: var(--text);
  border-color: var(--accent);
  background: var(--bg);
}

.action-divider {
  width: 1px;
  align-self: stretch;
  margin: 0.15rem 0.25rem;
  background: var(--border);
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.chapter-row {
  display: flex;
  gap: 0.75rem;
}

.chapter-time {
  width: 7rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.5rem 0.75rem;
  color: var(--accent);
}

.chapter-title {
  flex: 1;
  font-size: 0.9rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.5rem 0.75rem;
  color: var(--text);
}

.chapter-time:focus,
.chapter-title:focus {
  outline: none;
  border-color: var(--accent);
}

.preview-wrap {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
}

.preview-wrap summary {
  padding: 0.65rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  user-select: none;
}

.preview-wrap summary:hover {
  color: var(--text);
}

.preview-wrap[open] summary {
  border-bottom: 1px solid var(--border);
}

.preview {
  padding: 1rem 1.25rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--text-muted);
  white-space: pre-wrap;
  overflow-x: auto;
}
</style>
