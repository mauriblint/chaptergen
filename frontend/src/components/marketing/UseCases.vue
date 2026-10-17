<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Section from '../ui/Section.vue'
import type { UseCaseItem } from '../../content/home'

defineProps<{
  eyebrow?: string
  title: string
  items: UseCaseItem[]
}>()
</script>

<template>
  <Section id="use-cases">
    <div class="section-head">
      <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
      <h2 class="section-title">{{ title }}</h2>
    </div>
    <div class="use-case-grid">
      <div v-for="(item, i) in items" :key="i" class="use-case-card">
        <h3 class="use-case-title">{{ item.title }}</h3>
        <p class="use-case-desc">{{ item.description }}</p>
        <RouterLink v-if="item.link" :to="item.link" class="use-case-link">
          {{ item.linkLabel }}
        </RouterLink>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.use-case-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
}

.use-case-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.75rem;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
}

.use-case-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.use-case-desc {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--text-muted);
}

.use-case-link {
  margin-top: auto;
  padding-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent);
}

.use-case-link:hover {
  text-decoration: underline;
}

@media (max-width: 960px) {
  .use-case-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .use-case-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .use-case-card {
    padding: 1.4rem;
  }
}
</style>
