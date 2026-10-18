<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Section from '../ui/Section.vue'
import type { PlanTeaser } from '../../content/home'

defineProps<{
  eyebrow: string
  title: string
  subtitle: string
  plans: PlanTeaser[]
  trial: string
  trialCta: string
  freeHref: string
  pricingPath: string
}>()
</script>

<template>
  <Section id="pricing" alt>
    <div class="section-head centered">
      <span class="eyebrow">{{ eyebrow }}</span>
      <h2 class="section-title">{{ title }}</h2>
      <p class="section-intro">{{ subtitle }}</p>
    </div>

    <div class="trial">
      <span>{{ trial }}</span>
      <a :href="freeHref" class="trial-link">{{ trialCta }} →</a>
    </div>

    <div class="plans">
      <div v-for="plan in plans" :key="plan.name" class="plan" :class="{ featured: plan.featured }">
        <div class="plan-top">
          <h3 class="plan-name">{{ plan.name }}</h3>
          <span v-if="plan.badge" class="plan-badge">{{ plan.badge }}</span>
        </div>
        <p class="plan-price">
          <span class="amount">{{ plan.price }}</span>
          <span v-if="plan.unit" class="unit">{{ plan.unit }}</span>
        </p>
        <ul class="plan-features">
          <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
        </ul>
        <RouterLink :to="pricingPath" class="btn plan-cta" :class="plan.featured ? 'btn-light' : 'btn-outline'">
          {{ plan.cta }}
        </RouterLink>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.centered {
  align-items: center;
  text-align: center;
}

.centered .section-intro {
  max-width: 520px;
}

.trial {
  max-width: 1040px;
  margin: 0 auto 1.25rem;
  padding: 14px 20px;
  border-radius: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 16px;
  font-size: 0.95rem;
}

.trial-link {
  font-weight: 600;
  color: var(--accent);
}

.trial-link:hover {
  text-decoration: underline;
}

.plans {
  max-width: 1040px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.plan {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.plan.featured {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--on-ink);
}

.plan-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.plan-name {
  font-size: 1rem;
  font-weight: 600;
}

.plan-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: var(--accent-on-ink);
  color: var(--ink);
  font-size: 0.75rem;
  font-weight: 700;
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.amount {
  font-family: var(--font-display);
  font-size: 3.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}

.unit {
  font-size: 0.95rem;
  color: var(--text-muted);
}

.featured .unit {
  color: var(--on-ink-muted);
}

.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.95rem;
  color: #3c3f45;
}

.featured .plan-features {
  color: #d5d8dd;
}

.plan-cta {
  margin-top: auto;
  min-height: 48px;
}

@media (max-width: 860px) {
  .plans {
    grid-template-columns: minmax(0, 1fr);
    max-width: 440px;
  }
}
</style>
