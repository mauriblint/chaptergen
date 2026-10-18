<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Chapter } from '../../types'
import type { Job } from '../../types/job'
import { downloadUrl, saveChapters } from '../../composables/useJob'
import {
  checkYoutubeRules,
  isValidTime,
  timeToSeconds,
  toYoutubeText,
  youtubeTimestamp,
} from '../../utils/chapters'
import CopyButton from './CopyButton.vue'

const props = defineProps<{
  job: Job
  refining: boolean
}>()

const emit = defineEmits<{ refine: []; saved: [job: Job] }>()
const { t } = useI18n()

const rows = ref<Chapter[]>([])
const saveState = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
let saveTimer: ReturnType<typeof setTimeout> | null = null

function load(chapters: Chapter[] | null) {
  rows.value = (chapters ?? []).map((c) => ({
    time: youtubeTimestamp(timeToSeconds(c.time)),
    title: c.title,
  }))
}

// New chapters arrive after a refine; local edits are replaced by them.
watch(() => props.job.chapters, load, { immediate: true })

const validRows = computed(() => rows.value.filter((r) => isValidTime(r.time) && r.title.trim()))
const youtubeText = computed(() => toYoutubeText(validRows.value))
const check = computed(() => checkYoutubeRules(validRows.value, props.job.durationSeconds))

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer)
  if (rows.value.some((r) => !isValidTime(r.time))) return
  saveTimer = setTimeout(async () => {
    saveState.value = 'saving'
    try {
      const updated = await saveChapters(props.job.id, validRows.value)
      saveState.value = 'saved'
      emit('saved', updated)
    } catch {
      saveState.value = 'error'
    }
  }, 700)
}

onBeforeUnmount(() => {
  if (saveTimer) clearTimeout(saveTimer)
})

function update(index: number, field: keyof Chapter, value: string) {
  rows.value[index][field] = value
  scheduleSave()
}

function remove(index: number) {
  rows.value.splice(index, 1)
  scheduleSave()
}

function add() {
  const last = rows.value[rows.value.length - 1]
  const start = last ? timeToSeconds(last.time) + 30 : 0
  rows.value.push({ time: youtubeTimestamp(start), title: '' })
}

const rules = computed(() => [
  { ok: check.value.startsAtZero, label: t('app.chapters.rules.zero') },
  { ok: check.value.enoughChapters, label: t('app.chapters.rules.count', { n: validRows.value.length }) },
  { ok: check.value.longEnough, label: t('app.chapters.rules.length') },
  { ok: check.value.inOrder, label: t('app.chapters.rules.order') },
])
</script>

<template>
  <div class="tab-grid">
    <div class="main">
      <div class="toolbar">
        <span class="hint" aria-live="polite">
          <template v-if="saveState === 'saving'">{{ t('app.chapters.saving') }}</template>
          <template v-else-if="saveState === 'saved'">{{ t('app.chapters.saved') }}</template>
          <template v-else-if="saveState === 'error'">{{ t('app.chapters.saveError') }}</template>
          <template v-else>{{ t('app.chapters.editHint') }}</template>
        </span>
        <div class="actions">
          <button type="button" class="btn btn-ghost" :disabled="refining" @click="emit('refine')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>
            {{ t('app.chapters.refine') }}
          </button>
          <CopyButton :text="youtubeText" :label="t('app.chapters.copy')" primary />
        </div>
      </div>

      <p v-if="job.refinesLeft != null" class="refines">
        {{ t('app.chapters.refinesLeft', { n: job.refinesLeft }, job.refinesLeft) }}
      </p>

      <div class="list" :class="{ dim: refining }" :aria-busy="refining">
        <div v-if="refining" class="refining" role="status">
          <span class="spinner" aria-hidden="true" />
          {{ t('app.chapters.refining') }}
        </div>
        <div v-for="(row, i) in rows" :key="i" class="row">
          <input
            class="time mono"
            :class="{ invalid: !isValidTime(row.time) }"
            :value="row.time"
            :aria-label="t('app.chapters.timeLabel', { n: i + 1 })"
            :aria-invalid="!isValidTime(row.time)"
            inputmode="numeric"
            @input="update(i, 'time', ($event.target as HTMLInputElement).value)"
          />
          <input
            class="title"
            :value="row.title"
            :aria-label="t('app.chapters.titleLabel', { n: i + 1 })"
            maxlength="200"
            @input="update(i, 'title', ($event.target as HTMLInputElement).value)"
          />
          <button type="button" class="remove" :aria-label="t('app.chapters.remove', { n: i + 1 })" @click="remove(i)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <button type="button" class="add" @click="add">+ {{ t('app.chapters.add') }}</button>
      </div>
    </div>

    <aside class="side">
      <div class="card">
        <h2 class="card-title">{{ t('app.chapters.checkTitle') }}</h2>
        <ul class="rules">
          <li v-for="rule in rules" :key="rule.label" :class="{ bad: !rule.ok }">
            <svg v-if="rule.ok" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 7v6M12 17h.01" /></svg>
            <span>{{ rule.label }}</span>
          </li>
        </ul>
      </div>
      <div class="card soft">
        <h2 class="card-title">{{ t('app.chapters.previewTitle') }}</h2>
        <pre class="preview mono">{{ youtubeText }}</pre>
        <p class="help">{{ t('app.chapters.pasteHelp') }}</p>
        <a class="download" :href="downloadUrl(job.id, 'chapters')">{{ t('app.chapters.downloadTxt') }}</a>
      </div>
    </aside>
  </div>
</template>

<style scoped>
@import './tab.css';

.refines {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list.dim .row {
  opacity: 0.35;
}

.refining {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 600;
}

.row {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 32px;
  gap: 10px;
  align-items: center;
}

.time,
.title {
  height: 44px;
  min-width: 0;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font: inherit;
  font-size: 0.95rem;
  color: var(--text);
  background: var(--surface);
}

.time {
  background: var(--bg);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent);
}

.time:focus,
.title:focus {
  outline: none;
  border-color: var(--text);
}

.time.invalid {
  border-color: #d92d20;
  color: #b42318;
}

.remove {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #9a9da3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.remove:hover {
  background: var(--bg);
  color: #b42318;
}

.add {
  min-height: 42px;
  border: 1.5px dashed var(--border);
  border-radius: 10px;
  background: transparent;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
}

.add:hover {
  border-color: var(--text);
  color: var(--text);
}

.rules {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.85rem;
}

.rules li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #116b3a;
}

.rules li span {
  color: var(--text);
}

.rules li.bad {
  color: #b42318;
}

.preview {
  margin: 0;
  padding: 14px;
  max-height: 320px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  font-size: 0.75rem;
  line-height: 1.7;
  white-space: pre-wrap;
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: 76px minmax(0, 1fr) 32px;
    gap: 6px;
  }
}
</style>
