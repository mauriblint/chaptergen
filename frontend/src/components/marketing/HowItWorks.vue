<script setup lang="ts">
import Section from '../ui/Section.vue'
import type { StepItem } from '../../content/home'

defineProps<{
  title: string
  steps: StepItem[]
}>()
</script>

<template>
  <Section id="features">
    <h2 class="section-title">{{ title }}</h2>
    <ol class="steps">
      <li v-for="(step, i) in steps" :key="i" class="step">
        <div class="step-number">{{ i + 1 }}</div>
        <div class="step-content">
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.description }}</p>
        </div>
      </li>
    </ol>
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

.steps {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.step-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
