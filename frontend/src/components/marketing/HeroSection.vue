<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import ChapterPreview from './ChapterPreview.vue'
import type { PreviewContent } from '../../content/home'

defineProps<{
  badge: string
  title: string
  subtitle: string
  preview: PreviewContent
  variant?: 'video' | 'audio'
}>()

const ChapterTool = defineAsyncComponent(
  () => import('../tool/ChapterTool.vue')
)
</script>

<template>
  <section id="start" class="hero">
    <div class="hero-inner">
      <div class="hero-content">
        <span class="hero-badge">{{ badge }}</span>
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-subtitle">{{ subtitle }}</p>
        <div class="hero-tool">
          <ChapterTool :variant="variant ?? 'video'" />
        </div>
      </div>

      <div class="hero-preview">
        <ChapterPreview :preview="preview" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 5rem 1.5rem 5.5rem;
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 4.5rem;
  align-items: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
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
  font-size: clamp(2.5rem, 5.2vw, 4.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.02;
  color: var(--text);
  text-wrap: balance;
}

.hero-subtitle {
  font-size: clamp(1.05rem, 1.6vw, 1.2rem);
  color: var(--text-muted);
  max-width: 560px;
  line-height: 1.55;
}

.hero-tool {
  width: 100%;
  margin-top: 0.5rem;
}

.hero-tool :deep(.controls) {
  gap: 1.1rem;
}

@media (min-width: 1024px) {
  .hero {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}

@media (max-width: 960px) {
  .hero {
    padding: 2.5rem 1rem 3.5rem;
  }

  .hero-inner {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.5rem;
  }

  .hero-content {
    gap: 1.1rem;
  }
}
</style>
