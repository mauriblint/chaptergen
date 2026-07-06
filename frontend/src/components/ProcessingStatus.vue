<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ProcessingStep } from '../types'

const props = defineProps<{
  step: ProcessingStep
  fileName?: string
}>()

const { t } = useI18n()

type BadgeState = 'done' | 'active' | 'pending'

interface Stage {
  id: string
  label: string
  state: BadgeState
}

const HEADING_KEYS: Partial<Record<ProcessingStep, string>> = {
  uploading: 'tool.processing.headingUploading',
  extracting: 'tool.processing.headingExtracting',
  transcribing: 'tool.processing.headingTranscribing',
  generating: 'tool.processing.headingGenerating',
  regenerating: 'tool.processing.headingRegenerating',
}

const SUBTITLE_KEYS: Partial<Record<ProcessingStep, string>> = {
  uploading: 'tool.processing.subtitleUploading',
  extracting: 'tool.processing.subtitleExtracting',
  transcribing: 'tool.processing.subtitleTranscribing',
  generating: 'tool.processing.subtitleGenerating',
  regenerating: 'tool.processing.subtitleRegenerating',
}

const heading = computed(() => {
  const key = HEADING_KEYS[props.step]
  return key ? t(key) : t('tool.processing.headingFallback')
})

const subtitle = computed(() => {
  const key = SUBTITLE_KEYS[props.step]
  const detail = key ? t(key) : ''
  if (props.fileName && detail) return `${props.fileName} · ${detail}`
  if (props.fileName) return props.fileName
  return detail
})

const stages = computed((): Stage[] => {
  const step = props.step

  const uploaded: BadgeState =
    step === 'uploading' ? 'active' : 'done'

  let transcribing: BadgeState = 'pending'
  if (step === 'extracting' || step === 'transcribing') transcribing = 'active'
  else if (['generating', 'regenerating', 'done'].includes(step)) transcribing = 'done'

  let generating: BadgeState = 'pending'
  if (step === 'generating' || step === 'regenerating') generating = 'active'
  else if (step === 'done') generating = 'done'

  return [
    { id: 'uploaded', label: t('tool.processing.stageUploaded'), state: uploaded },
    { id: 'transcribing', label: t('tool.processing.stageTranscribing'), state: transcribing },
    { id: 'generating', label: t('tool.processing.stageGenerating'), state: generating },
  ]
})

const isActive = computed(
  () => props.step !== 'idle' && props.step !== 'done' && props.step !== 'error'
)
</script>

<template>
  <div v-if="isActive" class="processing" role="status" aria-live="polite">
    <div class="equalizer" aria-hidden="true">
      <span
        v-for="i in 5"
        :key="i"
        class="equalizer-bar"
        :class="`equalizer-bar--${i}`"
      />
    </div>

    <h2 class="processing-title">{{ heading }}</h2>
    <p v-if="subtitle" class="processing-subtitle">{{ subtitle }}</p>

    <div class="stage-badges">
      <span
        v-for="stage in stages"
        :key="stage.id"
        class="stage-badge"
        :class="`stage-badge--${stage.state}`"
      >
        <svg
          v-if="stage.state === 'done'"
          class="stage-check"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.5 8.5 6.5 11.5 12.5 4.5"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ stage.label }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.processing {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  gap: 0.75rem;
}

.equalizer {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.45rem;
  height: 2.75rem;
  margin-bottom: 0.75rem;
}

.equalizer-bar {
  width: 0.45rem;
  border-radius: 999px;
  animation: equalize 1.1s ease-in-out infinite;
}

.equalizer-bar--1 {
  height: 0.85rem;
  background: #c4b5fd;
  animation-delay: 0s;
}

.equalizer-bar--2 {
  height: 1.25rem;
  background: #a78bfa;
  animation-delay: 0.15s;
}

.equalizer-bar--3 {
  height: 1.65rem;
  background: #8b5cf6;
  animation-delay: 0.3s;
}

.equalizer-bar--4 {
  height: 2.05rem;
  background: #7c3aed;
  animation-delay: 0.45s;
}

.equalizer-bar--5 {
  height: 2.45rem;
  background: #6d28d9;
  animation-delay: 0.6s;
}

@keyframes equalize {
  0%,
  100% {
    transform: scaleY(0.45);
    opacity: 0.65;
  }

  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

.processing-title {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
}

.processing-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  max-width: 28rem;
  line-height: 1.5;
}

.stage-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.stage-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.stage-badge--done {
  background: #ecfdf5;
  color: #059669;
}

.stage-badge--active {
  background: #eef2ff;
  color: #6366f1;
}

.stage-badge--pending {
  background: #f1f5f9;
  color: #94a3b8;
}

.stage-check {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .processing {
    padding: 2.5rem 1.25rem;
  }

  .stage-badges {
    flex-direction: column;
    align-items: center;
  }
}
</style>
