<script setup lang="ts">
import { ref } from 'vue'
import Section from '../ui/Section.vue'
import type { FAQItem } from '../../content/home'

defineProps<{
  eyebrow?: string
  title: string
  aside?: string
  contactLabel?: string
  contactHref?: string
  faqs: FAQItem[]
}>()

const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <Section id="faq">
    <div class="faq-grid">
      <div class="faq-head">
        <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
        <h2 class="section-title">{{ title }}</h2>
        <p v-if="aside" class="aside">
          {{ aside }}
          <a v-if="contactHref" :href="contactHref" class="contact">{{ contactLabel }}</a>
        </p>
      </div>

      <div class="faq-list">
        <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
          <h3 class="faq-q">
            <button
              :id="`faq-q-${i}`"
              class="faq-question"
              :aria-expanded="openIndex === i"
              :aria-controls="`faq-a-${i}`"
              @click="toggle(i)"
            >
              <span>{{ faq.question }}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path v-if="openIndex !== i" d="M12 5v14" />
              </svg>
            </button>
          </h3>
          <div
            v-show="openIndex === i"
            :id="`faq-a-${i}`"
            class="faq-answer"
            role="region"
            :aria-labelledby="`faq-q-${i}`"
          >
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.faq-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 3rem;
}

.faq-head {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.aside {
  font-size: 1rem;
  line-height: 1.55;
  color: var(--text-muted);
}

.contact {
  color: var(--accent);
  font-weight: 600;
}

.contact:hover {
  text-decoration: underline;
}

.faq-list {
  border-bottom: 1px solid var(--border);
}

.faq-item {
  border-top: 1px solid var(--border);
}

.faq-q {
  font: inherit;
}

.faq-question {
  width: 100%;
  min-height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 0;
  background: none;
  border: none;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text);
  text-align: left;
  cursor: pointer;
}

.faq-question:hover {
  color: var(--accent);
}

.faq-question svg {
  flex-shrink: 0;
}

.faq-answer {
  padding: 0 0 1.5rem;
}

.faq-answer p {
  max-width: 720px;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--text-muted);
}

@media (max-width: 860px) {
  .faq-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }

  .faq-question {
    font-size: 1.05rem;
  }
}
</style>
