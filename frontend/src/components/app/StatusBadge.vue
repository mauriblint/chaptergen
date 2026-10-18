<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { JobStatus } from '../../types/job'

const props = defineProps<{
  status: JobStatus
  refunded?: boolean
}>()

const { t } = useI18n()

const kind = computed(() => {
  if (props.status === 'completed') return 'ready'
  if (props.status === 'failed') return 'failed'
  return 'processing'
})
</script>

<template>
  <span class="badge" :class="kind">
    <span class="dot" aria-hidden="true" />
    {{ t(`app.status.${kind}`) }}
    <span v-if="kind === 'failed' && refunded" class="note">· {{ t('app.status.refunded') }}</span>
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.ready {
  background: #e6f6ec;
  color: #116b3a;
}

.processing {
  background: var(--accent-soft);
  color: var(--accent);
}

.processing .dot {
  animation: pulse 1.2s ease-in-out infinite;
}

.failed {
  background: #fdecec;
  color: #b42318;
}

.note {
  font-weight: 500;
}

@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .processing .dot {
    animation: none;
  }
}
</style>
