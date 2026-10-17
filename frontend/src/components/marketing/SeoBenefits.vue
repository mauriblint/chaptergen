<script setup lang="ts">
import Section from '../ui/Section.vue'

defineProps<{
  eyebrow: string
  title: string
  intro: string
  bullets: { title: string; description: string }[]
}>()

const icons = [
  'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5',
  'M7 11v9H4v-9zM7 11l4-7a2 2 0 0 1 3 1.7V9h5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7',
  'M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4',
  'M4 6h16M4 12h10M4 18h13',
]
</script>

<template>
  <Section>
    <div class="section-head">
      <span class="eyebrow">{{ eyebrow }}</span>
      <h2 class="section-title">{{ title }}</h2>
      <p class="section-intro">{{ intro }}</p>
    </div>
    <div class="benefit-grid">
      <div v-for="(item, i) in bullets" :key="i" class="benefit">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path :d="icons[i % icons.length]" />
        </svg>
        <h3 class="benefit-title">{{ item.title }}</h3>
        <p class="benefit-desc">{{ item.description }}</p>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.benefit-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem 1.5rem;
}

.benefit {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding-top: 1.4rem;
  border-top: 2px solid var(--ink);
}

.benefit svg {
  color: var(--accent);
}

.benefit-title {
  font-size: 1.15rem;
  font-weight: 600;
}

.benefit-desc {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--text-muted);
}

@media (max-width: 960px) {
  .benefit-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .benefit-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
