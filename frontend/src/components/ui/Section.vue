<script setup lang="ts">
defineProps<{
  id?: string
  alt?: boolean
  dark?: boolean
  narrow?: boolean
}>()
</script>

<template>
  <section :id="id" class="section" :class="{ alt, dark }">
    <div class="section-inner" :class="{ narrow }">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 6.5rem 1.5rem;
}

.section.alt {
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.section.dark {
  margin: 0 1rem;
  padding: 6rem 1.5rem;
  border-radius: 32px;
  background: var(--ink);
  color: var(--on-ink);
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.section-inner.narrow {
  max-width: 820px;
}

@media (min-width: 1024px) {
  .section {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }

  .section.dark {
    margin: 0 2rem;
    padding: 6.5rem 3rem;
  }
}

@media (max-width: 640px) {
  .section {
    padding: 4rem 1rem;
  }

  .section.dark {
    margin: 0 0.75rem;
    padding: 3.5rem 1.25rem;
    border-radius: 24px;
  }
}
</style>
