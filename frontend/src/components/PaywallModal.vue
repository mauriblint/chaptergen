<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth, type Pack } from '../composables/useAuth'
import type { Locale } from '../i18n/routing'
import { DEFAULT_PACKS } from '../billing/packs'

const emit = defineEmits<{ close: [] }>()

const { t, locale } = useI18n()
const { startCheckout, fetchPacks, me } = useAuth()
const packs = ref<Pack[]>(DEFAULT_PACKS)
const error = ref<string | null>(null)
const pendingPack = ref<Pack['id'] | null>(null)

onMounted(async () => {
  try {
    packs.value = await fetchPacks()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('paywall.loadError')
  }
})

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

async function buy(pack: Pack['id']) {
  pendingPack.value = pack
  error.value = null
  try {
    const url = await startCheckout(pack, locale.value as Locale)
    window.location.href = url
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('paywall.checkoutError')
    pendingPack.value = null
  }
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="modal" role="dialog" aria-modal="true" :aria-label="t('paywall.title')">
      <button class="close" type="button" :aria-label="t('paywall.close')" @click="emit('close')">
        ×
      </button>
      <h2>{{ t('paywall.title') }}</h2>
      <p class="lead">
        {{
          t('paywall.subtitle', {
            used: me?.freeUsed ?? 0,
            limit: me?.freeLimit ?? 2,
          })
        }}
      </p>

      <div class="packs">
        <button
          v-for="pack in packs"
          :key="pack.id"
          type="button"
          class="pack"
          :class="{ featured: pack.id === 'creator' }"
          :disabled="pendingPack !== null"
          @click="buy(pack.id)"
        >
          <span class="pack-name">{{ t(`pricing.packs.${pack.id}.name`) }}</span>
          <span class="pack-price">{{ formatPrice(pack.amountCents) }}</span>
          <span class="pack-credits">{{ t('pricing.credits', { count: pack.credits }) }}</span>
          <span class="pack-cta">{{
            pendingPack === pack.id ? t('paywall.redirecting') : t('paywall.buy')
          }}</span>
        </button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p class="hint">{{ t('paywall.hint') }}</p>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 80;
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
  max-width: 560px;
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

.packs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.pack {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: left;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  background: var(--bg);
  cursor: pointer;
}

.pack.featured {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}

.pack-name {
  font-weight: 600;
}

.pack-price {
  font-size: 1.5rem;
  font-weight: 700;
}

.pack-credits {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.pack-cta {
  margin-top: 0.6rem;
  color: var(--accent);
  font-weight: 600;
  font-size: 0.9rem;
}

.error {
  color: #dc2626;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.hint {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

@media (max-width: 560px) {
  .packs {
    grid-template-columns: 1fr;
  }
}
</style>
