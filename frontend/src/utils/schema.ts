import type { FAQItem } from '../content/home'

export function faqSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ChapterGen',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    description:
      'AI-powered YouTube chapter generator. Upload video or audio and get SEO-ready timestamps instantly.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }
}

export function howToSchema(steps: { title: string; description: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Generate YouTube Chapters with AI',
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
  }
}

export function hreflangLinks(path: string, esPath: string, siteUrl: string) {
  return [
    { rel: 'alternate' as const, hreflang: 'en', href: `${siteUrl}${path}`, type: 'text/html' },
    { rel: 'alternate' as const, hreflang: 'es', href: `${siteUrl}${esPath}`, type: 'text/html' },
    { rel: 'alternate' as const, hreflang: 'x-default', href: `${siteUrl}${path}`, type: 'text/html' },
  ]
}
