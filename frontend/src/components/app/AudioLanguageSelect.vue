<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { languageOptions, restoreAudioLanguage, useAudioLanguage } from '../../utils/languages'

/** "Audio language: Auto-detect ▾", shown wherever a video can be uploaded. */
withDefaults(defineProps<{ align?: 'start' | 'center' }>(), { align: 'start' })

const { t, locale } = useI18n()
const language = useAudioLanguage()
const options = computed(() => languageOptions(locale.value))

onMounted(restoreAudioLanguage)
</script>

<template>
  <label class="audio-language" :class="align">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
    <span>{{ t('app.audioLanguage.label') }}</span>
    <span class="select-wrap">
      <select v-model="language">
        <option value="">{{ t('app.audioLanguage.auto') }}</option>
        <option v-for="option in options" :key="option.code" :value="option.code">{{ option.name }}</option>
      </select>
      <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
    </span>
  </label>
</template>

<style scoped>
.audio-language {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.audio-language.center {
  justify-content: center;
}

.select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

select {
  appearance: none;
  -webkit-appearance: none;
  min-height: 34px;
  padding: 0 30px 0 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--page);
  color: var(--text);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

select:hover {
  border-color: #d3d3da;
}

select:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.chevron {
  position: absolute;
  right: 11px;
  pointer-events: none;
  color: var(--text-muted);
}
</style>
