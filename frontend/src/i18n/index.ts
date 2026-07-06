import { createI18n, type Composer } from 'vue-i18n'
import en from './locales/en.ts'
import es from './locales/es.ts'
import { DEFAULT_LOCALE, type Locale } from './routing.ts'

export type MessageSchema = typeof en

export type I18nInstance = ReturnType<typeof createI18nInstance>

/**
 * Creates a fresh i18n instance. During SSG each rendered route gets its own
 * instance so the active locale never leaks between concurrently rendered pages.
 */
export function createI18nInstance() {
  return createI18n<[MessageSchema], Locale, false>({
    legacy: false,
    locale: DEFAULT_LOCALE,
    fallbackLocale: 'en',
    messages: { en, es },
  })
}

export function setLocale(i18n: I18nInstance, locale: Locale) {
  ;(i18n.global as unknown as Composer).locale.value = locale
}
