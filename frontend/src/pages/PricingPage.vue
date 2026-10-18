<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import FAQ from '../components/marketing/FAQ.vue'
import { useAuth, type Pack } from '../composables/useAuth'
import { DEFAULT_PACKS } from '../billing/packs'
import { SITE_URL, SUPPORT_EMAIL, type FAQItem } from '../content/home'
import { faqSchema, hreflangLinks } from '../utils/schema'
import { localizedPath, type Locale } from '../i18n/routing'

const { t, tm, locale } = useI18n()
const { startCheckout, fetchPacks, user } = useAuth()
const packs = ref<Pack[]>(DEFAULT_PACKS)
const error = ref<string | null>(null)
const pendingPack = ref<Pack['id'] | null>(null)

const canonical = computed(() => `${SITE_URL}${localizedPath('/pricing', locale.value as Locale)}`)
const startHref = computed(() => (user.value ? '/new' : `${localizedPath('/', locale.value as Locale)}#start`))
const faqs = computed(() => tm('pricing.faq.items') as FAQItem[])
const included = ['chapters', 'transcript', 'subtitles'] as const

const starterRate = computed(() => {
  const starter = packs.value.find((p) => p.id === 'starter')
  return starter ? starter.amountCents / starter.credits : null
})

/** Percent cheaper per video than Starter; 0 for Starter itself. */
function savings(pack: Pack): number {
  if (!starterRate.value) return 0
  const rate = pack.amountCents / pack.credits
  return rate < starterRate.value ? Math.round((1 - rate / starterRate.value) * 100) : 0
}

const paidFeatures = computed(() => (tm('pricing.paidFeatures') as string[]).length)

useHead(
  computed(() => ({
    title: t('pricing.meta.title'),
    htmlAttrs: { lang: locale.value },
    meta: [{ name: 'description', content: t('pricing.meta.description') }],
    link: [
      { rel: 'canonical', href: canonical.value },
      ...hreflangLinks('/pricing', '/es/precios', SITE_URL),
    ],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(faqSchema(faqs.value)) }],
  }))
)

onMounted(async () => {
  try {
    packs.value = await fetchPacks()
  } catch {
    // Defaults already match the server packs.
  }
})

