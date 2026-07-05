<script setup lang="ts">
import Section from '../ui/Section.vue'

defineProps<{
  title: string
  intro?: string
  items: { title: string; description: string }[]
}>()
</script>

<template>
  <Section :alt="!!intro">
    <h2 class="section-title">{{ title }}</h2>
    <p v-if="intro" class="section-intro">{{ intro }}</p>
    <div class="platform-grid">
      <div v-for="(item, i) in items" :key="i" class="platform-card">
        <h3 class="platform-title">{{ item.title }}</h3>
        <p class="platform-desc">{{ item.description }}</p>
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
  text-align: center;
  margin-bottom: 2.5rem;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.platform-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
}

.platform-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.platform-desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
}
</style>
