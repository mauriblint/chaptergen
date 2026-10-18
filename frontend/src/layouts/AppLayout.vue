<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Logo from '../components/ui/Logo.vue'
import AppSidebar from '../components/app/AppSidebar.vue'
import CreditsPill from '../components/app/CreditsPill.vue'
import AccountMenu from '../components/app/AccountMenu.vue'
import StartVideoFlow from '../components/app/StartVideoFlow.vue'
import PaywallModal from '../components/PaywallModal.vue'
import { MEDIA_EXTENSIONS } from '../utils/media'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const drawerOpen = ref(false)
const showPaywall = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const flow = ref<InstanceType<typeof StartVideoFlow> | null>(null)

const accept = MEDIA_EXTENSIONS.join(',')

/** "New video" opens the upload screen, which explains what a credit gets you. */
function newVideo() {
  drawerOpen.value = false
  void router.push('/new')
}

function openPicker() {
  drawerOpen.value = false
  fileInput.value?.click()
}

function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (file) void flow.value?.pick(file)
}

function buyCredits() {
  drawerOpen.value = false
  showPaywall.value = true
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') drawerOpen.value = false
}

watch(() => route.fullPath, () => (drawerOpen.value = false))
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

defineExpose({ openPicker, pickFile: (file: File) => flow.value?.pick(file) })
</script>

<template>
  <div class="app">
    <a href="#app-main" class="skip-link">{{ t('app.common.skip') }}</a>
    <AppSidebar class="sidebar-desktop" @new-video="newVideo" @buy-credits="buyCredits" />

    <Transition name="fade">
      <div v-if="drawerOpen" class="drawer-backdrop" @click="drawerOpen = false" />
    </Transition>
    <AppSidebar
      v-if="drawerOpen"
      class="sidebar-drawer"
      @new-video="newVideo"
      @buy-credits="buyCredits"
    />

    <div class="main-col">
      <header class="topbar">
        <div class="topbar-left">
          <button
            type="button"
            class="menu-btn"
            :aria-expanded="drawerOpen"
            :aria-label="t('app.nav.openMenu')"
            @click="drawerOpen = true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <RouterLink to="/library" class="mobile-logo" :aria-label="t('app.nav.library')"><Logo :size="28" :show-text="false" /></RouterLink>
          <CreditsPill @buy="buyCredits" />
        </div>
        <div class="topbar-right">
          <AccountMenu />
        </div>
      </header>

      <main id="app-main" class="content">
        <slot :open-picker="openPicker" />
      </main>
    </div>

    <input ref="fileInput" type="file" :accept="accept" hidden @change="onFile" />
    <StartVideoFlow ref="flow" />
    <PaywallModal v-if="showPaywall" reason="buy" @close="showPaywall = false" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  background: var(--page);
}

.sidebar-desktop {
  position: sticky;
  top: 0;
  height: 100vh;
}

.main-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 64px;
  padding: 0 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.topbar-left {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-btn,
.mobile-logo {
  display: none;
}

.menu-btn {
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
}

.content {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  padding: 2rem 2.5rem 4rem;
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(17, 19, 24, 0.45);
}

.sidebar-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 61;
  box-shadow: 0 20px 60px rgba(17, 19, 24, 0.25);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 960px) {
  .sidebar-desktop {
    display: none;
  }

  .menu-btn {
    display: inline-flex;
  }

  .topbar {
    padding: 0 1rem;
  }

  .content {
    padding: 1.5rem 1rem 3rem;
  }
}

@media (max-width: 640px) {
  .mobile-logo {
    display: flex;
  }
}
</style>
