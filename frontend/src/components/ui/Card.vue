<script setup lang="ts">
defineProps<{
  shadow?: 'sm' | 'lg' | 'none'
}>()
</script>

<template>
  <div class="card" :class="[`shadow-${shadow ?? 'sm'}`]">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
}

.shadow-sm {
  box-shadow: var(--shadow-sm);
}

.shadow-lg {
  box-shadow: var(--shadow-lg);
}

.shadow-none {
  box-shadow: none;
}
</style>
