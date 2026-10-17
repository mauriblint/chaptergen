<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  cta: string
  href: string
}>()
</script>

<template>
  <section class="final-cta">
    <div class="inner">
      <div class="copy">
        <h2 class="display-title title">{{ title }}</h2>
        <p class="subtitle">{{ subtitle }}</p>
      </div>
      <a :href="href" class="btn btn-ink btn-lg">
        {{ cta }}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </a>
    </div>
  </section>
</template>

<style scoped>
.final-cta {
  margin: 0 2rem 1rem;
  border-radius: 32px;
  background: var(--accent);
  color: #fff;
}

.inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem 3rem;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.title {
  font-size: clamp(2rem, 4.2vw, 3.25rem);
  max-width: 720px;
}

.subtitle {
  font-size: 1.125rem;
  color: #e4e1ff;
}

@media (max-width: 860px) {
  .final-cta {
    margin: 0 0.75rem 0.75rem;
    border-radius: 24px;
  }

  .inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 3rem 1.5rem;
  }

  .inner .btn {
    width: 100%;
  }
}
</style>
