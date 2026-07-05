<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import HeroSection from '../components/marketing/HeroSection.vue'
import PlatformSection from '../components/marketing/PlatformSection.vue'
import UseCases from '../components/marketing/UseCases.vue'
import TextSection from '../components/marketing/TextSection.vue'
import FAQ from '../components/marketing/FAQ.vue'
import { SITE_URL } from '../content/home'
import {
  podcastMeta,
  podcastHero,
  podcastPlatforms,
  podcastUseCases,
  podcastWhy,
  podcastFaq,
} from '../content/podcast'
import { faqSchema, hreflangLinks } from '../utils/schema'

const canonical = `${SITE_URL}${podcastMeta.canonical}`

useHead({
  title: podcastMeta.title,
  meta: [
    { name: 'description', content: podcastMeta.description },
    { property: 'og:title', content: podcastMeta.title },
    { property: 'og:description', content: podcastMeta.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonical },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: podcastMeta.title },
    { name: 'twitter:description', content: podcastMeta.description },
  ],
  link: [
    { rel: 'canonical', href: canonical },
    ...hreflangLinks('/podcast-chapters', '/es/capitulos-podcast', SITE_URL),
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqSchema(podcastFaq)),
    },
  ],
})
</script>

<template>
  <MarketingLayout>
    <HeroSection
      :badge="podcastHero.badge"
      :title="podcastHero.title"
      :subtitle="podcastHero.subtitle"
      :microcopy="podcastHero.microcopy"
      variant="audio"
    />
    <PlatformSection
      :title="podcastPlatforms.title"
      :intro="podcastPlatforms.intro"
      :items="podcastPlatforms.items"
    />
    <UseCases :title="podcastUseCases.title" :items="podcastUseCases.items" />
    <TextSection :title="podcastWhy.title" :description="podcastWhy.description" />
    <FAQ title="Podcast Chapters — FAQ" :faqs="podcastFaq" />

    <div class="cross-link">
      <RouterLink to="/" class="cross-link-anchor">
        Also works with video → YouTube Chapter Generator
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
