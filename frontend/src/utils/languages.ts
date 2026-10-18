import { ref, watch } from 'vue'

/**
 * Languages offered in the "Audio language" selector, as ISO-639-1 codes
 * mapped to the English name Whisper reports back. Must match the backend list
 * (backend/src/utils/languages.ts); anything else is left to auto-detect.
 */
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

/** ISO code for a language Whisper reported as a name ("spanish") or a code. */
export function languageCode(reported: string | null | undefined): string | null {
  if (!reported) return null
  const value = reported.trim().toLowerCase()
  if (value in AUDIO_LANGUAGES) return value
  return Object.keys(AUDIO_LANGUAGES).find((code) => AUDIO_LANGUAGES[code] === value) ?? null
}

/** The selector options, named in the UI language and sorted by that name. */
export function languageOptions(locale: string): { code: string; name: string }[] {
  let names: Intl.DisplayNames | null = null
  try {
    names = new Intl.DisplayNames([locale], { type: 'language' })
  } catch {
    names = null
  }
  return Object.keys(AUDIO_LANGUAGES)
    .map((code) => {
      const name = names?.of(code) ?? AUDIO_LANGUAGES[code]!
      return { code, name: name.charAt(0).toUpperCase() + name.slice(1) }
    })
    .sort((a, b) => a.name.localeCompare(b.name, locale))
}

const STORAGE_KEY = 'chaptergen_audio_language'

function readStored(): string {
  try {
    const value = localStorage.getItem(STORAGE_KEY) ?? ''
    return value in AUDIO_LANGUAGES ? value : ''
  } catch {
    return ''
  }
}

// '' means auto-detect. Shared by every upload entry point and remembered,
// since most people always upload in the same language.
const audioLanguage = ref('')
let loaded = false

watch(audioLanguage, (value) => {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, value)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable: the choice lasts for this visit only.
  }
})

export function useAudioLanguage() {
  return audioLanguage
}

/** Call from onMounted: prerendered pages start on auto-detect, then pick up the saved choice. */
export function restoreAudioLanguage(): void {
  if (loaded) return
  loaded = true
  audioLanguage.value = readStored()
}
