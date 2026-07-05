<script setup lang="ts">
import Section from '../ui/Section.vue'

defineProps<{
  title: string
  intro: string
  bullets: { title: string; description: string }[]
}>()
</script>

<template>
  <Section alt>
    <h2 class="section-title">{{ title }}</h2>
    <p class="section-intro">{{ intro }}</p>
    <ul class="bullet-list">
      <li v-for="(item, i) in bullets" :key="i" class="bullet-item">
        <svg class="check-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="10" fill="rgba(99,102,241,0.12)" />
          <path d="M6 10l3 3 5-6" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div>
          <strong>{{ item.title }}:</strong>
          {{ item.description }}
        </div>
      </li>
    </ul>
  </Section>
</template>

<style scoped>
.section-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.section-intro {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 720px;
}

.bullet-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.bullet-item {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.bullet-item strong {
  color: var(--text);
}

.check-icon {
  flex-shrink: 0;
  margin-top: 0.1rem;
}
</style>
