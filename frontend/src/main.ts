import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'
import { routes } from './router'
import { createI18nInstance, setLocale } from './i18n'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, isLocale, localeFromPath } from './i18n/routing'

export const createApp = ViteSSG(App, { routes }, ({ app, router, isClient }) => {
  const i18n = createI18nInstance()
  app.use(i18n)

  router.beforeEach((to) => {
    const routeLocale = to.meta.locale
    const locale = isLocale(routeLocale) ? routeLocale : localeFromPath(to.path)
    setLocale(i18n, locale)

    if (isClient) {
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, locale)
      } catch {
        // ignore storage errors (private mode, etc.)
      }
    }
  })

  if (isClient) {
    let redirected = false
    router.beforeEach((to) => {
      if (redirected) return true
      redirected = true

      if (to.path !== '/') return true

      let stored: string | null = null
      try {
        stored = localStorage.getItem(LOCALE_STORAGE_KEY)
      } catch {
        stored = null
      }

      const preferred =
        stored ?? (navigator.language?.toLowerCase().startsWith('es') ? 'es' : DEFAULT_LOCALE)

      if (preferred === 'es') return '/es'
      return true
    })
  }
})
