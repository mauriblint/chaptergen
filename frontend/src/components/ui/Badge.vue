<template>
  <span class="badge">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--muted, var(--text-muted));
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
}
</style>
