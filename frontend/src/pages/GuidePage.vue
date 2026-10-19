<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import { SITE_URL } from '../content/home'
import { faqSchema, hreflangLinks, organizationSchema } from '../utils/schema'
import { localizedPath, pathPair, type Locale } from '../i18n/routing'
import type { FAQItem } from '../content/home'

export type GuideKey = 'chatgpt' | 'addChapters'

interface GuideSection {
  heading: string
  paragraphs?: string[]
  steps?: string[]
  bullets?: string[]
  example?: string
  /** Paragraphs shown after the steps or bullets. */
  after?: string[]
}

/** The other guide, linked at the end of each one. */
const RELATED: Record<GuideKey, { key: GuideKey; path: string }> = {
  chatgpt: { key: 'addChapters', path: '/guides/add-chapters-to-youtube' },
  addChapters: { key: 'chatgpt', path: '/guides/chatgpt-youtube-chapters' },
}

const route = useRoute()
const { t, tm, locale } = useI18n()

const key = computed(() => route.meta.guide as GuideKey)
const base = computed(() => `guides.${key.value}`)
const sections = computed(() => tm(`${base.value}.sections`) as GuideSection[])
const faqs = computed(() => tm(`${base.value}.faq`) as FAQItem[])
const related = computed(() => RELATED[key.value])
const relatedPath = computed(() => localizedPath(related.value.path, locale.value as Locale))
const startPath = computed(() => `${localizedPath('/', locale.value as Locale)}#start`)

const pair = computed(() => pathPair(route.path))
const canonical = computed(() => `${SITE_URL}${route.path}`)

useHead(
  computed(() => ({
    title: t(`${base.value}.meta.title`),
    htmlAttrs: { lang: locale.value },
    meta: [
      { name: 'description', content: t(`${base.value}.meta.description`) },
      { property: 'og:title', content: t(`${base.value}.title`) },
      { property: 'og:description', content: t(`${base.value}.meta.description`) },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: canonical.value },
      { property: 'og:image', content: `${SITE_URL}/og-image.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [
      { rel: 'canonical', href: canonical.value },
      ...(pair.value ? hreflangLinks(pair.value.en, pair.value.es, SITE_URL) : []),
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: t(`${base.value}.title`),
          description: t(`${base.value}.meta.description`),
          inLanguage: locale.value,
          url: canonical.value,
          dateModified: '2026-10-19',
          author: organizationSchema(),
          publisher: organizationSchema(),
          mainEntityOfPage: canonical.value,
        }),
      },
      { type: 'application/ld+json', innerHTML: JSON.stringify(faqSchema(faqs.value)) },
    ],
  }))
)
</script>

<template>
  <MarketingLayout>
    <article class="guide">
      <header class="head">
        <span class="eyebrow">{{ t(`${base}.eyebrow`) }}</span>
        <h1 class="display-title title">{{ t(`${base}.title`) }}</h1>
        <p class="updated">{{ t('guides.updated', { date: t(`${base}.updatedDate`) }) }}</p>
        <p class="lead">{{ t(`${base}.intro`) }}</p>
      </header>

      <aside class="answer">
        <strong class="answer-label">{{ t('guides.shortAnswer') }}</strong>
        <p>{{ t(`${base}.answer`) }}</p>
      </aside>

      <section v-for="(section, i) in sections" :key="i" class="section">
        <h2 class="h2">{{ section.heading }}</h2>
        <p v-for="(paragraph, j) in section.paragraphs ?? []" :key="`p${j}`">{{ paragraph }}</p>
        <pre v-if="section.example" class="example"><code>{{ section.example }}</code></pre>
        <ol v-if="section.steps" class="steps">
          <li v-for="(step, j) in section.steps" :key="`s${j}`">{{ step }}</li>
        </ol>
        <ul v-if="section.bullets" class="bullets">
          <li v-for="(bullet, j) in section.bullets" :key="`b${j}`">{{ bullet }}</li>
        </ul>
        <p v-for="(paragraph, j) in section.after ?? []" :key="`a${j}`">{{ paragraph }}</p>
      </section>

      <aside class="cta">
        <div>
          <h2 class="cta-title">{{ t(`${base}.cta.title`) }}</h2>
          <p class="cta-body">{{ t(`${base}.cta.body`) }}</p>
        </div>
        <RouterLink :to="startPath" class="btn btn-light btn-lg">{{ t(`${base}.cta.button`) }}</RouterLink>
      </aside>

      <section class="faq">
        <h2 class="h2">{{ t('guides.faqTitle') }}</h2>
        <div class="faq-list">
          <details v-for="faq in faqs" :key="faq.question" class="faq-item">
            <summary>
              <span>{{ faq.question }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </section>

      <RouterLink :to="relatedPath" class="related">
        <span class="related-label">{{ t('guides.related') }}</span>
        <span class="related-title">{{ t(`guides.${related.key}.title`) }} →</span>
      </RouterLink>
    </article>
  </MarketingLayout>
</template>

<style scoped>
.guide {
  max-width: 760px;
  margin: 0 auto;
  padding: 5rem 1.5rem 6rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.head {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: clamp(2.1rem, 5vw, 3.25rem);
}

.updated {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.lead {
  font-size: 1.15rem;
  line-height: 1.65;
  color: var(--text-muted);
}

.answer {
  padding: 1.5rem 1.6rem;
  border-left: 4px solid var(--accent);
  border-radius: 0 16px 16px 0;
  background: var(--accent-soft);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.answer-label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
}

.answer p {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--text);
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.h2 {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.section p,
.steps li,
.bullets li {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #33363c;
}

.steps,
.bullets {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-left: 1.4rem;
}

.steps {
  list-style: decimal;
}

.bullets {
  list-style: disc;
}

.steps li::marker {
  font-weight: 700;
  color: var(--accent);
}

.bullets li::marker {
  color: var(--accent);
}

.example {
  margin: 0;
  padding: 1.1rem 1.25rem;
  border-radius: 14px;
  background: var(--ink);
  color: var(--on-ink);
  font-family: var(--font-mono);
  font-size: 0.95rem;
  line-height: 1.8;
  overflow-x: auto;
}

.cta {
  padding: 2rem;
  border-radius: 20px;
  background: var(--ink);
  color: var(--on-ink);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.cta-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.cta-body {
  margin-top: 0.35rem;
  max-width: 420px;
  color: var(--on-ink-muted);
}

.faq {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-list {
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

.faq-item + .faq-item {
  border-top: 1px solid var(--border-soft);
}

.faq-item summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  font-weight: 600;
  cursor: pointer;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary:hover {
  background: var(--bg);
}

.faq-item summary svg {
  flex-shrink: 0;
  color: var(--text-muted);
  transition: transform 0.15s;
}

.faq-item[open] summary svg {
  transform: rotate(180deg);
}

.faq-item p {
  padding: 0 20px 18px;
  line-height: 1.65;
  color: var(--text-muted);
}

.related {
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  transition: border-color 0.15s;
}

.related:hover {
  border-color: var(--accent);
}

.related-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.related-title {
  font-weight: 700;
  color: var(--accent);
}

@media (max-width: 640px) {
  .guide {
    padding: 3rem 1rem 4rem;
  }

  .cta {
    padding: 1.5rem;
  }

  .cta .btn {
    width: 100%;
  }
}
</style>
