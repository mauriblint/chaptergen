<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Logo from '../ui/Logo.vue'
import UserMenu from './UserMenu.vue'
import { isAppPath, localizedPath, LOCALE_STORAGE_KEY, type Locale } from '../../i18n/routing'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const { t, locale } = useI18n()
const menuOpen = ref(false)
const { user, ensureLoaded, updateLocale } = useAuth()

onMounted(() => {
  void ensureLoaded()
})

const homePath = computed(() => localizedPath('/', locale.value as Locale))
const logoPath = computed(() => (user.value ? '/dashboard' : homePath.value))
const podcastPath = computed(() => localizedPath('/podcast-chapters', locale.value as Locale))
const pricingPath = computed(() => localizedPath('/pricing', locale.value as Locale))
const onApp = computed(() => isAppPath(route.path))
const loggedIn = computed(() => !!user.value)

function navHref(hash: string) {
  if (route.path === homePath.value) return hash
  return `${homePath.value}${hash}`
}

const startHref = computed(() => navHref('#start'))

const otherLocale = computed<Locale>(() => (locale.value === 'es' ? 'en' : 'es'))
const switchPath = computed(() => localizedPath(route.path, otherLocale.value))

async function switchLanguage() {
  const next = otherLocale.value
  if (onApp.value && user.value) {
    await updateLocale(next)
  }
  locale.value = next
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
  } catch {
    // ignore
  }
}

async function onMarketingLang() {
  if (user.value) await updateLocale(otherLocale.value)
}
</script>

<template>
  <header class="site-header">
    <div v-if="loggedIn" class="header-inner header-inner--app">
      <RouterLink to="/dashboard" class="logo-link" aria-label="ChapterGen">
        <Logo />
      </RouterLink>

      <RouterLink to="/dashboard" class="nav-center">{{ t('common.nav.myChapters') }}</RouterLink>

      <div class="header-right">
        <RouterLink :to="pricingPath" class="btn btn-ink buy-credits">{{ t('common.nav.buyCredits') }}</RouterLink>
        <UserMenu />
      </div>
    </div>

    <div v-else class="header-inner">
      <div class="header-left">
        <RouterLink :to="logoPath" class="logo-link" :aria-label="t('common.nav.homeLabel')">
          <Logo />
        </RouterLink>

        <nav class="nav-desktop" :aria-label="t('common.nav.mainLabel')">
          <template v-if="!onApp">
            <a :href="navHref('#how')" class="nav-link">{{ t('common.nav.howItWorks') }}</a>
            <a :href="navHref('#use-cases')" class="nav-link">{{ t('common.nav.useCases') }}</a>
            <RouterLink :to="podcastPath" class="nav-link">{{ t('common.nav.podcast') }}</RouterLink>
          </template>
          <RouterLink :to="pricingPath" class="nav-link">{{ t('common.nav.pricing') }}</RouterLink>
          <a v-if="!onApp" :href="navHref('#faq')" class="nav-link">{{ t('common.nav.faq') }}</a>
        </nav>
      </div>

      <div class="header-right">
        <RouterLink
          v-if="!onApp"
          :to="switchPath"
          class="lang-switch"
          :aria-label="t(`common.language.${otherLocale}`)"
          @click="onMarketingLang"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>
          {{ otherLocale.toUpperCase() }}
        </RouterLink>
        <button
          v-else
          type="button"
          class="lang-switch lang-btn"
          :aria-label="t(`common.language.${otherLocale}`)"
          @click="switchLanguage"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>
          {{ otherLocale.toUpperCase() }}
        </button>
        <RouterLink to="/login" class="nav-link login-link">{{ t('common.nav.login') }}</RouterLink>
        <a v-if="!onApp" :href="startHref" class="btn btn-ink header-cta">{{ t('common.nav.tryFree') }}</a>
        <button
          class="menu-toggle"
          :aria-expanded="menuOpen"
          :aria-label="t('common.nav.toggleMenu')"
          @click="menuOpen = !menuOpen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path v-if="menuOpen" d="M6 6l12 12M18 6L6 18" />
            <path v-else d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </div>

    <nav v-if="menuOpen && !loggedIn" class="nav-mobile" :aria-label="t('common.nav.mobileLabel')">
      <template v-if="!onApp">
        <a :href="navHref('#how')" class="nav-link" @click="menuOpen = false">{{ t('common.nav.howItWorks') }}</a>
        <a :href="navHref('#use-cases')" class="nav-link" @click="menuOpen = false">{{ t('common.nav.useCases') }}</a>
        <RouterLink :to="podcastPath" class="nav-link" @click="menuOpen = false">
          {{ t('common.nav.podcast') }}
        </RouterLink>
      </template>
      <RouterLink :to="pricingPath" class="nav-link" @click="menuOpen = false">
        {{ t('common.nav.pricing') }}
      </RouterLink>
      <a v-if="!onApp" :href="navHref('#faq')" class="nav-link" @click="menuOpen = false">{{ t('common.nav.faq') }}</a>
      <RouterLink
        v-if="!onApp"
        :to="switchPath"
        class="nav-link"
        @click="onMarketingLang(); menuOpen = false"
      >
        {{ t(`common.language.${otherLocale}`) }}
      </RouterLink>
      <button
        v-else
        type="button"
        class="nav-link lang-btn"
        @click="switchLanguage(); menuOpen = false"
      >
        {{ t(`common.language.${otherLocale}`) }}
      </button>
      <a v-if="!onApp" :href="startHref" class="btn btn-ink" @click="menuOpen = false">{{ t('common.nav.tryFree') }}</a>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(247, 246, 242, 0.88);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 1280px;
  height: 72px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.header-inner--app {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.logo-link {
  display: flex;
  align-items: center;
  justify-self: start;
}

.nav-center {
  justify-self: center;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
}

.nav-center:hover,
.nav-center.router-link-active {
  color: var(--text);
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text);
  transition: color 0.15s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--accent);
}

.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 44px;
  padding: 0 0.6rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
}

.lang-switch:hover {
  color: var(--text);
}

.lang-btn {
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.login-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 0.6rem;
}

.header-right {
  display: flex;
  align-items: center;
  justify-self: end;
  justify-content: flex-end;
  gap: 0.5rem;
}

.buy-credits {
  min-height: 38px;
  font-size: 0.875rem;
}

.menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
}

.nav-mobile {
  display: none;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 1rem 1rem;
  border-top: 1px solid var(--border);
}

.nav-mobile .nav-link {
  display: flex;
  align-items: center;
  min-height: 44px;
  font-size: 1rem;
}

.nav-mobile .btn {
  margin-top: 0.5rem;
}

@media (max-width: 960px) {
  .nav-desktop,
  .header-cta,
  .lang-switch {
    display: none;
  }

  .menu-toggle {
    display: inline-flex;
  }

  .nav-mobile {
    display: flex;
  }

  .header-inner {
    padding: 0 1rem;
    height: 64px;
  }

  .header-inner--app {
    grid-template-columns: auto 1fr auto;
    gap: 0.75rem;
  }

  .nav-center {
    font-size: 0.85rem;
  }
}
</style>
