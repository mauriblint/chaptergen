<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuth, type AccountPayment, type Pack } from '../composables/useAuth'
import { DEFAULT_PACKS } from '../billing/packs'
import type { Locale } from '../i18n/routing'
import { formatDate, formatMoney } from '../utils/format'

const { t, locale } = useI18n()
const router = useRouter()
const { user, fetchAccount, fetchPacks, ensureLoaded, startCheckout } = useAuth()

const loading = ref(true)
const error = ref<string | null>(null)
const payments = ref<AccountPayment[]>([])
const packs = ref<Pack[]>(DEFAULT_PACKS)
const pending = ref<Pack['id'] | null>(null)

useHead(computed(() => ({ title: t('app.billing.metaTitle'), htmlAttrs: { lang: locale.value } })))

onMounted(async () => {
  const me = await ensureLoaded()
  if (!me.user) {
    await router.replace('/login')
    return
  }
  try {
    const [account, list] = await Promise.all([fetchAccount(), fetchPacks().catch(() => DEFAULT_PACKS)])
    payments.value = account.payments
    packs.value = list
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('app.common.loadError')
  } finally {
    loading.value = false
  }
})

function perVideo(pack: Pack) {
  const value = (pack.amountCents / 100 / pack.credits).toFixed(2)
  return `$${locale.value === 'es' ? value.replace('.', ',') : value}`
}

async function buy(pack: Pack) {
  if (pending.value) return
  pending.value = pack.id
  error.value = null
  try {
    window.location.href = await startCheckout(pack.id, locale.value as Locale)
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('paywall.checkoutError')
    pending.value = null
  }
}
</script>

<template>
  <AppLayout :crumbs="[{ label: t('app.nav.billing') }]">
    <h1 class="page-title">{{ t('app.nav.billing') }}</h1>

    <div class="grid">
      <div class="balance">
        <span class="label">{{ t('app.billing.available') }}</span>
        <span class="amount">{{ user?.totalCredits ?? 0 }}</span>
        <span v-if="user && user.freeCredits > 0" class="note">
          {{ t('app.billing.includesFree', { n: user.freeCredits }, user.freeCredits) }}
        </span>
        <span class="note">{{ t('app.billing.rule') }}</span>
      </div>

      <div v-for="pack in packs" :key="pack.id" class="pack" :class="{ featured: pack.id === 'creator' }">
        <div class="pack-top">
          <span class="pack-name">{{ t(`pricing.packs.${pack.id}.name`) }}</span>
          <span v-if="pack.id === 'creator'" class="badge">{{ t('app.billing.bestValue') }}</span>
        </div>
        <span class="price">${{ (pack.amountCents / 100).toFixed(0) }}</span>
        <span class="pack-meta">{{ t('app.billing.packMeta', { n: pack.credits, price: perVideo(pack) }) }}</span>
        <button type="button" class="btn" :class="pack.id === 'creator' ? 'btn-light' : 'btn-ink'" :disabled="!!pending" @click="buy(pack)">
          {{ pending === pack.id ? t('paywall.redirecting') : t('app.billing.buy', { name: t(`pricing.packs.${pack.id}.name`) }) }}
        </button>
      </div>
    </div>

    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <section class="history">
      <h2 class="section-label">{{ t('app.billing.history') }}</h2>
      <div v-if="loading" class="skeleton" aria-hidden="true" />
      <p v-else-if="!payments.length" class="empty">{{ t('app.billing.noPayments') }}</p>
      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ t('app.billing.date') }}</th>
              <th scope="col">{{ t('app.billing.description') }}</th>
              <th scope="col">{{ t('app.billing.credits') }}</th>
              <th scope="col">{{ t('app.billing.amount') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id">
              <td>{{ formatDate(payment.createdAt, locale) }}</td>
              <td>
                {{ t(`pricing.packs.${payment.pack}.name`) }}
                <span v-if="payment.status === 'refunded'" class="refunded">· {{ t('app.billing.refunded') }}</span>
              </td>
              <td class="mono">+{{ payment.creditsGranted }}</td>
              <td>{{ formatMoney(payment.amountCents) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="secure">{{ t('paywall.ssl') }}</p>
    </section>
  </AppLayout>
</template>

<style scoped>
.page-title {
  margin-bottom: 1.5rem;
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.grid {
  display: grid;
  grid-template-columns: 300px repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.balance,
.pack {
  padding: 22px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.balance {
  background: var(--bg);
}

.label,
.note {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.amount {
  font-family: var(--font-display);
  font-size: 3.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}

.pack {
  border: 1px solid var(--border);
}

.pack.featured {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--on-ink);
}

.pack-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pack-name {
  font-weight: 600;
}

.badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--accent-on-ink);
  color: var(--ink);
  font-size: 0.7rem;
  font-weight: 700;
}

.price {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.pack-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.featured .pack-meta {
  color: var(--on-ink-muted);
}

.pack .btn {
  margin-top: auto;
  min-height: 44px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  color: #b42318;
}

.history {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  font-size: 1rem;
  font-weight: 600;
}

.table-wrap {
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.table th {
  height: 38px;
  padding: 0 16px;
  background: #fbfbfc;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

.table td {
  height: 50px;
  padding: 0 16px;
  border-top: 1px solid var(--border);
  white-space: nowrap;
}

.refunded {
  color: #b42318;
}

.empty,
.secure {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.skeleton {
  height: 120px;
  border-radius: 14px;
  background: var(--bg);
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
