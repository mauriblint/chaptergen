<script setup lang="ts">
import Section from '../ui/Section.vue'
import ChapterPreview from './ChapterPreview.vue'
import type { PreviewContent } from '../../content/home'

defineProps<{
  eyebrow: string
  title: string
  intro: string
  bullets: string[]
  /** Chapter example; other outputs pass their own preview in the slot. */
  preview?: PreviewContent
}>()
</script>

<template>
  <Section>
    <div class="showcase">
      <div class="copy">
        <span class="eyebrow">{{ eyebrow }}</span>
        <h2 class="section-title">{{ title }}</h2>
        <p class="section-intro">{{ intro }}</p>
        <ul class="bullets">
          <li v-for="item in bullets" :key="item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            {{ item }}
          </li>
        </ul>
      </div>
      <slot>
        <ChapterPreview v-if="preview" :preview="preview" />
      </slot>
    </div>
  </Section>
</template>

<style scoped>
.showcase {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 4.5rem;
  align-items: center;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 1rem;
}

.bullets li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.bullets svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--accent);
}

@media (max-width: 960px) {
  .showcase {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.5rem;
  }
}
</style>
