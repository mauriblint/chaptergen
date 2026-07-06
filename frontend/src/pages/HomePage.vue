<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import HeroSection from '../components/marketing/HeroSection.vue'
import HowItWorks from '../components/marketing/HowItWorks.vue'
import Differentiator from '../components/marketing/Differentiator.vue'
import SeoBenefits from '../components/marketing/SeoBenefits.vue'
import ComparisonTable from '../components/marketing/ComparisonTable.vue'
import UseCases from '../components/marketing/UseCases.vue'
import FAQ from '../components/marketing/FAQ.vue'
import { SITE_URL } from '../content/home'
import type { FAQItem, StepItem, UseCaseItem } from '../content/home'
import {
  faqSchema,
  softwareApplicationSchema,
  howToSchema,
  hreflangLinks,
} from '../utils/schema'
import { localizedPath, type Locale } from '../i18n/routing'

const { t, tm, locale } = useI18n()

const steps = computed(() => tm('home.howItWorks.steps') as StepItem[])
const differentiatorBullets = computed(
  () => tm('home.differentiator.bullets') as { title: string; description: string }[]
)
const seoBullets = computed(
  () => tm('home.seoBenefits.bullets') as { title: string; description: string }[]
)
const comparisonRows = computed(
  () => tm('home.comparison.rows') as { feature: string; youtube: string; chaptergen: string }[]
)
const useCaseItems = computed(() => tm('home.useCases.items') as UseCaseItem[])
const faqs = computed(() => tm('home.faq.items') as FAQItem[])

const canonical = computed(() => `${SITE_URL}${localizedPath('/', locale.value as Locale)}`)

useHead(
  computed(() => ({
    title: t('home.meta.title'),
    htmlAttrs: { lang: locale.value },
    meta: [
      { name: 'description', content: t('home.meta.description') },
      { property: 'og:title', content: t('home.meta.title') },
      { property: 'og:description', content: t('home.meta.description') },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical.value },
      { property: 'og:image', content: `${SITE_URL}/og-image.png` },
      { property: 'og:image:width', content: '1734' },
      { property: 'og:image:height', content: '907' },
      { property: 'og:image:alt', content: 'ChapterGen — AI-Powered Chapters & Summaries' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: t('home.meta.title') },
      { name: 'twitter:description', content: t('home.meta.description') },
      { name: 'twitter:image', content: `${SITE_URL}/og-image.png` },
    ],
    link: [{ rel: 'canonical', href: canonical.value }, ...hreflangLinks('/', '/es', SITE_URL)],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(softwareApplicationSchema(t('home.schema.softwareDescription'))),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(faqSchema(faqs.value)),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(howToSchema(t('home.schema.howToName'), steps.value)),
      },
    ],
  }))
)
</script>

<template>
  <MarketingLayout>
    <HeroSection
      :badge="t('home.hero.badge')"
      :title="t('home.hero.title')"
      :subtitle="t('home.hero.subtitle')"
      :microcopy="t('home.hero.microcopy')"
    />
    <HowItWorks :title="t('home.howItWorks.title')" :steps="steps" />
    <Differentiator
      :title="t('home.differentiator.title')"
      :intro="t('home.differentiator.intro')"
      :bullets="differentiatorBullets"
    />
    <SeoBenefits
      :title="t('home.seoBenefits.title')"
      :intro="t('home.seoBenefits.intro')"
      :bullets="seoBullets"
    />
    <ComparisonTable
      :title="t('home.comparison.title')"
      :intro="t('home.comparison.intro')"
      :outro="t('home.comparison.outro')"
      :col-youtube="t('home.comparison.colYoutube')"
      :col-chaptergen="t('home.comparison.colChaptergen')"
      :rows="comparisonRows"
    />
    <UseCases :title="t('home.useCases.title')" :items="useCaseItems" />
    <FAQ :title="t('home.faq.title')" :faqs="faqs" />
  </MarketingLayout>
</template>
