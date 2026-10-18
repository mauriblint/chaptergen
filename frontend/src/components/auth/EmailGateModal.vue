<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import EmailCodeForm from './EmailCodeForm.vue'
import FileChip from '../app/FileChip.vue'
import type { VerifyCodeResult } from '../../composables/useAuth'

defineProps<{
  fileName: string
  percent: number | null
  uploadError?: string | null
}>()

const emit = defineEmits<{ close: []; verified: [result: VerifyCodeResult] }>()
const { t } = useI18n()

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click.self="emit('close')">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="t('app.gate.emailTitle')">
        <button type="button" class="close" :aria-label="t('app.common.close')" @click="emit('close')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <FileChip :name="fileName" :percent="percent" :error="uploadError" />
        <EmailCodeForm variant="gate" @verified="emit('verified', $event)" />
      </div>
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
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  padding: 2rem;
  background: var(--surface);
  border-radius: 22px;
  box-shadow: 0 30px 80px rgba(17, 19, 24, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close:hover {
  background: var(--bg);
  color: var(--text);
}

@media (max-width: 520px) {
  .modal {
    padding: 1.5rem 1.25rem;
  }
}
</style>
