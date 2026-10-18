<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { languageCode, languageOptions } from '../../utils/languages'

const props = defineProps<{
  /** Language of the current transcript, as Whisper reported it. */
  current: string | null
  pending: boolean
  error: string | null
}>()

const emit = defineEmits<{ close: []; submit: [language: string] }>()
const { t, locale } = useI18n()

const currentCode = computed(() => languageCode(props.current))
const options = computed(() => languageOptions(locale.value).filter((o) => o.code !== currentCode.value))
const language = ref('')
const select = ref<HTMLSelectElement | null>(null)

onMounted(() => select.value?.focus())
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click.self="emit('close')" @keydown.esc="emit('close')">
      <form class="modal" role="dialog" aria-modal="true" aria-labelledby="retranscribe-title" @submit.prevent="language && emit('submit', language)">
        <div class="copy">
          <h2 id="retranscribe-title" class="title">{{ t('app.video.retranscribe.title') }}</h2>
          <p class="lead">{{ t('app.video.retranscribe.lead') }}</p>
        </div>

        <label class="field">
          <span>{{ t('app.video.retranscribe.language') }}</span>
          <span class="select-wrap">
            <select ref="select" v-model="language" required>
              <option value="" disabled>{{ t('app.video.retranscribe.choose') }}</option>
              <option v-for="option in options" :key="option.code" :value="option.code">{{ option.name }}</option>
            </select>
            <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </span>
        </label>

        <p v-if="error" class="error" role="alert">{{ error }}</p>

        <div class="footer">
          <span class="free">{{ t('app.video.retranscribe.free') }}</span>
          <div class="actions">
            <button type="button" class="btn btn-ghost" @click="emit('close')">{{ t('app.video.retranscribe.cancel') }}</button>
            <button type="submit" class="btn btn-ink" :disabled="!language || pending">{{ t('app.video.retranscribe.submit') }}</button>
          </div>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(17, 19, 24, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  width: 100%;
  max-width: 460px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  padding: 1.75rem;
  background: var(--surface);
  border-radius: 22px;
  box-shadow: 0 30px 80px rgba(17, 19, 24, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.lead {
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--text-muted);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  min-height: 44px;
  padding: 0 36px 0 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--page);
  color: var(--text);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}

select:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.chevron {
  position: absolute;
  right: 14px;
  pointer-events: none;
  color: var(--text-muted);
}

.error {
  font-size: 0.875rem;
  color: #b42318;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.free {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.actions {
  display: flex;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
