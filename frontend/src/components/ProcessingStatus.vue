<script setup lang="ts">
import { computed } from 'vue'
import type { ProcessingStep } from '../types'
import { STEP_LABELS } from '../types'

const props = defineProps<{
  step: ProcessingStep
  fileName?: string
}>()

const progress = computed(() => {
  const map: Record<ProcessingStep, number> = {
    idle: 0,
    uploading: 15,
    extracting: 35,
    transcribing: 65,
    generating: 85,
    regenerating: 50,
    done: 100,
    error: 0,
  }
  return map[props.step]
})

const isActive = computed(
  () => props.step !== 'idle' && props.step !== 'done' && props.step !== 'error'
)
</script>

<template>
  <div v-if="isActive" class="status">
    <div class="status-header">
      <span class="status-label">{{ STEP_LABELS[step] }}</span>
      <span v-if="fileName" class="status-file">{{ fileName }}</span>
    </div>
    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${progress}%` }" />
    </div>
  </div>
</template>

<style scoped>
.status {
  margin: 1.5rem 0;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.status-label {
  color: var(--accent);
}

.status-file {
  color: var(--text-muted);
  font-size: 0.8rem;
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-track {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.4s ease;
}
</style>
