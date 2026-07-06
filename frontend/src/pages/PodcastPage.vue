<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import HeroSection from '../components/marketing/HeroSection.vue'
import PlatformSection from '../components/marketing/PlatformSection.vue'
import UseCases from '../components/marketing/UseCases.vue'
import TextSection from '../components/marketing/TextSection.vue'
import FAQ from '../components/marketing/FAQ.vue'
import { SITE_URL } from '../content/home'
import type { FAQItem, UseCaseItem } from '../content/home'
import { faqSchema, hreflangLinks } from '../utils/schema'
import { localizedPath, type Locale } from '../i18n/routing'

const { t, tm, locale } = useI18n()

const platformItems = computed(
  () => tm('podcast.platforms.items') as { title: string; description: string }[]
)
const useCaseItems = computed(() => tm('podcast.useCases.items') as UseCaseItem[])
const faqs = computed(() => tm('podcast.faq.items') as FAQItem[])

const canonical = computed(
  () => `${SITE_URL}${localizedPath('/podcast-chapters', locale.value as Locale)}`
)
const homeLink = computed(() => localizedPath('/', locale.value as Locale))

useHead(
  computed(() => ({
    title: t('podcast.meta.title'),
    htmlAttrs: { lang: locale.value },
    meta: [
      { name: 'description', content: t('podcast.meta.description') },
      { property: 'og:title', content: t('podcast.meta.title') },
      { property: 'og:description', content: t('podcast.meta.description') },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical.value },
      { property: 'og:image', content: `${SITE_URL}/og-image.png` },
      { property: 'og:image:width', content: '1734' },
      { property: 'og:image:height', content: '907' },
      { property: 'og:image:alt', content: 'ChapterGen — AI-Powered Chapters & Summaries' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: t('podcast.meta.title') },
      { name: 'twitter:description', content: t('podcast.meta.description') },
      { name: 'twitter:image', content: `${SITE_URL}/og-image.png` },
    ],
    link: [
      { rel: 'canonical', href: canonical.value },
      ...hreflangLinks('/podcast-chapters', '/es/capitulos-podcast', SITE_URL),
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(faqSchema(faqs.value)),
      },
    ],
  }))
)
</script>

<template>
  <MarketingLayout>
    <HeroSection
      :badge="t('podcast.hero.badge')"
      :title="t('podcast.hero.title')"
      :subtitle="t('podcast.hero.subtitle')"
      :microcopy="t('podcast.hero.microcopy')"
      variant="audio"
    />
    <PlatformSection
      :title="t('podcast.platforms.title')"
      :intro="t('podcast.platforms.intro')"
      :items="platformItems"
    />
    <UseCases :title="t('podcast.useCases.title')" :items="useCaseItems" />
    <TextSection :title="t('podcast.why.title')" :description="t('podcast.why.description')" />
    <FAQ :title="t('podcast.faq.title')" :faqs="faqs" />

    <div class="cross-link">
      <RouterLink :to="homeLink" class="cross-link-anchor">
        {{ t('podcast.crossLink') }}
      </RouterLink>
    </div>
  </MarketingLayout>
</template>

<style scoped>
.cross-link {
  text-align: center;
  padding: 2rem 1.5rem 3rem;
}

.cross-link-anchor {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--accent);
}

.cross-link-anchor:hover {
  opacity: 0.8;
}
</style>
