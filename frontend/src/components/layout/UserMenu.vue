<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../../composables/useAuth'
import { userAvatarUrl } from '../../utils/avatar'

const { t } = useI18n()
const router = useRouter()
const { user, logout } = useAuth()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

function close() {
  open.value = false
}

function toggle() {
  open.value = !open.value
}

function onDocumentClick(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})

async function onLogout() {
  close()
  await logout()
  await router.push('/')
}
</script>

<template>
  <div v-if="user" ref="root" class="user-menu">
    <button
      type="button"
      class="avatar-btn"
      :aria-expanded="open"
      aria-haspopup="menu"
      :aria-label="t('common.nav.accountMenu')"
      @click.stop="toggle"
    >
      <img
        class="avatar"
        :src="userAvatarUrl(user)"
        :alt="user.email"
        width="32"
        height="32"
      />
    </button>

    <div v-if="open" class="dropdown" role="menu">
      <p class="email">{{ user.email }}</p>
      <RouterLink to="/settings" role="menuitem" class="item" @click="close">
        {{ t('common.nav.settings') }}
      </RouterLink>
      <RouterLink to="/billing" role="menuitem" class="item" @click="close">
        {{ t('common.nav.billing') }}
      </RouterLink>
      <div class="sep" role="separator" />
      <button type="button" role="menuitem" class="item logout" @click="onLogout">
        {{ t('common.nav.logout') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-menu {
  position: relative;
}

.avatar-btn {
  display: flex;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  line-height: 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  min-width: 220px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  padding: 0.4rem 0;
  z-index: 80;
}

.email {
  padding: 0.45rem 0.9rem 0.65rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0.5rem 0.9rem;
  font: inherit;
  font-size: 0.9rem;
  color: var(--text);
  cursor: pointer;
}

.item:hover,
.item.router-link-active {
  background: var(--bg);
}

.sep {
  height: 1px;
  background: var(--border);
  margin: 0.35rem 0;
}

.logout {
  color: #dc2626;
}
</style>
