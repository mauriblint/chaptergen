<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

defineProps<{
  badge: string
  title: string
  subtitle: string
  variant?: 'video' | 'audio'
  cta?: string
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
        <ChapterTool :variant="variant ?? 'video'" :button-label="cta" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  padding: 4.5rem 1.5rem 5rem;
}

/* Brand glow behind the hero; it starts under the header, which is see-through at the top. */
.hero::before,
.hero::after {
  content: '';
  position: absolute;
  z-index: -1;
  inset: -72px 0 0;
  pointer-events: none;
}

.hero::before {
  background:
    radial-gradient(55% 45% at 50% 0%, rgba(99, 102, 241, 0.16), transparent 72%),
    radial-gradient(32% 34% at 14% 18%, rgba(169, 156, 249, 0.2), transparent 70%),
    radial-gradient(30% 32% at 88% 10%, rgba(76, 63, 240, 0.1), transparent 70%);
}

/* A faint dot grid that fades out before the upload box. */
.hero::after {
  background-image: radial-gradient(rgba(76, 63, 240, 0.12) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(70% 55% at 50% 0%, #000 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(70% 55% at 50% 0%, #000 30%, transparent 75%);
}

.hero-inner {
  max-width: 1080px;
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
  border: 1px solid rgba(76, 63, 240, 0.16);
  border-radius: 999px;
  /* Light on the glow, so it reads as a pill rather than loose text. */
  background: rgba(255, 255, 255, 0.75);
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 600;
}

.hero-title {
  max-width: 1040px;
  font-family: var(--font-display);
  font-size: clamp(2.3rem, 5.2vw, 4.1rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.02;
  color: var(--text);
  text-wrap: balance;
}

.hero-subtitle {
  max-width: 660px;
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
