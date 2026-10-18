<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Job } from '../../types/job'
import { downloadUrl } from '../../composables/useJob'
import { groupByChapter, youtubeTimestamp } from '../../utils/chapters'
import CopyButton from './CopyButton.vue'

const props = defineProps<{ job: Job }>()
const { t } = useI18n()

const query = ref('')
const grouped = ref(true)
const showTimes = ref(true)

const segments = computed(() => props.job.segments ?? [])
const wordCount = computed(() =>
  segments.value.reduce((n, s) => n + s.text.trim().split(/\s+/).filter(Boolean).length, 0)
)

const blocks = computed(() => {
  const q = query.value.trim().toLowerCase()
  const source = grouped.value ? groupByChapter(segments.value, props.job.chapters) : groupByChapter(segments.value, null)
  return source
    .map((block) => ({
      ...block,
      segments: q ? block.segments.filter((s) => s.text.toLowerCase().includes(q)) : block.segments,
    }))
    .filter((block) => block.segments.length)
})

const matches = computed(() => blocks.value.reduce((n, b) => n + b.segments.length, 0))

const plainText = computed(() =>
  segments.value
    .map((s) => s.text.trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
)

/** Splits text around the search term so matches can be highlighted safely. */
function parts(text: string): { text: string; hit: boolean }[] {
  const q = query.value.trim()
  if (!q) return [{ text, hit: false }]
  const lower = text.toLowerCase()
  const needle = q.toLowerCase()
  const out: { text: string; hit: boolean }[] = []
  let from = 0
  let at = lower.indexOf(needle)
  while (at !== -1) {
    if (at > from) out.push({ text: text.slice(from, at), hit: false })
    out.push({ text: text.slice(at, at + needle.length), hit: true })
    from = at + needle.length
    at = lower.indexOf(needle, from)
  }
  if (from < text.length) out.push({ text: text.slice(from), hit: false })
  return out
}
</script>

<template>
  <div class="tab-grid">
    <div class="main">
      <div class="toolbar">
        <label class="search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5" /></svg>
          <input v-model="query" type="search" :placeholder="t('app.transcript.search')" :aria-label="t('app.transcript.search')" />
        </label>
        <div class="actions">
          <a class="btn btn-ghost" :href="downloadUrl(job.id, 'transcript')">.txt</a>
          <a class="btn btn-ghost" :href="downloadUrl(job.id, 'docx')">.docx</a>
          <CopyButton :text="plainText" :label="t('app.transcript.copy')" primary />
        </div>
      </div>

      <p v-if="query" class="hint" aria-live="polite">{{ t('app.transcript.matches', { n: matches }, matches) }}</p>

      <div class="reader">
        <section v-for="(block, i) in blocks" :key="i" class="block">
          <h2 v-if="grouped && block.title" class="block-title">
            <span class="mono time">{{ youtubeTimestamp(block.start) }}</span>
            {{ block.title }}
          </h2>
          <p v-if="!showTimes" class="para">
            <template v-for="(seg, j) in block.segments" :key="j">
              <template v-for="(part, k) in parts(seg.text.trim())" :key="k"><mark v-if="part.hit">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template>{{ ' ' }}
            </template>
          </p>
          <div v-else class="lines">
            <p v-for="(seg, j) in block.segments" :key="j" class="line">
              <span class="mono stamp">{{ youtubeTimestamp(seg.start) }}</span>
              <span><template v-for="(part, k) in parts(seg.text.trim())" :key="k"><mark v-if="part.hit">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template></span>
            </p>
          </div>
        </section>
        <p v-if="!blocks.length" class="empty">{{ t('app.transcript.noMatches') }}</p>
      </div>
    </div>

    <aside class="side">
      <div class="card">
        <h2 class="card-title">{{ t('app.transcript.display') }}</h2>
        <label class="switch-row">
          {{ t('app.transcript.groupByChapter') }}
          <input v-model="grouped" type="checkbox" role="switch" class="switch" />
        </label>
        <label class="switch-row">
          {{ t('app.transcript.showTimestamps') }}
          <input v-model="showTimes" type="checkbox" role="switch" class="switch" />
        </label>
        <p class="help">{{ t('app.transcript.words', { n: wordCount.toLocaleString() }) }}</p>
      </div>
      <div class="card soft">
        <h2 class="card-title">{{ t('app.transcript.reuseTitle') }}</h2>
        <p class="help">{{ t('app.transcript.reuseBody') }}</p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
@import './tab.css';

.search {
  height: 40px;
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

.search:focus-within {
  border-color: var(--text);
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

.reader {
  padding: 28px 32px;
  border: 1px solid var(--border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.block-title {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 1rem;
  font-weight: 700;
}

.time {
  font-size: 0.75rem;
  color: var(--accent);
}

.para {
  font-size: 0.95rem;
  line-height: 1.75;
  color: #2c2f35;
}

.lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.line {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 12px;
  font-size: 0.95rem;
  line-height: 1.65;
  color: #2c2f35;
}

.stamp {
  padding-top: 3px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

mark {
  background: #fff1a8;
  color: inherit;
  border-radius: 3px;
}

.empty {
  color: var(--text-muted);
  text-align: center;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  cursor: pointer;
}

.switch {
  appearance: none;
  width: 40px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 999px;
  background: var(--border);
  position: relative;
  cursor: pointer;
  transition: background 0.15s;
}

.switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.15s;
}

.switch:checked {
  background: var(--ink);
}

.switch:checked::after {
  transform: translateX(16px);
}

@media (max-width: 640px) {
  .reader {
    padding: 20px 16px;
  }

  .search {
    width: 100%;
  }
}
</style>
