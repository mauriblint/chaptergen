<script setup lang="ts">
import SiteHeader from '../components/layout/SiteHeader.vue'
import SiteFooter from '../components/layout/SiteFooter.vue'
import { useAuth } from '../composables/useAuth'

const { user } = useAuth()
</script>

<template>
  <div class="layout">
    <SiteHeader />
    <main id="main-content" class="layout-main">
      <slot />
    </main>
    <SiteFooter v-if="!user" />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-main {
  flex: 1;
}
</style>
