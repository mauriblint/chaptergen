<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import AppLayout from '../layouts/AppLayout.vue'
import PaywallModal from '../components/PaywallModal.vue'
import { useAuth, type AccountPayment } from '../composables/useAuth'
import { formatDate, formatMoney } from '../utils/format'

const { t, locale } = useI18n()
const router = useRouter()
const { fetchAccount, ensureLoaded } = useAuth()

const loading = ref(true)
const error = ref<string | null>(null)
const payments = ref<AccountPayment[]>([])
const showPaywall = ref(false)

useHead(computed(() => ({ title: t('app.billing.metaTitle'), htmlAttrs: { lang: locale.value } })))

onMounted(async () => {
  const me = await ensureLoaded()
  if (!me.user) {
    await router.replace('/login')
    return
  }
  try {
    payments.value = (await fetchAccount()).payments
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('app.common.loadError')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppLayout>
    <div class="head">
      <h1 class="page-title">{{ t('app.nav.billing') }}</h1>
      <button type="button" class="btn btn-ink" @click="showPaywall = true">{{ t('app.nav.buyCredits') }}</button>
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

    <PaywallModal v-if="showPaywall" reason="buy" @close="showPaywall = false" />
  </AppLayout>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 1.5rem;
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.error {
  margin-bottom: 1rem;
  color: #b42318;
}

.history {
  max-width: 900px;
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

.empty {
  padding: 2.5rem 1rem;
  border: 1px dashed var(--border);
  border-radius: 14px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.secure {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.skeleton {
  height: 120px;
  border-radius: 14px;
  background: var(--bg);
}
</style>
