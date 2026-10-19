<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Logo from '../ui/Logo.vue'
import AccountMenu from '../app/AccountMenu.vue'
import LanguageMenu from './LanguageMenu.vue'
import { localizedPath, type Locale } from '../../i18n/routing'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const { t, locale } = useI18n()
const { user, ensureLoaded } = useAuth()

const menuOpen = ref(false)
const productOpen = ref(false)
const scrolled = ref(false)
const productRoot = ref<HTMLElement | null>(null)

function path(en: string) {
  return localizedPath(en, locale.value as Locale)
}

const homePath = computed(() => path('/'))
const logoPath = computed(() => (user.value ? '/library' : homePath.value))
const pricingPath = computed(() => path('/pricing'))
const loggedIn = computed(() => !!user.value)

function navHref(hash: string) {
  if (route.path === homePath.value) return hash
  return `${homePath.value}${hash}`
}

const productItems = computed(() => [
  {
    to: homePath.value,
    title: t('common.nav.productMenu.youtube.title'),
    description: t('common.nav.productMenu.youtube.description'),
    icon: 'video',
  },
  {
    to: path('/podcast-chapters'),
    title: t('common.nav.productMenu.podcast.title'),
    description: t('common.nav.productMenu.podcast.description'),
    icon: 'mic',
  },
  {
    to: path('/video-to-text'),
    title: t('common.nav.productMenu.transcript.title'),
    description: t('common.nav.productMenu.transcript.description'),
    icon: 'list',
  },
  {
    to: path('/subtitle-generator'),
    title: t('common.nav.productMenu.subtitles.title'),
    description: t('common.nav.productMenu.subtitles.description'),
    icon: 'captions',
  },
])

// Border only appears once the page has scrolled, so the header blends into
// the hero at the top.
function onScroll() {
  scrolled.value = window.scrollY > 4
}

