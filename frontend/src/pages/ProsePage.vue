<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import { SITE_URL, SUPPORT_EMAIL } from '../content/home'
import { hreflangLinks, organizationSchema } from '../utils/schema'
import { pathPair } from '../i18n/routing'

type ProseKey = 'about' | 'privacy' | 'terms'

interface ProseSection {
  heading: string
  paragraphs: string[]
}

const route = useRoute()
const { t, tm, te, locale } = useI18n()

const key = computed(() => route.meta.prose as ProseKey)
const base = computed(() => `pages.${key.value}`)
const sections = computed(() => tm(`${base.value}.sections`) as ProseSection[])
const updated = computed(() =>
  te(`${base.value}.updatedDate`)
    ? t('pages.updated', { date: t(`${base.value}.updatedDate`) })
    : null
)
const signature = computed(() =>
  te(`${base.value}.signature`) ? t(`${base.value}.signature`) : null
)

const pair = computed(() => pathPair(route.path))
const canonical = computed(() => `${SITE_URL}${route.path}`)

useHead(
  computed(() => ({
    title: t(`${base.value}.meta.title`),
    htmlAttrs: { lang: locale.value },
    meta: [
      { name: 'description', content: t(`${base.value}.meta.description`) },
      { property: 'og:title', content: t(`${base.value}.meta.title`) },
      { property: 'og:description', content: t(`${base.value}.meta.description`) },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical.value },
      { property: 'og:image', content: `${SITE_URL}/og-image.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [
      { rel: 'canonical', href: canonical.value },
      ...(pair.value ? hreflangLinks(pair.value.en, pair.value.es, SITE_URL) : []),
    ],
    script:
      key.value === 'about'
        ? [
            {
              type: 'application/ld+json',
              innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'AboutPage',
                url: canonical.value,
                name: t('pages.about.meta.title'),
                about: organizationSchema(),
              }),
            },
          ]
        : [],
  }))
)
</script>

<template>
  <MarketingLayout>
    <article class="prose-page">
      <header class="prose-head">
        <span class="eyebrow">{{ t(`${base}.eyebrow`) }}</span>
        <h1 class="display-title prose-title">{{ t(`${base}.title`) }}</h1>
        <p v-if="updated" class="updated">{{ updated }}</p>
        <p class="lead">{{ t(`${base}.intro`) }}</p>
      </header>

      <section v-for="(section, i) in sections" :key="i" class="prose-section">
        <h2 class="prose-h2">{{ section.heading }}</h2>
        <p v-for="(paragraph, j) in section.paragraphs" :key="j">{{ paragraph }}</p>
      </section>

      <p v-if="signature" class="signature">— {{ signature }}</p>

      <p class="contact">
        {{ t('pages.contactLead') }}
        <a :href="`mailto:${SUPPORT_EMAIL}`">{{ SUPPORT_EMAIL }}</a>
      </p>
    </article>
  </MarketingLayout>
</template>

<style scoped>
.prose-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 5rem 1.5rem 6rem;
}

.prose-head {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.prose-title {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
}

.updated {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.lead {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.prose-section {
  padding-top: 2rem;
}

.prose-h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
}

.prose-section p {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: #2c2f35;
}

.prose-section p + p {
  margin-top: 1rem;
}

.signature {
  margin-top: 2.5rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
}

.contact {
  margin-top: 3rem;
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: 1rem;
}

.contact a {
  color: var(--accent);
  font-weight: 600;
}

.contact a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .prose-page {
    padding: 3rem 1rem 4rem;
  }
}
</style>
