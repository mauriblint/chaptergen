<script setup lang="ts">
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import HeroSection from '../components/marketing/HeroSection.vue'
import HowItWorks from '../components/marketing/HowItWorks.vue'
import Differentiator from '../components/marketing/Differentiator.vue'
import SeoBenefits from '../components/marketing/SeoBenefits.vue'
import ComparisonTable from '../components/marketing/ComparisonTable.vue'
import UseCases from '../components/marketing/UseCases.vue'
import FAQ from '../components/marketing/FAQ.vue'
import {
  SITE_URL,
  homeMeta,
  homeHero,
  howItWorks,
  differentiator,
  seoBenefits,
  comparison,
  useCases,
  homeFaq,
} from '../content/home'
import {
  faqSchema,
  softwareApplicationSchema,
  howToSchema,
  hreflangLinks,
} from '../utils/schema'

const canonical = `${SITE_URL}${homeMeta.canonical}`

useHead({
  title: homeMeta.title,
  meta: [
    { name: 'description', content: homeMeta.description },
    { property: 'og:title', content: homeMeta.title },
    { property: 'og:description', content: homeMeta.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: `${SITE_URL}/og-image.png` },
    { property: 'og:image:width', content: '1734' },
    { property: 'og:image:height', content: '907' },
    { property: 'og:image:alt', content: 'ChapterGen — AI-Powered Chapters & Summaries' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: homeMeta.title },
    { name: 'twitter:description', content: homeMeta.description },
    { name: 'twitter:image', content: `${SITE_URL}/og-image.png` },
  ],
  link: [{ rel: 'canonical', href: canonical }, ...hreflangLinks('/', '/es/', SITE_URL)],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(softwareApplicationSchema()),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqSchema(homeFaq)),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(howToSchema(howItWorks.steps)),
    },
  ],
})
</script>

<template>
  <MarketingLayout>
    <HeroSection
      :badge="homeHero.badge"
      :title="homeHero.title"
      :subtitle="homeHero.subtitle"
      :microcopy="homeHero.microcopy"
    />
    <HowItWorks :title="howItWorks.title" :steps="howItWorks.steps" />
    <Differentiator
      :title="differentiator.title"
      :intro="differentiator.intro"
      :bullets="differentiator.bullets"
    />
    <SeoBenefits
      :title="seoBenefits.title"
      :intro="seoBenefits.intro"
      :bullets="seoBenefits.bullets"
    />
    <ComparisonTable
      :title="comparison.title"
      :intro="comparison.intro"
      :outro="comparison.outro"
      :rows="comparison.rows"
    />
    <UseCases :title="useCases.title" :items="useCases.items" />
    <FAQ title="Frequently Asked Questions" :faqs="homeFaq" />
  </MarketingLayout>
</template>
