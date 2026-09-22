<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()

const tabClass = (active: boolean) =>
  [
    'inline-flex h-full items-center border-b-2 px-2.5 transition',
    active ? 'border-primary text-text' : 'border-transparent text-muted hover:text-text',
  ].join(' ')

function handleLogout() {
  logout()
  void router.push({ name: 'login' })
}
</script>

<template>
  <header class="border-b border-border bg-surface">
    <div class="mx-auto flex h-12 max-w-7xl items-center gap-6 px-4 sm:px-6">
      <div class="flex items-center gap-2">
        <img src="/logo.svg" alt="" width="22" height="22" class="block" />
        <span class="text-sm font-semibold tracking-tight text-text">ChapterGen</span>
        <span class="text-xs font-medium text-muted">Admin</span>
      </div>

      <nav class="flex h-full items-center gap-1 text-sm">
        <RouterLink to="/users" :class="tabClass(route.path.startsWith('/users'))">
          Users
        </RouterLink>
        <RouterLink to="/jobs" :class="tabClass(route.path === '/jobs')">
          Jobs
        </RouterLink>
        <RouterLink to="/payments" :class="tabClass(route.path === '/payments')">
          Payments
        </RouterLink>
      </nav>

      <button
        type="button"
        class="ml-auto rounded-md px-2.5 py-1 text-sm text-muted transition hover:bg-bg hover:text-text"
        @click="handleLogout"
      >
        Log out
      </button>
    </div>
  </header>
</template>
