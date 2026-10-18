<script setup lang="ts">
import { computed } from 'vue'
import type { JobStatus } from '../types/job'

const props = defineProps<{ status: JobStatus }>()

const styles: Record<JobStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-bg text-muted' },
  extracting: { label: 'Extracting', cls: 'bg-primary-soft text-primary' },
  transcribing: { label: 'Transcribing', cls: 'bg-primary-soft text-primary' },
  generating: { label: 'Generating', cls: 'bg-primary-soft text-primary' },
  regenerating: { label: 'Refining', cls: 'bg-primary-soft text-primary' },
  completed: { label: 'Completed', cls: 'bg-emerald-50 text-emerald-700' },
  failed: { label: 'Failed', cls: 'bg-red-50 text-red-700' },
}

const style = computed(() => styles[props.status])
</script>

<template>
  <span class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium" :class="style.cls">
    <span class="size-1.5 rounded-full bg-current" />
    {{ style.label }}
  </span>
</template>
