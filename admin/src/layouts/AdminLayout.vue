<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()
const menuOpen = ref(false)

const SITE_URL = 'https://chaptergen.com'

const nav = [
  { to: '/overview', label: 'Overview', icon: 'M4 13h4v7H4zM10 4h4v16h-4zM16 9h4v11h-4z' },
  { to: '/users', label: 'Users', icon: 'M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M21 19v-1a4 4 0 0 0-3-3.87M15.5 4.13a3 3 0 0 1 0 5.74' },
  { to: '/jobs', label: 'Jobs', icon: 'M4 5h16v14H4zM10 9.5l4.5 2.5-4.5 2.5z' },
  { to: '/payments', label: 'Payments', icon: 'M3 6h18v12H3zM3 10h18M7 15h3' },
]

function isActive(to: string): boolean {
  return route.path === to || route.path.startsWith(`${to}/`)
}

function handleLogout() {
  logout()
  void router.push({ name: 'login' })
}

watch(() => route.path, () => (menuOpen.value = false))
</script>

<template>
  <div class="min-h-screen lg:pl-60">
    <!-- Mobile top bar -->
    <div class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
      <div class="flex items-center gap-2">
        <img src="/logo.svg" alt="" width="26" height="26" />
        <span class="font-display text-[1.05rem] font-extrabold tracking-tight">chapter<span class="text-primary">gen</span></span>
      </div>
      <button type="button" class="btn btn-outline h-9 px-2.5" aria-label="Menu" @click="menuOpen = !menuOpen">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
    </div>

    <div v-if="menuOpen" class="fixed inset-0 z-30 bg-ink/40 lg:hidden" @click="menuOpen = false" />

    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-surface px-3 py-5 max-lg:transition-transform lg:translate-x-0"
      :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="mb-7 flex items-center gap-2.5 px-2">
        <img src="/logo.svg" alt="" width="30" height="30" />
        <span class="font-display text-[1.2rem] font-extrabold tracking-tight">chapter<span class="text-primary">gen</span></span>
        <span class="ml-auto rounded-md bg-primary-soft px-1.5 py-0.5 text-[0.7rem] font-semibold text-primary">Admin</span>
      </div>

      <nav class="flex flex-col gap-0.5">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex h-9 items-center gap-3 rounded-xl px-3 text-sm font-medium transition"
          :class="isActive(item.to) ? 'bg-bg text-text' : 'text-muted hover:bg-bg hover:text-text'"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="item.icon" /></svg>
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="mt-auto flex flex-col gap-0.5">
        <a
          :href="SITE_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-9 items-center gap-3 rounded-xl px-3 text-sm text-muted transition hover:bg-bg hover:text-text"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5" /></svg>
          Open site
        </a>
        <button
          type="button"
          class="flex h-9 items-center gap-3 rounded-xl px-3 text-left text-sm text-muted transition hover:bg-bg hover:text-text"
          @click="handleLogout"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" /></svg>
          Log out
        </button>
      </div>
    </aside>

    <main class="mx-auto max-w-[1240px] px-4 py-6 sm:px-8 sm:py-8">
      <RouterView />
    </main>
  </div>
</template>
