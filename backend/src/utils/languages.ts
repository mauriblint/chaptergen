// Languages offered in the "Audio language" selector, as ISO-639-1 codes
// (what Whisper's `language` parameter takes) mapped to the English name
// Whisper reports back. Anything else is still handled by auto-detect.
export const AUDIO_LANGUAGES: Record<string, string> = {
  en: 'english',
  es: 'spanish',
  pt: 'portuguese',
  fr: 'french',
  de: 'german',
  it: 'italian',
  nl: 'dutch',
  pl: 'polish',
  ru: 'russian',
  uk: 'ukrainian',
  tr: 'turkish',
  ar: 'arabic',
  hi: 'hindi',
  ja: 'japanese',
  ko: 'korean',
  zh: 'chinese',
  id: 'indonesian',
  vi: 'vietnamese',
  th: 'thai',
  sv: 'swedish',
  da: 'danish',
  no: 'norwegian',
  fi: 'finnish',
  cs: 'czech',
  ro: 'romanian',
  el: 'greek',
  he: 'hebrew',
  hu: 'hungarian',
  ca: 'catalan',
  ms: 'malay',
  tl: 'tagalog',
}

/** A supported ISO code, or null for auto-detect (and anything unknown). */
export function parseAudioLanguage(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const code = value.trim().toLowerCase()
  return code in AUDIO_LANGUAGES ? code : null
}

/** True when a Whisper-reported language ("spanish" or "es") is this code. */
export function isSameLanguage(reported: string | null, code: string): boolean {
  if (!reported) return false
  const value = reported.trim().toLowerCase()
  return value === code || value === AUDIO_LANGUAGES[code]
}
