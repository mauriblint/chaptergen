<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import HeroSection from '../components/marketing/HeroSection.vue'
import AudienceStrip from '../components/marketing/AudienceStrip.vue'
import ResultShowcase from '../components/marketing/ResultShowcase.vue'
import HowItWorks from '../components/marketing/HowItWorks.vue'
import WhyChapterGen from '../components/marketing/WhyChapterGen.vue'
import SeoBenefits from '../components/marketing/SeoBenefits.vue'
import UseCases from '../components/marketing/UseCases.vue'
import PricingTeaser from '../components/marketing/PricingTeaser.vue'
import FAQ from '../components/marketing/FAQ.vue'
import FinalCta from '../components/marketing/FinalCta.vue'
import { SITE_URL, SUPPORT_EMAIL } from '../content/home'
import type { FAQItem, PlanTeaser, PreviewContent, StepItem, UseCaseItem } from '../content/home'
import {
  faqSchema,
  softwareApplicationSchema,
  howToSchema,
  organizationSchema,
  hreflangLinks,
} from '../utils/schema'
import { localizedPath, type Locale } from '../i18n/routing'

const { t, tm, locale } = useI18n()

const preview = computed(() => tm('home.showcase.preview') as PreviewContent)
const showcaseBullets = computed(() => tm('home.showcase.bullets') as string[])
const audienceItems = computed(() => tm('home.audience.items') as string[])
const steps = computed(() => tm('home.howItWorks.steps') as StepItem[])
const whyBullets = computed(() => tm('home.why.bullets') as { title: string; description: string }[])
const comparisonRows = computed(
  () => tm('home.why.rows') as { feature: string; youtube: string; chaptergen: string }[]
)
const seoBullets = computed(
  () => tm('home.seoBenefits.bullets') as { title: string; description: string }[]
)
const useCaseItems = computed(() => tm('home.useCases.items') as UseCaseItem[])
const plans = computed(() => tm('home.pricing.plans') as PlanTeaser[])
const faqs = computed(() => tm('home.faq.items') as FAQItem[])
const pricingPath = computed(() => localizedPath('/pricing', locale.value as Locale))

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
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'ChapterGen — AI YouTube chapter generator' },
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
        innerHTML: JSON.stringify(organizationSchema()),
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
    />
    <AudienceStrip :label="t('home.audience.label')" :items="audienceItems" />
    <ResultShowcase
      :eyebrow="t('home.showcase.eyebrow')"
      :title="t('home.showcase.title')"
      :intro="t('home.showcase.intro')"
      :bullets="showcaseBullets"
      :preview="preview"
    />
    <HowItWorks
      :eyebrow="t('home.howItWorks.eyebrow')"
      :title="t('home.howItWorks.title')"
      :intro="t('home.howItWorks.intro')"
      :steps="steps"
    />
    <WhyChapterGen
      :eyebrow="t('home.why.eyebrow')"
      :title="t('home.why.title')"
      :intro="t('home.why.intro')"
      :outro="t('home.why.outro')"
      :bullets="whyBullets"
      :col-youtube="t('home.why.colYoutube')"
      :col-chaptergen="t('home.why.colChaptergen')"
      :yes-label="t('home.why.yes')"
      :no-label="t('home.why.no')"
      :rows="comparisonRows"
    />
    <SeoBenefits
      :eyebrow="t('home.seoBenefits.eyebrow')"
      :title="t('home.seoBenefits.title')"
      :intro="t('home.seoBenefits.intro')"
      :bullets="seoBullets"
    />
    <UseCases
      :eyebrow="t('home.useCases.eyebrow')"
      :title="t('home.useCases.title')"
      :items="useCaseItems"
    />
    <PricingTeaser
      :eyebrow="t('home.pricing.eyebrow')"
      :title="t('home.pricing.title')"
      :subtitle="t('home.pricing.subtitle')"
      :plans="plans"
      free-href="#start"
      :pricing-path="pricingPath"
    />
    <FAQ
      :eyebrow="t('home.faq.eyebrow')"
      :title="t('home.faq.title')"
      :aside="t('home.faq.aside')"
      :contact-label="t('home.faq.contact')"
      :contact-href="`mailto:${SUPPORT_EMAIL}`"
      :faqs="faqs"
    />
    <FinalCta
      :title="t('home.finalCta.title')"
      :subtitle="t('home.finalCta.subtitle')"
      :cta="t('home.finalCta.cta')"
      href="#start"
    />
  </MarketingLayout>
</template>
