<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Job } from '../../types/job'
import { downloadUrl, fetchSubtitles } from '../../composables/useJob'
import CopyButton from './CopyButton.vue'

const props = defineProps<{ job: Job }>()
const { t } = useI18n()

const format = ref<'srt' | 'vtt'>('srt')
const settings = reactive({ maxChars: 42, maxLines: 2 })
const content = ref('')
const loading = ref(true)
const error = ref<string | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

const charOptions = [32, 37, 42, 50]
const lineOptions = [1, 2]

async function load() {
  loading.value = true
  error.value = null
  try {
    content.value = await fetchSubtitles(props.job.id, format.value, settings)
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('app.common.loadError')
  } finally {
    loading.value = false
  }
}

watch(
  () => [format.value, settings.maxChars, settings.maxLines],
  () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(load, 150)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="tab-grid">
    <div class="main">
      <div class="toolbar">
        <div class="segmented" role="group" :aria-label="t('app.subtitles.format')">
          <button
            v-for="f in ['srt', 'vtt'] as const"
            :key="f"
            type="button"
            :aria-pressed="format === f"
            :class="{ active: format === f }"
            @click="format = f"
          >
            {{ f.toUpperCase() }}
          </button>
        </div>
        <div class="actions">
          <CopyButton :text="content" :label="t('app.common.copy')" />
          <a class="btn btn-ink" :href="downloadUrl(job.id, format, settings)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16" /></svg>
            {{ t('app.subtitles.download', { ext: format }) }}
          </a>
        </div>
      </div>
      <p v-if="error" class="hint error" role="alert">{{ error }}</p>
      <pre class="code mono" :class="{ loading }" :aria-busy="loading">{{ content }}</pre>
    </div>

    <aside class="side">
      <div class="card">
        <h2 class="card-title">{{ t('app.subtitles.settings') }}</h2>
        <label class="select-row">
          {{ t('app.subtitles.maxChars') }}
          <select v-model.number="settings.maxChars">
            <option v-for="n in charOptions" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
        <label class="select-row">
          {{ t('app.subtitles.maxLines') }}
          <select v-model.number="settings.maxLines">
            <option v-for="n in lineOptions" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
        <p class="help">{{ t('app.subtitles.settingsHelp') }}</p>
      </div>
      <div class="card soft">
        <h2 class="card-title">{{ t('app.subtitles.youtubeTitle') }}</h2>
        <p class="help">{{ t('app.subtitles.youtubeHelp') }}</p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
@import './tab.css';

.segmented {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: var(--bg);
}

.segmented button {
  min-height: 34px;
  padding: 0 14px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.segmented button.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 1px 3px rgba(17, 19, 24, 0.1);
}

.code {
  margin: 0;
  padding: 24px 28px;
  max-height: 640px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #fbfbfc;
  font-size: 0.8rem;
  line-height: 1.7;
  white-space: pre-wrap;
  transition: opacity 0.15s;
}

.code.loading {
  opacity: 0.5;
}

.error {
  color: #b42318;
}

.select-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
}

.select-row select {
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  font: inherit;
  font-weight: 600;
  color: var(--text);
}

@media (max-width: 640px) {
  .code {
    padding: 16px;
  }
}
</style>
