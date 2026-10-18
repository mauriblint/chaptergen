<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth, type VerifyCodeResult } from '../../composables/useAuth'
import type { Locale } from '../../i18n/routing'

const props = withDefaults(
  defineProps<{
    /** 'gate' explains the free videos; 'login' is a plain sign-in. */
    variant?: 'gate' | 'login'
  }>(),
  { variant: 'gate' }
)

const emit = defineEmits<{ verified: [result: VerifyCodeResult] }>()

const { t, te, locale } = useI18n()
const { requestCode, verifyCode } = useAuth()

const step = ref<'email' | 'code'>('email')
const email = ref('')
const digits = ref<string[]>(['', '', '', '', '', ''])
const inputs = ref<HTMLInputElement[]>([])
const error = ref<string | null>(null)
const busy = ref(false)
const resendIn = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const code = computed(() => digits.value.join(''))

function errorMessage(err: unknown, fallback: string): string {
  const codeName = (err as { code?: string }).code
  if (codeName && te(`app.gate.errors.${codeName}`)) {
    return t(`app.gate.errors.${codeName}`)
  }
  return err instanceof Error ? err.message : fallback
}

function startResendTimer() {
  resendIn.value = 60
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    resendIn.value -= 1
    if (resendIn.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

async function sendCode() {
  if (busy.value) return
  error.value = null
  busy.value = true
  try {
    await requestCode(email.value.trim(), locale.value as Locale)
    step.value = 'code'
    digits.value = ['', '', '', '', '', '']
    startResendTimer()
    await nextTick()
    inputs.value[0]?.focus()
  } catch (err) {
    error.value = errorMessage(err, t('app.gate.errors.generic'))
  } finally {
    busy.value = false
  }
}

async function confirm() {
  if (busy.value || code.value.length !== 6) return
  error.value = null
  busy.value = true
  try {
    const result = await verifyCode(email.value.trim(), code.value, locale.value as Locale)
    emit('verified', result)
  } catch (err) {
    error.value = errorMessage(err, t('app.gate.errors.generic'))
    digits.value = ['', '', '', '', '', '']
    await nextTick()
    inputs.value[0]?.focus()
  } finally {
    busy.value = false
  }
}

function onDigit(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')
  if (value.length > 1) {
    // Pasted or autofilled the whole code.
    value
      .slice(0, 6)
      .split('')
      .forEach((d, i) => (digits.value[i] = d))
    inputs.value[Math.min(value.length, 6) - 1]?.focus()
  } else {
    digits.value[index] = value
    if (value && index < 5) inputs.value[index + 1]?.focus()
  }
  if (code.value.length === 6) void confirm()
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputs.value[index - 1]?.focus()
  }
}

function changeEmail() {
  step.value = 'email'
  error.value = null
}
</script>

<template>
  <form v-if="step === 'email'" class="form" @submit.prevent="sendCode">
    <div class="head">
      <h2 class="title">{{ variant === 'gate' ? t('app.gate.emailTitle') : t('app.login.title') }}</h2>
      <p class="lead">{{ variant === 'gate' ? t('app.gate.emailLead') : t('app.login.lead') }}</p>
    </div>
    <label class="field">
      <span class="label">{{ t('app.gate.emailLabel') }}</span>
      <input
        v-model="email"
        type="email"
        autocomplete="email"
        required
        :placeholder="t('app.gate.emailPlaceholder')"
        class="input"
      />
    </label>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <button type="submit" class="btn btn-ink btn-block" :disabled="busy">
      {{ busy ? t('app.gate.sending') : t('app.gate.sendCode') }}
    </button>
    <p class="fine">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3" /></svg>
      {{ t('app.gate.noPassword') }}
    </p>
  </form>

  <form v-else class="form" @submit.prevent="confirm">
    <div class="head">
      <span class="mail-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg>
      </span>
      <h2 class="title">{{ t('app.gate.codeTitle') }}</h2>
      <p class="lead">
        <i18n-t keypath="app.gate.codeLead" tag="span">
          <template #email><strong>{{ email }}</strong></template>
        </i18n-t>
      </p>
    </div>
    <div class="digits" role="group" :aria-label="t('app.gate.codeLabel')">
      <input
        v-for="(d, i) in digits"
        :key="i"
        :ref="(el) => { if (el) inputs[i] = el as HTMLInputElement }"
        :value="d"
        class="digit mono"
        :class="{ filled: !!d }"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="6"
        :aria-label="t('app.gate.digit', { n: i + 1 })"
        @input="onDigit(i, $event)"
        @keydown="onKeydown(i, $event)"
      />
    </div>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <button type="submit" class="btn btn-ink btn-block" :disabled="busy || code.length !== 6">
      {{ busy ? t('app.gate.verifying') : props.variant === 'gate' ? t('app.gate.confirm') : t('app.login.confirm') }}
    </button>
    <div class="row">
      <button type="button" class="link" @click="changeEmail">{{ t('app.gate.changeEmail') }}</button>
      <span v-if="resendIn > 0" class="muted">{{ t('app.gate.resendIn', { s: resendIn }) }}</span>
      <button v-else type="button" class="link" :disabled="busy" @click="sendCode">{{ t('app.gate.resend') }}</button>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.head {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title {
  font-family: var(--font-display);
  font-size: 1.65rem;
  line-height: 1.12;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.lead {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--text-muted);
}

.lead strong {
  color: var(--text);
}

.mail-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--accent-soft);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
}

.input {
  height: 50px;
  padding: 0 14px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font: inherit;
  font-size: 1rem;
  color: var(--text);
  background: var(--surface);
}

.input:focus {
  outline: none;
  border-color: var(--text);
}

.digits {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.5rem;
}

.digit {
  height: 58px;
  min-width: 0;
  text-align: center;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
  background: var(--surface);
}

.digit.filled,
.digit:focus {
  outline: none;
  border-color: var(--text);
}

.btn-block {
  width: 100%;
  min-height: 52px;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  font-size: 0.875rem;
  color: #b42318;
}

.fine {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.link {
  border: 0;
  background: none;
  padding: 0;
  min-height: 32px;
  font: inherit;
  font-weight: 600;
  color: var(--accent);
  cursor: pointer;
}

.link:disabled {
  opacity: 0.5;
}

.muted {
  color: var(--text-muted);
}
</style>
