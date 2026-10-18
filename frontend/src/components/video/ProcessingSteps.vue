<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { JobStatus } from '../../types/job'

const props = defineProps<{
  status: JobStatus
  isAudio: boolean
  language: string | null
}>()

const { t } = useI18n()

type StepState = 'done' | 'active' | 'todo'

// Audio files skip extraction, so they show one step less.
const order = computed<JobStatus[]>(() =>
  props.isAudio ? ['transcribing', 'generating'] : ['extracting', 'transcribing', 'generating']
)

const steps = computed(() => {
  const current = props.status === 'pending' ? order.value[0] : props.status
  const index = order.value.indexOf(current as JobStatus)
  const items: { key: string; state: StepState; detail?: string }[] = [
    { key: 'upload', state: 'done' },
  ]
  order.value.forEach((key, i) => {
    const state: StepState = i < index ? 'done' : i === index ? 'active' : 'todo'
    const detail =
      key === 'transcribing' && state === 'done' && props.language
        ? t('app.processing.languageDetected', { language: props.language })
        : undefined
    items.push({ key, state, detail })
  })
  return items
})
</script>

<template>
  <ol class="steps">
    <li v-for="(step, i) in steps" :key="step.key" class="step" :class="step.state">
      <div class="rail" aria-hidden="true">
        <span class="dot">
          <svg v-if="step.state === 'done'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        <span v-if="i < steps.length - 1" class="line" />
      </div>
      <div class="body">
        <div class="row">
          <span class="label">{{ t(`app.processing.steps.${step.key}`) }}</span>
          <span class="detail">
            {{ step.detail ?? (step.state === 'done' ? t('app.processing.done') : step.state === 'active' ? t('app.processing.inProgress') : '') }}
          </span>
        </div>
        <div v-if="step.state === 'active'" class="bar" aria-hidden="true"><span /></div>
        <span class="visually-hidden">{{ t(`app.processing.state.${step.state}`) }}</span>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.steps {
  list-style: none;
  padding: 26px 26px 6px;
  border: 1px solid var(--border);
  border-radius: 18px;
}

.step {
  display: flex;
  gap: 16px;
}

.rail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dot {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.done .dot {
  border: 0;
  background: var(--ink);
}

.active .dot {
  border: 3px solid var(--accent-bright);
  background: var(--accent-soft);
}

.line {
  width: 2px;
  flex: 1;
  min-height: 20px;
  background: var(--border);
}

.done .line {
  background: var(--ink);
}

.body {
  flex: 1;
  min-width: 0;
  padding-bottom: 20px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.95rem;
  font-weight: 600;
}

.todo .label {
  color: #9a9da3;
}

.detail {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  text-align: right;
}

.bar {
  position: relative;
  margin-top: 10px;
  height: 6px;
  border-radius: 3px;
  background: var(--border);
  overflow: hidden;
}

/* No real percentage is available per step, so the bar shows activity. */
.bar span {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 35%;
  border-radius: 3px;
  background: var(--accent-bright);
  animation: slide 1.4s ease-in-out infinite;
}

@keyframes slide {
  from {
    left: -35%;
  }
  to {
    left: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bar span {
    animation: none;
    left: 0;
    width: 60%;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
</style>
