<script setup lang="ts">
import { ref } from 'vue'
import Section from '../ui/Section.vue'
import type { FAQItem } from '../../content/home'

defineProps<{
  title: string
  faqs: FAQItem[]
}>()

const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <Section id="faq">
    <h2 class="section-title">{{ title }}</h2>
    <div class="faq-list">
      <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
        <button
          class="faq-question"
          :aria-expanded="openIndex === i"
          @click="toggle(i)"
        >
          {{ faq.question }}
          <span class="faq-icon" :class="{ open: openIndex === i }">+</span>
        </button>
        <div v-show="openIndex === i" class="faq-answer">
          <p>{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.section-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
  text-align: center;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faq-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: left;
  color: var(--text);
  cursor: pointer;
}

.faq-question:hover {
  background: var(--bg);
}

.faq-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
  color: var(--text-muted);
  transition: transform 0.2s;
  line-height: 1;
}

.faq-icon.open {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 0 1.25rem 1rem;
}

.faq-answer p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