function onDocumentPointer(e: PointerEvent) {
  if (productOpen.value && productRoot.value && !productRoot.value.contains(e.target as Node)) {
    productOpen.value = false
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  productOpen.value = false
  menuOpen.value = false
}

function closeAll() {
  productOpen.value = false
  menuOpen.value = false
}

watch(() => route.fullPath, closeAll)

onMounted(() => {
  void ensureLoaded()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('pointerdown', onDocumentPointer)
  document.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('pointerdown', onDocumentPointer)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header class="site-header" :class="{ scrolled: scrolled || menuOpen }">
    <div v-if="loggedIn" class="header-inner header-inner--app">
      <RouterLink :to="homePath" class="logo-link" aria-label="ChapterGen">
        <Logo />
      </RouterLink>

      <span />

      <div class="header-right">
        <RouterLink to="/library" class="btn btn-ink buy-credits">{{ t('app.nav.openLibrary') }}</RouterLink>
        <AccountMenu />
      </div>
    </div>

    <div v-else class="header-inner">
      <RouterLink :to="logoPath" class="logo-link" :aria-label="t('common.nav.homeLabel')">
        <Logo />
      </RouterLink>

      <nav class="nav-desktop" :aria-label="t('common.nav.mainLabel')">
        <div ref="productRoot" class="product">
          <button
            type="button"
            class="nav-item product-trigger"
            :class="{ active: productOpen }"
            :aria-expanded="productOpen"
            aria-haspopup="true"
            @click="productOpen = !productOpen"
          >
            {{ t('common.nav.product') }}
            <svg class="chevron" :class="{ up: productOpen }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </button>

          <div v-if="productOpen" class="product-panel">
            <RouterLink
              v-for="item in productItems"
              :key="item.title"
              :to="item.to"
              class="product-item"
              @click="productOpen = false"
            >
              <span class="product-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                  <template v-if="item.icon === 'video'"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9.5l4.5 2.5-4.5 2.5z" /></template>
                  <template v-else-if="item.icon === 'mic'"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></template>
                  <template v-else-if="item.icon === 'list'"><path d="M4 6h16M4 12h10M4 18h13" /></template>
                  <template v-else><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M7 15h4M13 15h4M7 11h10" /></template>
                </svg>
              </span>
              <span class="product-copy">
                <span class="product-title">{{ item.title }}</span>
                <span class="product-desc">{{ item.description }}</span>
              </span>
            </RouterLink>
          </div>
        </div>
        <RouterLink :to="pricingPath" class="nav-item">{{ t('common.nav.pricing') }}</RouterLink>
      </nav>

      <div class="header-right">
        <LanguageMenu class="desktop-only" />
        <span class="divider desktop-only" aria-hidden="true" />
        <RouterLink to="/login" class="nav-item login-link desktop-only">{{ t('common.nav.login') }}</RouterLink>
        <a :href="navHref('#start')" class="btn btn-ink header-cta">
          <span class="cta-long">{{ t('common.nav.tryFree') }}</span>
          <span class="cta-short">{{ t('common.nav.tryFreeShort') }}</span>
        </a>
        <button
          class="menu-toggle"
          :aria-expanded="menuOpen"
          :aria-label="menuOpen ? t('common.nav.closeMenu') : t('common.nav.openMenu')"
          @click="menuOpen = !menuOpen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path v-if="menuOpen" d="M6 6l12 12M18 6L6 18" />
            <path v-else d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Teleported: the header's backdrop-filter would otherwise trap this fixed panel. -->
    <Teleport to="body">
    <nav v-if="menuOpen && !loggedIn" class="nav-mobile" :aria-label="t('common.nav.mobileLabel')">
      <div class="mobile-group">
        <p class="mobile-label mono">{{ t('common.nav.product') }}</p>
        <RouterLink
          v-for="item in productItems"
          :key="item.title"
          :to="item.to"
          class="mobile-product"
          @click="menuOpen = false"
        >
          <span class="product-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="item.icon === 'video'"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9.5l4.5 2.5-4.5 2.5z" /></template>
              <template v-else-if="item.icon === 'mic'"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></template>
              <template v-else-if="item.icon === 'list'"><path d="M4 6h16M4 12h10M4 18h13" /></template>
              <template v-else><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M7 15h4M13 15h4M7 11h10" /></template>
            </svg>
          </span>
          {{ item.title }}
        </RouterLink>
      </div>

      <div class="mobile-list">
        <RouterLink :to="pricingPath" class="mobile-row" @click="menuOpen = false">{{ t('common.nav.pricing') }}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg></RouterLink>
      </div>

      <div class="mobile-group">
        <p class="mobile-label mono">{{ t('common.language.label') }}</p>
        <LanguageMenu variant="segmented" @change="menuOpen = false" />
      </div>

      <div class="mobile-actions">
        <RouterLink to="/login" class="btn btn-outline-soft" @click="menuOpen = false">{{ t('common.nav.login') }}</RouterLink>
        <a :href="navHref('#start')" class="btn btn-ink" @click="menuOpen = false">{{ t('common.nav.tryFreeMobile') }}</a>
      </div>
    </nav>
    </Teleport>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  /* See-through at the top so the hero glow shows behind it; solid once scrolled. */
  background: rgba(255, 255, 255, 0);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.site-header.scrolled {
  background: rgba(255, 255, 255, 0.92);
  border-bottom-color: var(--border);
  box-shadow: 0 1px 12px rgba(17, 19, 24, 0.04);
}

.header-inner {
  max-width: 1248px;
  height: 72px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.5rem;
}

.logo-link {
  display: flex;
  align-items: center;
  justify-self: start;
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-item {
  height: 40px;
  padding: 0 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover,
.nav-item.active {
  background: var(--bg);
}

.nav-item.router-link-exact-active:not(.login-link) {
  color: var(--accent);
}

.chevron {
  color: var(--text-muted);
  transition: transform 0.15s;
}

.chevron.up {
  transform: rotate(180deg);
}

.product {
  position: relative;
}

.product-panel {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  width: 660px;
  padding: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(17, 19, 24, 0.12);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px;
}

.product-item {
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 12px;
  transition: background 0.15s;
}

.product-item:hover {
  background: var(--bg);
}

.product-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-icon.muted {
  background: var(--bg);
  color: var(--text);
}

.product-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.product-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.product-desc {
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--text-muted);
}

.header-right {
  display: flex;
  align-items: center;
  justify-self: end;
  justify-content: flex-end;
  gap: 0.6rem;
}

.divider {
  width: 1px;
  height: 22px;
  background: var(--border);
}

.header-cta {
  min-height: 40px;
  padding: 0 1.1rem;
  border-radius: 10px;
}

.cta-short {
  display: none;
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
  position: fixed;
  z-index: 49;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  background: var(--surface);
  padding: 1.25rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-label {
  padding: 0 0.25rem 0.4rem;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.mobile-product {
  min-height: 56px;
  padding: 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
}

.mobile-product .product-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
}

.mobile-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border-soft);
}

.mobile-row {
  min-height: 52px;
  padding: 0 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-soft);
  font-size: 1rem;
  font-weight: 500;
}

.mobile-row svg {
  color: var(--text-muted);
}

.mobile-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.mobile-actions .btn {
  min-height: 52px;
  font-size: 1rem;
}

.btn-outline-soft {
  border-color: var(--border);
  background: var(--surface);
  color: var(--text);
}

@media (max-width: 1080px) {
  .nav-desktop,
  .desktop-only {
    display: none;
  }

  .header-inner:not(.header-inner--app) {
    grid-template-columns: 1fr auto;
  }

  .menu-toggle {
    display: inline-flex;
  }
}

@media (max-width: 960px) {
  .header-inner {
    padding: 0 1rem;
    height: 64px;
  }

  .header-inner--app {
    grid-template-columns: auto 1fr auto;
    gap: 0.75rem;
  }

  .cta-long {
    display: none;
  }

  .cta-short {
    display: inline;
  }
}

@media (min-width: 961px) and (max-width: 1080px) {
  .nav-mobile {
    top: 72px;
  }
}
</style>
