<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isAudioFile } from '../../utils/media'

const props = defineProps<{
  name: string
  /** Upload progress; null hides the bar. */
  percent: number | null
  error?: string | null
}>()

const { t } = useI18n()
const audio = computed(() => isAudioFile(props.name))
const status = computed(() => {
  if (props.error) return props.error
  if (props.percent == null) return ''
  return props.percent >= 100 ? t('app.upload.uploaded') : t('app.upload.uploading', { percent: props.percent })
})
</script>

<template>
  <div class="chip" :class="{ failed: !!error }">
    <span class="icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path v-if="audio" d="M9 3h6v11H9zM5 11a7 7 0 0 0 14 0M12 18v3" />
        <path v-else d="M10 9.5l4.5 2.5-4.5 2.5z" />
      </svg>
    </span>
    <div class="body">
      <div class="top">
        <span class="name">{{ name }}</span>
        <span class="status">{{ status }}</span>
      </div>
      <div v-if="percent != null && !error" class="bar" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
        <span :style="{ width: `${percent}%` }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--bg);
}

.icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 9px;
  background: var(--ink);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.8rem;
}

.name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status {
  flex-shrink: 0;
  color: var(--text-muted);
}

.failed .status {
  color: #b42318;
}

.bar {
  height: 5px;
  border-radius: 3px;
  background: var(--border);
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  border-radius: 3px;
  background: var(--accent-bright);
  transition: width 0.3s;
}
</style>
