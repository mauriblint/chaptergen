<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Section from '../ui/Section.vue'
import type { UseCaseItem } from '../../content/home'

defineProps<{
  title: string
  items: UseCaseItem[]
}>()
</script>

<template>
  <Section id="use-cases">
    <h2 class="section-title">{{ title }}</h2>
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
.section-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 2.5rem;
  text-align: center;
}

.use-case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.use-case-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.use-case-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.use-case-desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.use-case-link {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--accent);
}

.use-case-link:hover {
  opacity: 0.8;
}
</style>
