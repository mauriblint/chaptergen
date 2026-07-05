<script setup lang="ts">
defineProps<{
  id?: string
  alt?: boolean
}>()
</script>

<template>
  <section :id="id" class="section" :class="{ alt }">
    <div class="section-inner">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 4rem 1.5rem;
}

.section.alt {
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.section-inner {
  max-width: 960px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .section {
    padding: 3rem 1.25rem;
  }
}
</style>
