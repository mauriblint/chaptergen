<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    variant?: 'video' | 'audio'
    compact?: boolean
    buttonLabel?: string
  }>(),
  { variant: 'video', compact: false }
)

const emit = defineEmits<{
  select: [file: File]
}>()

const { t } = useI18n()

const isDragging = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const ACCEPTED = '.mp4,.mov,.webm,.mkv,.avi,.m4v,.mp3,.wav,.m4a,.aac,.ogg,.flac,.opus'

const title = computed(() => {
  if (props.compact) {
    return props.variant === 'audio'
      ? t('tool.uploader.titleAudioCompact')
      : t('tool.uploader.titleVideoCompact')
  }
  return props.variant === 'audio' ? t('tool.uploader.titleAudio') : t('tool.uploader.titleVideo')
})

const hint = computed(() =>
  props.variant === 'audio' ? t('tool.uploader.hintAudio') : t('tool.uploader.hintVideo')
)

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) emit('select', file)
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('select', file)
}

function openPicker() {
  inputRef.value?.click()
}
</script>

<template>
  <div
    class="uploader"
    :class="{ dragging: isDragging, compact: props.compact }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    @click="openPicker"
  >
    <input
      ref="inputRef"
      type="file"
      :accept="ACCEPTED"
      hidden
      @change="onFileChange"
    />
    <div class="uploader-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
      </svg>
    </div>
    <div class="uploader-copy">
      <p class="uploader-title">{{ title }}</p>
      <p class="uploader-hint">{{ hint }}</p>
    </div>
    <button type="button" class="uploader-btn" @click.stop="openPicker">
      {{ buttonLabel ?? t('tool.uploader.button') }}
    </button>
  </div>
</template>

<style scoped>
.uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
  border: 1.5px dashed #c9cad2;
  border-radius: 22px;
  padding: 3rem 2rem 2.75rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  background: var(--surface);
  box-shadow: 0 18px 50px rgba(17, 19, 24, 0.06);
}

.uploader:hover,
.uploader.dragging {
  border-color: var(--accent);
  background: #fbfbff;
}

.uploader-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 0.75rem;
  border-radius: 16px;
  background: var(--accent-soft);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.uploader-copy {
  min-width: 0;
}

.uploader-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: var(--text);
}

.uploader-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.uploader-btn {
  min-height: 56px;
  margin-top: 1.25rem;
  background: var(--ink);
  color: #fff;
  border: none;
  padding: 0 2.25rem;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.uploader-btn:hover {
  background: #2a2e36;
}

.uploader.compact {
  flex-direction: row;
  text-align: left;
  box-shadow: none;
  gap: 0.85rem;
  padding: 0.7rem 0.75rem 0.7rem 0.85rem;
  border-radius: 12px;
}

.uploader.compact .uploader-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 0;
  border-radius: 10px;
}

.uploader.compact .uploader-copy {
  flex: 1;
}

.uploader.compact .uploader-icon svg {
  width: 20px;
  height: 20px;
}

.uploader.compact .uploader-title {
  font-size: 0.92rem;
  margin-bottom: 0.1rem;
}

.uploader.compact .uploader-hint {
  font-size: 0.78rem;
}

.uploader.compact .uploader-btn {
  margin-top: 0;
  min-height: 42px;
  padding: 0 1.15rem;
  font-size: 0.85rem;
  border-radius: 10px;
}

@media (max-width: 640px) {
  .uploader:not(.compact) {
    padding: 2rem 1.25rem 1.5rem;
  }

  .uploader:not(.compact) .uploader-btn {
    width: 100%;
  }

  .uploader.compact {
    flex-wrap: wrap;
  }

  .uploader.compact .uploader-copy {
    flex: 1 1 180px;
  }
}
</style>
