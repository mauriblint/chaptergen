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
    <div class="section-head">
      <h2 class="section-title">{{ title }}</h2>
      <p v-if="intro" class="section-intro">{{ intro }}</p>
    </div>
    <div class="platform-grid">
      <div v-for="(item, i) in items" :key="i" class="platform-card">
        <h3 class="platform-title">{{ item.title }}</h3>
        <p class="platform-desc">{{ item.description }}</p>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.platform-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.platform-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.platform-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.55;
}
</style>
