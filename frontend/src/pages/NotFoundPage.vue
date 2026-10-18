<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import { localizedPath, type Locale } from '../i18n/routing'

const { t, locale } = useI18n()

function path(en: string) {
  return localizedPath(en, locale.value as Locale)
}

useHead(
  computed(() => ({
    title: t('pages.notFound.meta.title'),
    htmlAttrs: { lang: locale.value },
    meta: [{ name: 'robots', content: 'noindex' }],
  }))
)
</script>

<template>
  <MarketingLayout>
    <section class="not-found">
      <p class="mono code">{{ t('pages.notFound.code') }}</p>
      <h1 class="display-title title">{{ t('pages.notFound.title') }}</h1>
      <p class="description">{{ t('pages.notFound.description') }}</p>
      <div class="links">
        <RouterLink :to="path('/')" class="btn btn-ink btn-lg">{{ t('pages.notFound.home') }}</RouterLink>
        <RouterLink :to="path('/podcast-chapters')" class="secondary">{{ t('pages.notFound.podcast') }}</RouterLink>
        <RouterLink :to="path('/pricing')" class="secondary">{{ t('pages.notFound.pricing') }}</RouterLink>
      </div>
    </section>
  </MarketingLayout>
</template>

<style scoped>
.not-found {
  max-width: 720px;
  margin: 0 auto;
  padding: 7rem 1.5rem 8rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
}

.code {
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent);
}

.title {
  font-size: clamp(2.25rem, 6vw, 4rem);
}

.description {
  font-size: 1.15rem;
  color: var(--text-muted);
}

.links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 1rem;
}

.secondary {
  font-weight: 600;
  color: var(--accent);
}

.secondary:hover {
  text-decoration: underline;
}
</style>
