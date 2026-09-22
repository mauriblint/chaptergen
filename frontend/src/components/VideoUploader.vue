<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    variant?: 'video' | 'audio'
    compact?: boolean
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
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="8" y="18" width="4" height="14" rx="1" fill="#6366F1" opacity="0.7" />
        <rect x="16" y="12" width="4" height="20" rx="1" fill="#818CF8" />
        <rect x="24" y="8" width="4" height="24" rx="1" fill="#6366F1" />
      </svg>
    </div>
    <div class="uploader-copy">
      <p class="uploader-title">{{ title }}</p>
      <p class="uploader-hint">{{ hint }}</p>
    </div>
    <button type="button" class="uploader-btn" @click.stop="openPicker">
      {{ t('tool.uploader.button') }}
    </button>
  </div>
</template>

<style scoped>
.uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 2.5rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  background: var(--bg);
}

.uploader:hover,
.uploader.dragging {
  border-color: var(--accent);
  background: rgba(99, 102, 241, 0.04);
}

.uploader-icon {
  margin: 0 auto 1rem;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.uploader-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: var(--text);
}

.uploader-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}

.uploader-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.65rem 1.5rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.uploader-btn:hover {
  opacity: 0.9;
}

.uploader.compact {
  flex-direction: row;
  align-items: center;
  gap: 0.85rem;
  padding: 0.7rem 0.75rem 0.7rem 0.85rem;
  text-align: left;
}

.uploader.compact .uploader-icon {
  margin: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.uploader.compact .uploader-icon svg {
  width: 20px;
  height: 20px;
}

.uploader.compact .uploader-copy {
  min-width: 0;
  flex: 1;
}

.uploader.compact .uploader-title {
  font-size: 0.92rem;
  margin-bottom: 0.1rem;
}

.uploader.compact .uploader-hint {
  margin-bottom: 0;
  font-size: 0.78rem;
}

.uploader.compact .uploader-btn {
  padding: 0.6rem 1.15rem;
  font-size: 0.85rem;
  border-radius: 10px;
}

@media (max-width: 640px) {
  .uploader.compact {
    flex-wrap: wrap;
  }

  .uploader.compact .uploader-copy {
    flex: 1 1 180px;
  }

  .uploader.compact .uploader-btn {
    width: 100%;
  }
}
</style>
