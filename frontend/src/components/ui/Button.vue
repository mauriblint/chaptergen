<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'link'
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}>()
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : (type ?? 'button')"
    :disabled="disabled"
    class="btn"
    :class="[`btn-${variant ?? 'primary'}`]"
  >
    <slot />
    <svg
      v-if="variant === 'primary' || variant === 'link'"
      class="btn-arrow"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: var(--radius);
  cursor: pointer;
  transition: opacity 0.2s, background 0.2s, border-color 0.2s;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 0.65rem 1.25rem;
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--accent);
}

.btn-link {
  background: transparent;
  color: var(--accent);
  border: none;
  padding: 0;
  font-weight: 500;
}

.btn-link:hover:not(:disabled) {
  opacity: 0.8;
}

.btn-arrow {
  flex-shrink: 0;
}
</style>
