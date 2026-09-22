import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'
import { routes } from './router'
import { createI18nInstance, setLocale } from './i18n'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, isAppPath, isLocale, localeFromPath } from './i18n/routing'
import { useAuth } from './composables/useAuth'
import { initMixpanel, trackPageView } from './utils/analytics'

export const createApp = ViteSSG(App, { routes }, ({ app, router, isClient }) => {
  const i18n = createI18nInstance()
  app.use(i18n)

  router.beforeEach((to) => {
    if (isAppPath(to.path)) {
      if (isClient) {
        try {
          const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
          if (isLocale(stored)) setLocale(i18n, stored)
        } catch {
          // ignore
        }
      }
      return
    }

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
    initMixpanel()
    const { ensureLoaded } = useAuth()

    router.beforeEach(async (to) => {
      const me = await ensureLoaded()
      const loggedIn = !!me.user
      const claimingCheckout =
        to.path === '/dashboard' &&
        typeof to.query.session_id === 'string' &&
        to.query.session_id.length > 0

      if (to.meta.requiresAuth && !loggedIn && !claimingCheckout) {
        return '/login'
      }

      if (loggedIn && (to.path === '/' || to.path === '/es')) {
        return '/dashboard'
      }

      if (loggedIn && to.path === '/login' && !to.query.token) {
        return '/dashboard'
      }

      return true
    })

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

    router.afterEach((to) => {
      trackPageView(to.fullPath)
    })
  }
})
