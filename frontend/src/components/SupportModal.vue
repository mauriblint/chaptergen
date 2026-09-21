<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from './ui/Button.vue'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()
const { user, sendSupport } = useAuth()

const subject = ref('')
const message = ref('')
const error = ref<string | null>(null)
const sent = ref(false)
const loading = ref(false)

async function onSubmit() {
  if (!subject.value.trim() || !message.value.trim() || loading.value) return
  loading.value = true
  error.value = null
  try {
    await sendSupport(subject.value.trim(), message.value.trim())
    sent.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('support.sendError')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="modal" role="dialog" aria-modal="true" :aria-label="t('support.title')">
      <button class="close" type="button" :aria-label="t('support.close')" @click="emit('close')">
        ×
      </button>
      <h2>{{ t('support.title') }}</h2>
      <p class="lead">{{ t('support.subtitle') }}</p>

      <p v-if="sent" class="ok">{{ t('support.sent') }}</p>

      <form v-else class="form" @submit.prevent="onSubmit">
        <label for="support-email">{{ t('support.email') }}</label>
        <input id="support-email" type="email" :value="user?.email ?? ''" readonly />

        <label for="support-subject">{{ t('support.subject') }}</label>
        <input
          id="support-subject"
          v-model="subject"
          type="text"
          required
          maxlength="200"
          :placeholder="t('support.subjectPlaceholder')"
        />

        <label for="support-message">{{ t('support.message') }}</label>
        <textarea
          id="support-message"
          v-model="message"
          required
          maxlength="5000"
          rows="6"
          :placeholder="t('support.messagePlaceholder')"
        />

        <Button type="submit" :disabled="loading || !subject.trim() || !message.trim()">
          {{ loading ? t('support.sending') : t('support.submit') }}
        </Button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal {
  position: relative;
  background: var(--surface);
  border-radius: var(--radius);
  padding: 2rem 1.75rem 1.5rem;
  max-width: 480px;
  width: 100%;
  box-shadow: var(--shadow-lg);
}

.close {
  position: absolute;
  top: 0.75rem;
  right: 0.9rem;
  border: none;
  background: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
  line-height: 1;
}

h2 {
  font-size: 1.35rem;
  margin-bottom: 0.4rem;
}

.lead {
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

label {
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

input,
textarea {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.65rem 0.8rem;
  font: inherit;
  font-size: 0.95rem;
  margin-bottom: 0.35rem;
}

input[readonly] {
  background: var(--bg);
  color: var(--text-muted);
}

textarea {
  resize: vertical;
  min-height: 8rem;
}

.ok {
  color: var(--text);
}

.error {
  color: #dc2626;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}
</style>
