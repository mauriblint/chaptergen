import { isAudioFile } from './media'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export const GA4_MEASUREMENT_ID = 'G-06FKFB597H'

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag(...args)
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  gtag('event', eventName, params)
}

export function trackChapterGenerated(options: {
  fileName: string
  chapterCount: number
  autoMode: boolean
  isRefine: boolean
}) {
  trackEvent(options.isRefine ? 'refine_chapters' : 'generate_chapters', {
    chapter_count: options.chapterCount,
    auto_mode: options.autoMode,
    media_type: isAudioFile(options.fileName) ? 'audio' : 'video',
  })
}
