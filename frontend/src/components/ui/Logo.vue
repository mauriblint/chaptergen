<script setup lang="ts">
withDefaults(
  defineProps<{
    showText?: boolean
    size?: number
    inverted?: boolean
  }>(),
  { showText: true, size: 32, inverted: false }
)
</script>

<template>
  <div class="logo" :class="{ inverted }">
    <svg
      class="logo-mark"
      :width="size"
      :height="size"
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" :fill="inverted ? '#FFFFFF' : '#111318'" />
      <path d="M16 10.5 L26.5 17 L16 23.5 Z" :fill="inverted ? '#111318' : '#FFFFFF'" />
      <rect x="7" y="28.5" width="10" height="3.5" rx="1.75" fill="#6366F1" />
      <rect x="19" y="28.5" width="6" height="3.5" rx="1.75" fill="#6366F1" />
      <rect
        x="27"
        y="28.5"
        width="6"
        height="3.5"
        rx="1.75"
        :fill="inverted ? '#111318' : '#FFFFFF'"
        :fill-opacity="inverted ? 0.25 : 0.3"
      />
      <circle
        cx="25"
        cy="30.25"
        r="3.4"
        :fill="inverted ? '#111318' : '#FFFFFF'"
        :stroke="inverted ? '#FFFFFF' : '#111318'"
        stroke-width="1.6"
      />
    </svg>
    <span v-if="showText" class="logo-text">chapter<span class="logo-accent">gen</span></span>
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
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1;
  color: var(--text);
}

.logo-accent {
  color: var(--accent);
}

.inverted .logo-text {
  color: var(--on-ink);
}

.inverted .logo-accent {
  color: var(--accent-on-ink);
}
</style>
