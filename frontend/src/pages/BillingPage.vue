<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import PaywallModal from '../components/PaywallModal.vue'
import { useAuth, type AccountPayment } from '../composables/useAuth'
import { formatDate, formatMoney } from '../utils/format'

const { t, locale } = useI18n()
const { user, fetchAccount, ensureLoaded } = useAuth()

const loading = ref(true)
const error = ref<string | null>(null)
const payments = ref<AccountPayment[]>([])
const showPaywall = ref(false)

useHead(
  computed(() => ({
    title: t('billing.metaTitle'),
    htmlAttrs: { lang: locale.value },
  }))
)

onMounted(async () => {
  try {
    await ensureLoaded()
    const account = await fetchAccount()
    payments.value = account.payments
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.loadError')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <MarketingLayout>
    <div class="wrap">
      <div v-if="loading" class="muted">{{ t('dashboard.loading') }}</div>

      <template v-else-if="user">
        <header class="hero">
          <div>
            <h1>{{ t('billing.title') }}</h1>
            <p class="lead">{{ t('billing.subtitle') }}</p>
          </div>
          <Button type="button" @click="showPaywall = true">{{ t('dashboard.buyMore') }}</Button>
        </header>

        <p v-if="error" class="error">{{ error }}</p>

        <Card shadow="lg">
          <p class="credits-line">
            {{ t('dashboard.credits') }}: <strong>{{ user.credits }}</strong>
          </p>
        </Card>

        <section>
          <h2>{{ t('billing.payments') }}</h2>
          <p v-if="!payments.length" class="muted">{{ t('billing.noPayments') }}</p>
          <ul v-else class="list">
            <li v-for="payment in payments" :key="payment.id">
              <span>{{ t(`pricing.packs.${payment.pack}.name`) }}</span>
              <span>{{ formatMoney(payment.amountCents) }}</span>
              <span>{{ t('pricing.credits', { count: payment.creditsGranted }) }}</span>
              <span class="muted">{{ formatDate(payment.createdAt, locale) }} · {{ payment.status }}</span>
            </li>
          </ul>
        </section>
      </template>
    </div>

    <PaywallModal v-if="showPaywall" @close="showPaywall = false" />
  </MarketingLayout>
</template>

<style scoped>
.wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

h1 {
  font-size: 1.8rem;
}

.lead {
  color: var(--text-muted);
  margin-top: 0.25rem;
}

h2 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.credits-line {
  font-size: 1rem;
}

.list {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.list li {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 1fr 1.2fr;
  gap: 0.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.9rem;
}

.muted {
  color: var(--text-muted);
}

.error {
  color: #dc2626;
}

@media (max-width: 700px) {
  .hero {
    flex-direction: column;
  }

  .list li {
    grid-template-columns: 1fr;
  }
}
</style>
