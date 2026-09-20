<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import PaywallModal from '../components/PaywallModal.vue'
import {
  useAuth,
  type AccountJob,
  type AccountPayment,
} from '../composables/useAuth'
import { LOCALE_STORAGE_KEY, type Locale } from '../i18n/routing'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const {
  claimCheckout,
  fetchAccount,
  logout,
  updateLocale,
  user,
  ensureLoaded,
} = useAuth()

const loading = ref(true)
const error = ref<string | null>(null)
const payments = ref<AccountPayment[]>([])
const jobs = ref<AccountJob[]>([])
const showPaywall = ref(false)
const switching = ref(false)

useHead(
  computed(() => ({
    title: t('dashboard.metaTitle'),
    htmlAttrs: { lang: locale.value },
  }))
)

function applyLocale(next: Locale) {
  locale.value = next
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
  } catch {
    // ignore
  }
}

onMounted(async () => {
  try {
    const sessionId =
      typeof route.query.session_id === 'string' ? route.query.session_id : ''
    if (sessionId) {
      const claimed = await claimCheckout(sessionId)
      applyLocale(claimed.locale)
      await router.replace({ path: '/dashboard' })
    }

    const me = await ensureLoaded()
    if (!me.user) {
      await router.replace('/login')
      return
    }
    applyLocale(me.user.locale)

    const account = await fetchAccount()
    payments.value = account.payments
    jobs.value = account.jobs
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.loadError')
    const me = await ensureLoaded().catch(() => null)
    if (!me?.user) {
      await router.replace('/login')
      return
    }
  } finally {
    loading.value = false
  }
})

async function onToggleLocale(next: Locale) {
  if (next === locale.value || switching.value) return
  switching.value = true
  try {
    await updateLocale(next)
    applyLocale(next)
  } finally {
    switching.value = false
  }
}

async function onLogout() {
  await logout()
  await router.push('/')
}

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const otherLocale = computed<Locale>(() => (locale.value === 'es' ? 'en' : 'es'))
</script>

<template>
  <MarketingLayout>
    <div class="wrap">
      <div v-if="loading" class="muted">{{ t('dashboard.loading') }}</div>

      <template v-else-if="user">
        <header class="hero">
          <div>
            <h1>{{ t('dashboard.title') }}</h1>
            <p class="email">{{ user.email }}</p>
          </div>
          <div class="hero-actions">
            <button type="button" class="lang" :disabled="switching" @click="onToggleLocale(otherLocale)">
              {{ t(`common.language.${otherLocale}`) }}
            </button>
            <button type="button" class="ghost" @click="onLogout">{{ t('dashboard.logout') }}</button>
          </div>
        </header>

        <p v-if="error" class="error">{{ error }}</p>

        <section class="credits-row">
          <Card shadow="lg" class="credits-card">
            <p class="label">{{ t('dashboard.credits') }}</p>
            <p class="credits">{{ user.credits }}</p>
            <Button type="button" @click="showPaywall = true">{{ t('dashboard.buyMore') }}</Button>
          </Card>
        </section>

        <section>
          <h2>{{ t('dashboard.payments') }}</h2>
          <p v-if="!payments.length" class="muted">{{ t('dashboard.noPayments') }}</p>
          <ul v-else class="list">
            <li v-for="payment in payments" :key="payment.id">
              <span>{{ t(`pricing.packs.${payment.pack}.name`) }}</span>
              <span>{{ formatMoney(payment.amountCents) }}</span>
              <span>{{ t('pricing.credits', { count: payment.creditsGranted }) }}</span>
              <span class="muted">{{ formatDate(payment.createdAt) }} · {{ payment.status }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h2>{{ t('dashboard.jobs') }}</h2>
          <p v-if="!jobs.length" class="muted">{{ t('dashboard.noJobs') }}</p>
          <ul v-else class="list">
            <li v-for="job in jobs" :key="job.id">
              <RouterLink :to="{ name: 'job', params: { id: job.id } }">{{ job.fileName }}</RouterLink>
              <span>{{ job.status }}</span>
              <span class="muted">{{ formatDate(job.createdAt) }}</span>
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

h2 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.email {
  color: var(--text-muted);
}

.hero-actions {
  display: flex;
  gap: 0.5rem;
}

.lang,
.ghost {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
}

.credits-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 280px;
}

.label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.credits {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
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
  .list li {
    grid-template-columns: 1fr;
  }
}
</style>
