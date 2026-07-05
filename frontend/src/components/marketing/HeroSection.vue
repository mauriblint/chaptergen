<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Badge from '../ui/Badge.vue'

defineProps<{
  badge: string
  title: string
  subtitle: string
  microcopy: string
  variant?: 'video' | 'audio'
}>()

const ChapterTool = defineAsyncComponent(
  () => import('../tool/ChapterTool.vue')
)
</script>

<template>
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-content">
        <Badge class="hero-badge">{{ badge }}</Badge>
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-subtitle">{{ subtitle }}</p>
      </div>

      <div class="hero-tool">
        <ChapterTool :variant="variant ?? 'video'" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 4rem 1.5rem 5rem;
  background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
}

.hero-inner {
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-badge {
  color: var(--accent);
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.18);
  font-weight: 600;
}

.hero-title {
  font-size: clamp(2rem, 5.5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.08;
  margin-top: 1.5rem;
  color: var(--text);
  text-wrap: balance;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: var(--text-muted);
  margin-top: 1.25rem;
  max-width: 620px;
  line-height: 1.6;
  text-wrap: balance;
}

.hero-tool {
  margin-top: 2.5rem;
  text-align: left;
}
</style>
