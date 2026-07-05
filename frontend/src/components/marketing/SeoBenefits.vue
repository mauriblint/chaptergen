<script setup lang="ts">
import Section from '../ui/Section.vue'

defineProps<{
  title: string
  intro: string
  bullets: { title: string; description: string }[]
}>()
</script>

<template>
  <Section>
    <h2 class="section-title">{{ title }}</h2>
    <p class="section-intro">{{ intro }}</p>
    <div class="benefit-grid">
      <div v-for="(item, i) in bullets" :key="i" class="benefit-card">
        <h3 class="benefit-title">{{ item.title }}</h3>
        <p class="benefit-desc">{{ item.description }}</p>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.section-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  text-align: center;
}

.section-intro {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.benefit-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
}

.benefit-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.benefit-desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
}
</style>
