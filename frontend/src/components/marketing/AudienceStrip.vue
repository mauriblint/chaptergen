<script setup lang="ts">
defineProps<{
  label: string
  items: string[]
}>()
</script>

<template>
  <div class="strip-wrap">
    <div class="strip">
      <span class="label">{{ label }}</span>
      <ul class="items">
        <li v-for="item in items" :key="item">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.strip-wrap {
  padding: 0 1.5rem;
}

.strip {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem 2rem;
  font-size: 0.95rem;
}

.label {
  font-weight: 600;
}

.items {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0;
  color: var(--text-muted);
}

.items li + li::before {
  content: '/';
  margin: 0 1rem;
  color: #c9cad2;
}

@media (min-width: 1024px) {
  .strip-wrap {
    padding: 0 2.5rem;
  }
}

@media (max-width: 640px) {
  .strip-wrap {
    padding: 0 1rem;
  }

  .items li + li::before {
    margin: 0 0.6rem;
  }
}
</style>
