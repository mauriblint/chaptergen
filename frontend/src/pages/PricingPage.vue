<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import { useAuth, type Pack } from '../composables/useAuth'
import { DEFAULT_PACKS } from '../billing/packs'
import { SITE_URL } from '../content/home'
import { hreflangLinks } from '../utils/schema'
import { localizedPath, type Locale } from '../i18n/routing'

const { t, locale } = useI18n()
const { startCheckout, fetchPacks } = useAuth()
const packs = ref<Pack[]>(DEFAULT_PACKS)
const error = ref<string | null>(null)
const pendingPack = ref<Pack['id'] | null>(null)

const canonical = computed(() => `${SITE_URL}${localizedPath('/pricing', locale.value as Locale)}`)

useHead(
  computed(() => ({
    title: t('pricing.meta.title'),
    htmlAttrs: { lang: locale.value },
    meta: [{ name: 'description', content: t('pricing.meta.description') }],
    link: [
      { rel: 'canonical', href: canonical.value },
      ...hreflangLinks('/pricing', '/es/precios', SITE_URL),
    ],
  }))
)

onMounted(async () => {
  try {
    packs.value = await fetchPacks()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('pricing.loadError')
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
    error.value = err instanceof Error ? err.message : t('pricing.checkoutError')
    pendingPack.value = null
  }
}
</script>

<template>
  <MarketingLayout>
    <div class="wrap">
      <h1>{{ t('pricing.title') }}</h1>
      <p class="lead">{{ t('pricing.subtitle') }}</p>

      <div class="grid">
        <Card class="free">
          <p class="name">{{ t('pricing.free.name') }}</p>
          <p class="price">$0</p>
          <ul>
            <li>{{ t('pricing.free.jobs') }}</li>
            <li>{{ t('pricing.free.minutes') }}</li>
            <li>{{ t('pricing.free.signup') }}</li>
          </ul>
        </Card>

        <Card
          v-for="pack in packs"
          :key="pack.id"
          class="paid"
          :class="{ featured: pack.id === 'creator' }"
          shadow="lg"
        >
          <p class="name">{{ t(`pricing.packs.${pack.id}.name`) }}</p>
          <p class="price">{{ formatPrice(pack.amountCents) }}</p>
          <p class="blurb">{{ t(`pricing.packs.${pack.id}.blurb`) }}</p>
          <ul>
            <li>{{ t('pricing.credits', { count: pack.credits }) }}</li>
            <li>{{ t('pricing.minuteRule') }}</li>
            <li>{{ t('pricing.refineIncluded') }}</li>
          </ul>
          <Button
            type="button"
            :disabled="pendingPack !== null"
            @click="buy(pack.id)"
          >
            {{ pendingPack === pack.id ? t('paywall.redirecting') : t('pricing.buy') }}
          </Button>
        </Card>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </MarketingLayout>
</template>

<style scoped>
.wrap {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.lead {
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 36rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.paid.featured {
  border-color: var(--accent);
}

.name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.blurb {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

ul {
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.error {
  color: #dc2626;
  margin-top: 1rem;
}

@media (max-width: 800px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
