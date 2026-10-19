<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../../composables/useAuth'

const { t } = useI18n()
const router = useRouter()
const { user, logout } = useAuth()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

const initial = computed(() => user.value?.email.charAt(0).toUpperCase() ?? '?')

function close() {
  open.value = false
}

function onDocumentPointer(event: PointerEvent) {
  if (open.value && !root.value?.contains(event.target as Node)) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointer)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointer)
  document.removeEventListener('keydown', onKeydown)
})

function onSupport() {
  close()
  void router.push('/support')
}

async function onLogout() {
  close()
  await logout()
  await router.push('/')
}
</script>

<template>
  <div v-if="user" ref="root" class="account">
    <button
      type="button"
      class="trigger"
      :class="{ open }"
      :aria-expanded="open"
      aria-haspopup="menu"
      :aria-label="t('app.account.menu')"
      @click="open = !open"
    >
      <span class="avatar" aria-hidden="true">{{ initial }}</span>
      <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
    </button>

    <div v-if="open" class="menu" role="menu">
      <div class="who">
        <span class="email">{{ user.email }}</span>
      </div>
      <RouterLink to="/billing" role="menuitem" class="item" @click="close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18v12H3zM3 10h18" /></svg>
        {{ t('app.nav.billing') }}
      </RouterLink>
      <RouterLink to="/settings" role="menuitem" class="item" @click="close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>
        {{ t('app.nav.settings') }}
      </RouterLink>
      <button type="button" role="menuitem" class="item" @click="onSupport">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2.2-2.4 3.7M12 17h.01" /></svg>
        {{ t('app.nav.support') }}
      </button>
      <div class="sep" role="separator" />
      <button type="button" role="menuitem" class="item" @click="onLogout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" /></svg>
        {{ t('app.account.logout') }}
      </button>
    </div>

  </div>
</template>

<style scoped>
.account {
  position: relative;
}

.trigger {
  height: 40px;
  padding: 0 6px 0 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
}

.trigger:hover,
.trigger.open {
  border-color: var(--border);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #dcd8ff;
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
}

.menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 40;
  width: 260px;
  padding: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(17, 19, 24, 0.14);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.who {
  padding: 10px 10px 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--border);
}

.email {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item {
  min-height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.item:hover {
  background: var(--bg);
}

.sep {
  height: 1px;
  margin: 4px 0;
  background: var(--border);
}
</style>
