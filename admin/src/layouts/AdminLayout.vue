<script setup lang="ts">
import AdminHeader from '../components/AdminHeader.vue'
</script>

<template>
  <div class="min-h-screen">
    <AdminHeader />
    <main class="mx-auto max-w-7xl px-4 py-5 sm:px-6">
      <RouterView />
    </main>
  </div>
</template>