function price(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

function perVideo(pack: Pack) {
  const value = (pack.amountCents / 100 / pack.credits).toFixed(2)
  return `$${locale.value === 'es' ? value.replace('.', ',') : value}`
}

async function buy(pack: Pack['id']) {
  pendingPack.value = pack
  error.value = null
  try {
    window.location.href = await startCheckout(pack, locale.value as Locale)
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('pricing.checkoutError')
    pendingPack.value = null
  }
}
</script>

<template>
  <MarketingLayout>
    <section class="pricing">
      <header class="head">
        <span class="eyebrow">{{ t('pricing.eyebrow') }}</span>
        <h1 class="display-title title">{{ t('pricing.title') }}</h1>
        <p class="lead">{{ t('pricing.subtitle') }}</p>
      </header>

      <div class="trial">
        <div class="trial-copy">
          <strong>{{ t('pricing.trial.title') }}</strong>
          <span>{{ t('pricing.trial.details') }}</span>
        </div>
        <a :href="startHref" class="btn btn-outline">{{ t('pricing.trial.cta') }}</a>
      </div>

      <div class="plans">
        <article v-for="pack in packs" :key="pack.id" class="plan" :class="{ featured: pack.id === 'creator' }">
          <div class="plan-top">
            <h2 class="plan-name">{{ t(`pricing.packs.${pack.id}.name`) }}</h2>
            <span v-if="pack.id === 'creator'" class="badge">{{ t('pricing.mostPopular') }}</span>
            <span v-else-if="pack.id === 'studio'" class="badge badge-soft">{{ t('pricing.bestValue') }}</span>
          </div>
          <p class="plan-price">
            <span class="amount">{{ price(pack.amountCents) }}</span>
            <span class="once">{{ t('pricing.oneTime') }}</span>
          </p>
          <p class="plan-unit">
            {{ t('pricing.unit', { n: pack.credits, price: perVideo(pack) }) }}
            <span v-if="savings(pack)" class="save">{{ t('pricing.save', { percent: savings(pack) }) }}</span>
          </p>
          <button
            type="button"
            class="btn plan-cta"
            :class="pack.id === 'creator' ? 'btn-light' : 'btn-ink'"
            :disabled="pendingPack !== null"
            @click="buy(pack.id)"
          >
            {{ pendingPack === pack.id ? t('paywall.redirecting') : t('pricing.buy', { name: t(`pricing.packs.${pack.id}.name`) }) }}
          </button>
          <ul class="features">
            <li v-for="i in paidFeatures" :key="i">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              {{ t(`pricing.paidFeatures.${i - 1}`, { n: pack.credits }) }}
            </li>
          </ul>
        </article>
      </div>

      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <section class="included">
        <h2 class="included-title">{{ t('pricing.included.title') }}</h2>
        <div class="included-grid">
          <div v-for="key in included" :key="key" class="included-item">
            <strong>{{ t(`pricing.included.${key}.title`) }}</strong>
            <span>{{ t(`pricing.included.${key}.description`) }}</span>
          </div>
        </div>
      </section>
    </section>

    <FAQ
      :eyebrow="t('home.faq.eyebrow')"
      :title="t('pricing.faq.title')"
      :aside="t('home.faq.aside')"
      :contact-label="t('home.faq.contact')"
      :contact-href="`mailto:${SUPPORT_EMAIL}`"
      :faqs="faqs"
    />
  </MarketingLayout>
</template>

<style scoped>
.pricing {
  max-width: 1120px;
  margin: 0 auto;
  padding: 4.5rem 1.5rem 2rem;
}

.head {
  max-width: 640px;
  margin: 0 auto 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  text-align: center;
}

.title {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
}

.lead {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.trial {
  margin-bottom: 1.25rem;
  padding: 18px 22px;
  border-radius: var(--radius-lg);
  background: var(--accent-soft);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.trial-copy {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
}

.trial-copy strong {
  font-size: 1rem;
}

.trial-copy span {
  font-size: 0.9rem;
  color: #3c3f45;
}

.trial .btn {
  min-height: 44px;
}

.plans {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  align-items: stretch;
}

.plan {
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.plan.featured {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--on-ink);
}

.plan-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-name {
  font-size: 1.05rem;
  font-weight: 600;
}

.badge {
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--accent-on-ink);
  color: var(--ink);
  font-size: 0.75rem;
  font-weight: 700;
}

.badge-soft {
  background: var(--accent-soft);
  color: var(--accent);
}

.save {
  margin-left: 6px;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 700;
}

.featured .save {
  background: rgba(169, 156, 249, 0.18);
  color: var(--accent-on-ink);
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 0.4rem;
}

.amount {
  font-family: var(--font-display);
  font-size: 3.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}

.once {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.plan-unit {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.featured .once,
.featured .plan-unit {
  color: var(--on-ink-muted);
}

.plan-cta {
  margin: 0.9rem 0 0.4rem;
  min-height: 48px;
}

.plan-cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.features {
  list-style: none;
  padding-top: 1rem;
  border-top: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  font-size: 0.9rem;
}

.featured .features {
  border-top-color: var(--ink-line);
}

.features li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.features svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--accent);
}

.featured .features svg {
  color: var(--accent-on-ink);
}

.error {
  margin-top: 1rem;
  text-align: center;
  color: #b42318;
}

.included {
  margin-top: 4rem;
  padding: 2rem;
  border-radius: var(--radius-lg);
  background: var(--bg);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.included-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.included-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.included-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--text-muted);
}

.included-item strong {
  font-size: 1rem;
  color: var(--text);
}

@media (max-width: 900px) {
  .plans,
  .included-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .plans {
    max-width: 460px;
    margin: 0 auto;
  }

  .pricing {
    padding: 3rem 1rem 1rem;
  }
}
</style>
