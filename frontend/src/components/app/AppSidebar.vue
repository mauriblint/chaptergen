<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Logo from '../ui/Logo.vue'
import LanguageMenu from '../layout/LanguageMenu.vue'

const emit = defineEmits<{ newVideo: []; buyCredits: [] }>()
const { t } = useI18n()

const nav = [
  { to: '/library', key: 'library', icon: 'M4 5h16v14H4zM4 9h16M9 9v10' },
  { to: '/billing', key: 'billing', icon: 'M3 6h18v12H3zM3 10h18' },
  {
    to: '/settings',
    key: 'settings',
    icon: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.4-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.2-.8.2-1.2z',
  },
]
</script>

<template>
  <aside class="sidebar">
    <RouterLink to="/library" class="logo" :aria-label="t('app.nav.library')">
      <Logo :size="30" />
    </RouterLink>

    <button type="button" class="btn btn-ink new-video" @click="emit('newVideo')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      {{ t('app.nav.newVideo') }}
    </button>

    <nav class="nav" :aria-label="t('app.nav.label')">
      <RouterLink v-for="item in nav" :key="item.key" :to="item.to" class="nav-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="item.icon" /></svg>
        {{ t(`app.nav.${item.key}`) }}
      </RouterLink>
    </nav>

    <div class="bottom">
      <RouterLink to="/support" class="nav-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2.2-2.4 3.7M12 17h.01" /></svg>
        {{ t('app.nav.support') }}
      </RouterLink>
      <LanguageMenu class="language" placement="top" />
      <button type="button" class="buy" @click="emit('buyCredits')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18v12H3zM3 10h18" /></svg>
        {{ t('app.nav.buyCredits') }}
      </button>
    </div>

  </aside>
</template>

<style scoped>
.sidebar {
  width: 248px;
  flex-shrink: 0;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  overflow-y: auto;
}

.logo {
  padding: 0 6px;
  display: flex;
  align-items: center;
  min-height: 32px;
}

.new-video {
  width: 100%;
  min-height: 42px;
  border-radius: 11px;
  font-size: 0.875rem;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  min-height: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #3c3f45;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}

.nav-item:hover {
  background: var(--bg);
  color: var(--text);
}

.nav-item.router-link-active {
  background: var(--bg);
  color: var(--text);
  font-weight: 600;
}

.bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.language :deep(.lang-trigger) {
  width: 100%;
  min-height: 40px;
  height: auto;
  padding: 0 12px;
  gap: 12px;
  border: 0;
  border-radius: 10px;
  color: #3c3f45;
  font-weight: 500;
}

.language :deep(.lang-trigger:hover) {
  background: var(--bg);
}

.language :deep(.lang-trigger .chevron) {
  margin-left: auto;
}

.buy {
  margin-top: 12px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 11px;
  background: var(--accent-soft);
  color: var(--accent);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
}

.buy:hover {
  background: #e3e1fd;
}
</style>
