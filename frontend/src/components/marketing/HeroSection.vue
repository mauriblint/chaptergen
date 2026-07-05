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
        <Badge>{{ badge }}</Badge>
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-subtitle">{{ subtitle }}</p>
      </div>

      <div class="hero-tool">
        <ChapterTool :variant="variant ?? 'video'" />
        <p class="hero-microcopy">{{ microcopy }}</p>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="mock-player">
          <div class="mock-screen">
            <div class="mock-play">▶</div>
          </div>
          <div class="mock-timeline" />
        </div>
        <div class="mock-chapters">
          <div class="mock-chapters-header">Chapters</div>
          <div class="mock-chapter-row"><span>0:00</span> Introduction</div>
          <div class="mock-chapter-row"><span>2:14</span> Main topic</div>
          <div class="mock-chapter-row"><span>8:42</span> Key takeaway</div>
          <div class="mock-chapter-row"><span>15:30</span> Summary</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 3rem 1.5rem 4rem;
  background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
}

.hero-inner {
  max-width: 960px;
  margin: 0 auto;
}

.hero-content {
  margin-bottom: 2rem;
}

.hero-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-top: 1rem;
  color: var(--text);
}

.hero-subtitle {
  font-size: 1.05rem;
  color: var(--text-muted);
  margin-top: 1rem;
  max-width: 640px;
  line-height: 1.6;
}

.hero-tool {
  margin-top: 2rem;
}

.hero-microcopy {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
}

.hero-visual {
  display: none;
  margin-top: 3rem;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
}

@media (min-width: 900px) {
  .hero-visual {
    display: grid;
  }
}

.mock-player,
.mock-chapters {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.mock-screen {
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-play {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.mock-timeline {
  height: 4px;
  background: var(--border);
  margin: 0.75rem 1rem 1rem;
  border-radius: 2px;
  position: relative;
}

.mock-timeline::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 35%;
  background: var(--accent);
  border-radius: 2px;
}

.mock-chapters-header {
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-bottom: 1px solid var(--border);
  color: var(--text-muted);
}

.mock-chapter-row {
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 0.75rem;
}

.mock-chapter-row span {
  color: var(--accent);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.mock-chapter-row:last-child {
  border-bottom: none;
}
</style>
