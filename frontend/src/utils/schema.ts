import { SITE_URL, SUPPORT_EMAIL, type FAQItem } from '../content/home'

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

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'ChapterGen',
    url: SITE_URL,
    logo: `${SITE_URL}/android-chrome-512x512.png`,
    email: SUPPORT_EMAIL,
  }
}

export function softwareApplicationSchema(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ChapterGen',
    url: SITE_URL,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires a modern web browser',
    description,
    publisher: { '@id': `${SITE_URL}/#organization` },
    offers: [
      { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Starter (5 videos)', price: '5', priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Creator (15 videos)', price: '12', priceCurrency: 'USD' },
    ],
  }
}

export function howToSchema(name: string, steps: { title: string; description: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
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
