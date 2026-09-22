<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth, type Pack } from '../composables/useAuth'
import type { Locale } from '../i18n/routing'
import { DEFAULT_PACKS } from '../billing/packs'
import { trackUpgrade } from '../utils/analytics'
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
          <p class="brand">
            <span class="brand-mark" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="18" width="4" height="14" rx="1" fill="white" opacity="0.7" />
                <rect x="16" y="12" width="4" height="20" rx="1" fill="white" />
                <rect x="24" y="8" width="4" height="24" rx="1" fill="white" />
              </svg>
            </span>
            ChapterGen
          </p>
          <p v-if="props.reason !== 'buy'" class="reason-tag">
            {{ t(`paywall.reasonLabel.${props.reason}`) }}
          </p>
          <h2>{{ t('paywall.title') }}</h2>
          <p class="lead">{{ t(`paywall.reason.${props.reason}`) }}</p>
          <ul class="bullets">
            <li>{{ t('paywall.bulletExpire') }}</li>
            <li>{{ t('paywall.bulletSize') }}</li>
            <li>{{ t('paywall.bulletPrivate') }}</li>
          </ul>
          <p class="one-time">{{ t('paywall.oneTime') }}</p>
        </aside>

        <div class="panel">
          <div class="panel-head">
            <p class="choose">{{ t('paywall.choose') }}</p>
            <button class="close" type="button" :aria-label="t('paywall.close')" @click="emit('close')">
              ×
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
            <span aria-hidden="true">✓</span>
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
  background: rgba(15, 23, 42, 0.55);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  width: min(820px, 100%);
  background: var(--surface);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
}

.intro {
  background: #0f172a;
  color: #e2e8f0;
  padding: 1.75rem 1.5rem 1.4rem;
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.35rem;
}

.reason-tag {
  align-self: flex-start;
  margin-bottom: 0.7rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(129, 140, 248, 0.18);
  color: #c7d2fe;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.brand-mark {
  display: flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
}

.intro h2 {
  font-size: 1.7rem;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: white;
  margin-bottom: 0.7rem;
}

.lead {
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.45;
  margin-bottom: 1.25rem;
}

.bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  font-size: 0.9rem;
  line-height: 1.4;
}

.bullets li {
  padding-left: 1.35rem;
  position: relative;
}

.bullets li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #818cf8;
  font-weight: 700;
}

.one-time {
  margin-top: auto;
  padding-top: 1.5rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.panel {
  padding: 1.35rem 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.choose {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.close {
  border: none;
  background: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
  line-height: 1;
}

.packs {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.pack {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 0.85rem 1rem;
  background: white;
  cursor: pointer;
}

.pack.selected {
  border-color: var(--accent);
  background: #eef2ff;
  box-shadow: 0 0 0 1px var(--accent);
}

.radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  box-sizing: border-box;
}

.pack.selected .radio {
  border: 5px solid var(--accent);
}

.pack-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-weight: 700;
  color: var(--text);
}

.save {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--accent);
}

.pack-meta {
  display: block;
  margin-top: 0.15rem;
  color: var(--text-muted);
  font-size: 0.82rem;
}

.pack-price {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--text);
}

.continue {
  margin-top: 1rem;
  width: 100%;
  border: none;
  border-radius: 12px;
  background: var(--accent);
  color: white;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 0.9rem 1rem;
  cursor: pointer;
}

.continue:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.summary {
  margin-top: 0.65rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.error {
  color: #dc2626;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  text-align: center;
}

.ssl {
  margin-top: 1.1rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: #059669;
  font-size: 0.8rem;
  font-weight: 600;
}

@media (max-width: 720px) {
  .modal {
    grid-template-columns: 1fr;
    max-height: min(92vh, 820px);
    overflow: auto;
  }

  .intro {
    padding-bottom: 1.2rem;
  }

  .one-time {
    padding-top: 1rem;
  }
}
</style>
