<script setup lang="ts">
withDefaults(
  defineProps<{
    showText?: boolean
  }>(),
  { showText: true }
)
</script>

<template>
  <div class="logo">
    <img src="/logo.svg" alt="" class="logo-mark" width="28" height="28" aria-hidden="true" />
    <span v-if="showText" class="logo-text">ChapterGen</span>
  </div>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.logo-mark {
  display: block;
  flex-shrink: 0;
}

.logo-text {
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
}
</style>
