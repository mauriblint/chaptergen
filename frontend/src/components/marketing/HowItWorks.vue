<script setup lang="ts">
import Section from '../ui/Section.vue'
import type { StepItem } from '../../content/home'

defineProps<{
  eyebrow: string
  title: string
  intro: string
  steps: StepItem[]
}>()
</script>

<template>
  <Section id="how">
    <div class="head">
      <div class="section-head head-main">
        <span class="eyebrow">{{ eyebrow }}</span>
        <h2 class="section-title">{{ title }}</h2>
      </div>
      <p class="section-intro">{{ intro }}</p>
    </div>

    <ol class="steps">
      <li v-for="(step, i) in steps" :key="i" class="step">
        <span class="mono step-number">{{ String(i + 1).padStart(2, '0') }}</span>
        <h3 class="step-title">{{ step.title }}</h3>
        <p class="step-desc">{{ step.description }}</p>

        <div class="visual" aria-hidden="true">
          <template v-if="i === 0">
            <span class="mono file-chip">interview.mov</span>
            <span class="mono file-chip">episode-12.mp3</span>
          </template>
          <div v-else-if="i === 1" class="bars">
            <span style="width: 18%" class="bar accent" />
            <span style="width: 26%" class="bar" />
            <span style="width: 14%" class="bar accent" />
            <span style="width: 22%" class="bar" />
            <span style="flex: 1" class="bar accent" />
          </div>
          <div v-else class="mono stamp-list">
            <span>0:00 Intro</span>
            <span>2:14 The setup</span>
            <span>9:40 Results</span>
          </div>
        </div>
      </li>
    </ol>
  </Section>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem 3rem;
  margin-bottom: 3.5rem;
}

.head-main {
  margin-bottom: 0;
  max-width: 660px;
}

.head .section-intro {
  max-width: 420px;
}

.steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 2rem;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
}

.step-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent);
}

.step-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.step-desc {
  font-size: 1rem;
  line-height: 1.55;
  color: var(--text-muted);
}

.visual {
  margin-top: auto;
  min-height: 116px;
  padding: 1.1rem 1.4rem;
  border-radius: 14px;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.file-chip {
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: 0.8rem;
}

.bars {
  width: 100%;
  display: flex;
  gap: 4px;
}

.bar {
  height: 8px;
  border-radius: 4px;
  background: var(--ink);
}

.bar.accent {
  background: var(--accent-bright);
}

.stamp-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.82rem;
}

@media (max-width: 960px) {
  .head {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 2.5rem;
  }

  .steps {
    grid-template-columns: minmax(0, 1fr);
  }

  .step {
    padding: 1.5rem;
  }
}
</style>
