<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import VideoUploader from '../VideoUploader.vue'

defineProps<{
  /** First video of the account: friendlier title. */
  first: boolean
}>()

const emit = defineEmits<{ pick: [file: File] }>()
const { t } = useI18n()

const outputs = ['chapters', 'transcript', 'subtitles'] as const
</script>

<template>
  <section class="panel">
    <header class="head">
      <h1 class="title">{{ first ? t('app.newVideo.firstTitle') : t('app.newVideo.title') }}</h1>
    </header>

    <VideoUploader :title="t('app.upload.dropTitle')" :button-label="t('app.upload.choose')" @select="emit('pick', $event)" />

    <!-- One credit fans out into the three results. -->
    <div class="explainer" :aria-label="t('app.newVideo.explainer')">
      <div class="credit">
        <span class="coin" aria-hidden="true">1</span>
        <span>{{ t('app.newVideo.oneCredit') }}</span>
      </div>
      <svg class="fan" viewBox="0 0 600 70" preserveAspectRatio="none" aria-hidden="true">
        <path class="wire" d="M300 0 C300 35, 100 30, 100 70" />
        <path class="wire" d="M300 0 L300 70" />
        <path class="wire" d="M300 0 C300 35, 500 30, 500 70" />
        <circle class="pulse p1" r="4" cx="0" cy="0"><animateMotion dur="2.4s" repeatCount="indefinite" path="M300 0 C300 35, 100 30, 100 70" /></circle>
        <circle class="pulse p2" r="4" cx="0" cy="0"><animateMotion dur="2.4s" begin="0.3s" repeatCount="indefinite" path="M300 0 L300 70" /></circle>
        <circle class="pulse p3" r="4" cx="0" cy="0"><animateMotion dur="2.4s" begin="0.6s" repeatCount="indefinite" path="M300 0 C300 35, 500 30, 500 70" /></circle>
      </svg>
      <ul class="outputs">
        <li v-for="(key, i) in outputs" :key="key" class="output" :style="{ animationDelay: `${0.15 + i * 0.15}s` }">
          <div class="visual" aria-hidden="true">
            <template v-if="key === 'chapters'">
              <span class="mono row"><b>0:00</b> {{ t('app.newVideo.chapter1') }}</span>
              <span class="mono row"><b>2:14</b> {{ t('app.newVideo.chapter2') }}</span>
              <span class="mono row"><b>9:40</b> {{ t('app.newVideo.chapter3') }}</span>
            </template>
            <template v-else-if="key === 'transcript'">
              <span class="bar" style="width: 92%" />
              <span class="bar" style="width: 78%" />
              <span class="bar" style="width: 85%" />
              <span class="bar" style="width: 60%" />
            </template>
            <template v-else>
              <span class="mono row cue">00:00:01 --></span>
              <span class="sub">{{ t('app.newVideo.subLine1') }}</span>
              <span class="sub">{{ t('app.newVideo.subLine2') }}</span>
            </template>
          </div>
          <strong>{{ t(`app.outputs.${key}.title`) }}</strong>
          <span class="desc">{{ t(`app.outputs.${key}.description`) }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.panel {
  max-width: 760px;
  margin: 1.5rem auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;
}

.head {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 4vw, 2.3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.explainer {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.credit {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 8px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
}

.coin {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--accent-bright);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.fan {
  width: 100%;
  height: 56px;
}

.wire {
  fill: none;
  stroke: var(--border);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.pulse {
  fill: var(--accent-bright);
}

.outputs {
  width: 100%;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.output {
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  font-size: 0.8rem;
  color: var(--text-muted);
  animation: rise 0.5s ease-out both;
}

.output strong {
  font-size: 0.9rem;
  color: var(--text);
}

.visual {
  height: 86px;
  margin-bottom: 8px;
  padding: 12px;
  border-radius: 10px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  overflow: hidden;
}

.row {
  font-size: 0.72rem;
  color: var(--text);
  white-space: nowrap;
}

.row b {
  color: var(--accent);
  font-weight: 600;
  margin-right: 6px;
}

.cue {
  color: var(--accent);
}

.sub {
  align-self: flex-start;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--ink);
  color: #fff;
  font-size: 0.72rem;
}

.bar {
  height: 6px;
  border-radius: 3px;
  background: #d9d9df;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .output {
    animation: none;
  }

  .pulse {
    display: none;
  }
}

@media (max-width: 640px) {
  .fan {
    display: none;
  }

  .credit {
    margin-bottom: 12px;
  }

  .outputs {
    grid-template-columns: minmax(0, 1fr);
  }

  .drop {
    padding: 2rem 1.25rem;
  }
}
</style>
