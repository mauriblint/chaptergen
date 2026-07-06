<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Logo from '../ui/Logo.vue'
import { localizedPath, type Locale } from '../../i18n/routing'

const route = useRoute()
const { t, locale } = useI18n()
const menuOpen = ref(false)

const navLinks = computed(() => [
  { label: t('common.nav.features'), hash: '#features' },
  { label: t('common.nav.useCases'), hash: '#use-cases' },
  { label: t('common.nav.faq'), hash: '#faq' },
])

const homePath = computed(() => localizedPath('/', locale.value as Locale))
const podcastPath = computed(() => localizedPath('/podcast-chapters', locale.value as Locale))

function navHref(hash: string) {
  if (route.path === homePath.value) return hash
  return `${homePath.value}${hash}`
}

const otherLocale = computed<Locale>(() => (locale.value === 'es' ? 'en' : 'es'))
const switchPath = computed(() => localizedPath(route.path, otherLocale.value))
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink :to="homePath" class="logo-link" aria-label="ChapterGen home">
        <Logo />
      </RouterLink>

      <nav class="nav-desktop" aria-label="Main navigation">
        <a v-for="link in navLinks" :key="link.hash" :href="navHref(link.hash)" class="nav-link">
          {{ link.label }}
        </a>
        <RouterLink :to="podcastPath" class="nav-link">{{ t('common.nav.podcast') }}</RouterLink>
        <RouterLink :to="switchPath" class="nav-link lang-switch">
          {{ t(`common.language.${otherLocale}`) }}
        </RouterLink>
      </nav>

      <button
        class="menu-toggle"
        :aria-expanded="menuOpen"
        aria-label="Toggle menu"
        @click="menuOpen = !menuOpen"
      >
        <span class="menu-bar" />
        <span class="menu-bar" />
        <span class="menu-bar" />
      </button>
    </div>

    <nav v-if="menuOpen" class="nav-mobile" aria-label="Mobile navigation">
      <a
        v-for="link in navLinks"
        :key="link.hash"
        :href="navHref(link.hash)"
        class="nav-link"
        @click="menuOpen = false"
      >
        {{ link.label }}
      </a>
      <RouterLink :to="podcastPath" class="nav-link" @click="menuOpen = false">
        {{ t('common.nav.podcast') }}
      </RouterLink>
      <RouterLink :to="switchPath" class="nav-link lang-switch" @click="menuOpen = false">
        {{ t(`common.language.${otherLocale}`) }}
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(248, 250, 252, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  display: flex;
  align-items: center;
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.nav-link {
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text);
}

.lang-switch {
  font-weight: 600;
  color: var(--accent);
}

.lang-switch:hover {
  opacity: 0.8;
  color: var(--accent);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.menu-bar {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text);
  border-radius: 1px;
}

.nav-mobile {
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 1.5rem 1rem;
  border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
  .nav-desktop {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .nav-mobile {
    display: flex;
  }
}
</style>
