<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  text: string
  label: string
  primary?: boolean
}>()

const { t } = useI18n()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1800)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <button type="button" class="btn" :class="primary ? 'btn-ink' : 'btn-ghost'" :disabled="!text" @click="copy">
    <svg v-if="copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 8h12v12H8zM16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>
    <span aria-live="polite">{{ copied ? t('app.common.copied') : label }}</span>
  </button>
</template>

<style scoped>
.btn-ghost {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.btn-ghost:hover {
  border-color: var(--text);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
