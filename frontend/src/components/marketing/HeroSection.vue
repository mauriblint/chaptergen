<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

defineProps<{
  badge: string
  title: string
  subtitle: string
  variant?: 'video' | 'audio'
}>()

const ChapterTool = defineAsyncComponent(
  () => import('../tool/ChapterTool.vue')
)
</script>

<template>
  <section id="start" class="hero">
    <div class="hero-inner">
      <span class="hero-badge">{{ badge }}</span>
      <h1 class="hero-title">{{ title }}</h1>
      <p class="hero-subtitle">{{ subtitle }}</p>
      <div class="hero-tool">
        <ChapterTool :variant="variant ?? 'video'" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 4.5rem 1.5rem 5rem;
}

.hero-inner {
  max-width: 880px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.4rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 600;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5.6vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.02;
  color: var(--text);
  text-wrap: balance;
}

.hero-subtitle {
  max-width: 620px;
  font-size: clamp(1.05rem, 1.7vw, 1.25rem);
  line-height: 1.55;
  color: var(--text-muted);
  text-wrap: balance;
}

.hero-tool {
  width: 100%;
  max-width: 760px;
  margin-top: 1rem;
  text-align: left;
}

.hero-tool :deep(.trust-strip) {
  justify-content: center;
}

@media (max-width: 640px) {
  .hero {
    padding: 2.5rem 1rem 3.5rem;
  }

  .hero-inner {
    gap: 1.1rem;
  }
}
</style>
