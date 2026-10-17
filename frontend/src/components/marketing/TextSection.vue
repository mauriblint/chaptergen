<script setup lang="ts">
import Section from '../ui/Section.vue'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <Section dark>
    <div class="text-block">
      <h2 class="section-title">{{ title }}</h2>
      <p class="section-desc">{{ description }}</p>
    </div>
  </Section>
</template>

<style scoped>
.text-block {
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-desc {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--on-ink-muted);
}
</style>
