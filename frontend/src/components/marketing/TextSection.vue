<script setup lang="ts">
import Section from '../ui/Section.vue'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <Section alt>
    <h2 class="section-title">{{ title }}</h2>
    <p class="section-desc">{{ description }}</p>
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

.section-desc {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}
</style>
