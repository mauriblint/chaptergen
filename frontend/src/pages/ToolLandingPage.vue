<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import HeroSection from '../components/marketing/HeroSection.vue'
import ResultShowcase from '../components/marketing/ResultShowcase.vue'
import OutputPreview from '../components/marketing/OutputPreview.vue'
import HowItWorks from '../components/marketing/HowItWorks.vue'
import UseCases from '../components/marketing/UseCases.vue'
import FAQ from '../components/marketing/FAQ.vue'
import FinalCta from '../components/marketing/FinalCta.vue'
import { SITE_URL, SUPPORT_EMAIL } from '../content/home'
import type { FAQItem, StepItem, UseCaseItem } from '../content/home'
import { faqSchema, howToSchema, hreflangLinks, softwareApplicationSchema } from '../utils/schema'
import { pathPair } from '../i18n/routing'

/** Landing pages for the other outputs of an upload: transcripts and subtitles. */
type LandingKey = 'transcript' | 'subtitles'

const route = useRoute()
const { t, tm, locale } = useI18n()

const key = computed(() => route.meta.landing as LandingKey)
const base = computed(() => `landings.${key.value}`)
const pair = computed(() => pathPair(route.path))
const canonical = computed(() => `${SITE_URL}${route.path}`)

const bullets = computed(() => tm(`${base.value}.showcase.bullets`) as string[])
const sample = computed(() => tm(`${base.value}.sample.lines`) as string[][])
const steps = computed(() => tm(`${base.value}.howItWorks.steps`) as StepItem[])
const useCases = computed(() => tm(`${base.value}.useCases.items`) as UseCaseItem[])
const faqs = computed(() => tm(`${base.value}.faq.items`) as FAQItem[])

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
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(softwareApplicationSchema(t(`${base.value}.meta.description`))),
      },
      { type: 'application/ld+json', innerHTML: JSON.stringify(faqSchema(faqs.value)) },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(howToSchema(t(`${base.value}.howItWorks.title`), steps.value)),
      },
    ],
  }))
)
</script>

<template>
  <MarketingLayout>
    <HeroSection
      :badge="t(`${base}.hero.badge`)"
      :title="t(`${base}.hero.title`)"
      :subtitle="t(`${base}.hero.subtitle`)"
      :cta="t(`${base}.finalCta.cta`)"
    />
    <ResultShowcase
      :eyebrow="t(`${base}.showcase.eyebrow`)"
      :title="t(`${base}.showcase.title`)"
      :intro="t(`${base}.showcase.intro`)"
      :bullets="bullets"
    >
      <OutputPreview
        :kind="key"
        :file-name="t(`${base}.sample.fileName`)"
        :label="t(`${base}.sample.label`)"
        :lines="sample"
      />
    </ResultShowcase>
    <HowItWorks
      :eyebrow="t(`${base}.howItWorks.eyebrow`)"
      :title="t(`${base}.howItWorks.title`)"
      :intro="t(`${base}.howItWorks.intro`)"
      :steps="steps"
    />
    <UseCases :eyebrow="t(`${base}.useCases.eyebrow`)" :title="t(`${base}.useCases.title`)" :items="useCases" />
    <FAQ
      :eyebrow="t('home.faq.eyebrow')"
      :title="t(`${base}.faq.title`)"
      :aside="t('home.faq.aside')"
      :contact-label="t('home.faq.contact')"
      :contact-href="`mailto:${SUPPORT_EMAIL}`"
      :faqs="faqs"
    />
    <FinalCta
      :title="t(`${base}.finalCta.title`)"
      :subtitle="t(`${base}.finalCta.subtitle`)"
      :cta="t(`${base}.finalCta.cta`)"
      href="#start"
    />
  </MarketingLayout>
</template>
