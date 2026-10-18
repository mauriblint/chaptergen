<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth, type Pack } from '../composables/useAuth'
import type { Locale } from '../i18n/routing'
import { DEFAULT_PACKS } from '../billing/packs'
import { trackUpgrade } from '../utils/analytics'
import Logo from './ui/Logo.vue'
import type { PaywallReason } from '../utils/api'

const emit = defineEmits<{ close: [] }>()

const props = withDefaults(
  defineProps<{
    reason?: PaywallReason
  }>(),
  { reason: 'buy' }
)

const { t, locale } = useI18n()
const { startCheckout, fetchPacks, isLoggedIn, ensureLoaded } = useAuth()
const packs = ref<Pack[]>(DEFAULT_PACKS)
const error = ref<string | null>(null)
const pendingPack = ref<Pack['id'] | null>(null)
const selectedId = ref<Pack['id']>('creator')

const selected = computed(
  () => packs.value.find((pack) => pack.id === selectedId.value) ?? packs.value[0]
)

const savingsPercent = computed(() => {
  const starter = packs.value.find((pack) => pack.id === 'starter')
  const creator = packs.value.find((pack) => pack.id === 'creator')
  if (!starter || !creator) return 0
  const base = starter.amountCents / starter.credits
  const current = creator.amountCents / creator.credits
  if (base <= 0 || current >= base) return 0
  return Math.round((1 - current / base) * 100)
})

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  await ensureLoaded()
  trackUpgrade(isLoggedIn.value, props.reason)
  try {
    packs.value = await fetchPacks()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('paywall.loadError')
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

function formatPerCredit(pack: Pack) {
  const value = pack.amountCents / 100 / pack.credits
  const amount = value.toFixed(2)
  const shown = locale.value === 'es' ? amount.replace('.', ',') : amount
  return `$${shown}`
}

async function buy() {
  const pack = selected.value
  if (!pack || pendingPack.value) return
  pendingPack.value = pack.id
  error.value = null
  try {
    const url = await startCheckout(pack.id, locale.value as Locale)
    window.location.href = url
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('paywall.checkoutError')
    pendingPack.value = null
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click.self="emit('close')">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="t('paywall.title')">
        <aside class="intro">
          <Logo :size="28" inverted class="brand" />
          <p v-if="props.reason !== 'buy'" class="reason-tag">
            {{ t(`paywall.reasonLabel.${props.reason}`) }}
          </p>
          <h2>{{ t('paywall.title') }}</h2>
          <ul class="bullets">
            <li>{{ t('paywall.bulletChapters') }}</li>
            <li>{{ t('paywall.bulletTranscript') }}</li>
            <li>{{ t('paywall.bulletSubtitles') }}</li>
            <li>{{ t('paywall.bulletExpire') }}</li>
            <li>{{ t('paywall.bulletSize') }}</li>
          </ul>
          <p class="one-time">{{ t('paywall.oneTime') }}</p>
        </aside>

        <div class="panel">
          <div class="panel-head">
            <p class="choose">{{ t('paywall.choose') }}</p>
            <button class="close" type="button" :aria-label="t('paywall.close')" @click="emit('close')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          <div class="packs" role="radiogroup" :aria-label="t('paywall.choose')">
            <button
              v-for="pack in packs"
              :key="pack.id"
              type="button"
              role="radio"
              class="pack"
              :class="{ selected: pack.id === selectedId }"
              :aria-checked="pack.id === selectedId"
              :disabled="pendingPack !== null"
              @click="selectedId = pack.id"
            >
              <span class="radio" aria-hidden="true" />
              <span class="pack-copy">
                <span class="pack-title">
                  {{ t('paywall.creditsLabel', { count: pack.credits }) }}
                  <span v-if="pack.id === 'creator' && savingsPercent > 0" class="save">
                    {{ t('paywall.savePercent', { percent: savingsPercent }) }}
                  </span>
                </span>
                <span class="pack-meta">
                  {{ t(`pricing.packs.${pack.id}.name`) }} ·
                  {{ t('paywall.perCredit', { price: formatPerCredit(pack) }) }}
                </span>
              </span>
              <span class="pack-price">{{ formatPrice(pack.amountCents) }}</span>
            </button>
          </div>

          <button
            class="continue"
            type="button"
            :disabled="!selected || pendingPack !== null"
            @click="buy"
          >
            {{
              pendingPack
                ? t('paywall.redirecting')
                : t('paywall.continue', { price: formatPrice(selected.amountCents) })
            }}
          </button>
          <p v-if="selected" class="summary">
            {{
              t('paywall.summary', {
                count: selected.credits,
                price: formatPerCredit(selected),
              })
            }}
          </p>
          <p v-if="error" class="error">{{ error }}</p>

          <p class="ssl">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3" /></svg>
            {{ t('paywall.ssl') }}
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 110;
  background: rgba(17, 19, 24, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  width: 100%;
  max-width: 820px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  border-radius: 22px;
  background: var(--surface);
  box-shadow: 0 30px 80px rgba(17, 19, 24, 0.3);
}

.intro {
  padding: 2rem;
  background: var(--ink);
  color: var(--on-ink);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.brand {
  margin-bottom: 0.5rem;
}

.brand :deep(.logo-text) {
  font-size: 1.2rem;
}

.reason-tag {
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(169, 156, 249, 0.18);
  color: var(--accent-on-ink);
  font-size: 0.75rem;
  font-weight: 700;
}

.intro h2 {
  font-family: var(--font-display);
  font-size: 1.75rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.875rem;
}

.bullets li {
  position: relative;
  padding-left: 1.5rem;
}

.bullets li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.3em;
  width: 12px;
  height: 7px;
  border-left: 2px solid var(--accent-on-ink);
  border-bottom: 2px solid var(--accent-on-ink);
  transform: rotate(-45deg);
}

.one-time {
  margin-top: auto;
  font-size: 0.75rem;
  color: var(--on-ink-muted);
}

.panel {
  padding: 1.75rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.choose {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.close {
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

.packs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pack {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1.5px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  font: inherit;
  text-align: left;
  color: var(--text);
  cursor: pointer;
}

.pack:hover {
  border-color: #c9cad2;
}

.pack.selected {
  border-color: var(--ink);
  box-shadow: 0 0 0 1px var(--ink);
}

.radio {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border: 2px solid #c9cad2;
  border-radius: 50%;
}

.pack.selected .radio {
  border: 5px solid var(--ink);
}

.pack-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pack-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.save {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.7rem;
  font-weight: 700;
}

.pack-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.pack-price {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.continue {
  min-height: 52px;
  border: 0;
  border-radius: 12px;
  background: var(--ink);
  color: #fff;
  font: inherit;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.continue:hover {
  background: #2a2e36;
}

.continue:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.summary {
  font-size: 0.8rem;
  text-align: center;
  color: var(--text-muted);
}

.error {
  font-size: 0.85rem;
  color: #b42318;
}

.ssl {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-soft);
  font-size: 0.75rem;
  color: var(--text-muted);
}

@media (max-width: 720px) {
  .modal {
    grid-template-columns: minmax(0, 1fr);
  }

  .intro {
    padding: 1.5rem;
  }

  .bullets,
  .one-time {
    display: none;
  }

  .panel {
    padding: 1.25rem 1.25rem 1.5rem;
  }
}
</style>
