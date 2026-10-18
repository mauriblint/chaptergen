<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AudioLanguageSelect from './app/AudioLanguageSelect.vue'

/**
 * The one upload box, in the app and on the landings: a drop area with the
 * audio language and accepted formats in a footer of the same card.
 */
const props = withDefaults(
  defineProps<{
    variant?: 'video' | 'audio'
    title?: string
    buttonLabel?: string
  }>(),
  { variant: 'video' }
)

const emit = defineEmits<{
  select: [file: File]
}>()

const { t } = useI18n()

const isDragging = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const ACCEPTED = '.mp4,.mov,.webm,.mkv,.avi,.m4v,.mp3,.wav,.m4a,.aac,.ogg,.flac,.opus'

const heading = computed(
  () => props.title ?? (props.variant === 'audio' ? t('tool.uploader.titleAudio') : t('tool.uploader.titleVideo'))
)

const hint = computed(() =>
  props.variant === 'audio' ? t('tool.uploader.hintAudio') : t('tool.uploader.hintVideo')
)

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) emit('select', file)
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('select', file)
  // Picking the same file again should still fire.
  input.value = ''
}

function openPicker() {
  inputRef.value?.click()
}
</script>

<template>
  <div
    class="uploader"
    :class="{ dragging: isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave.self.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <input ref="inputRef" type="file" :accept="ACCEPTED" hidden @change="onFileChange" />

    <div
      class="drop"
      role="button"
      tabindex="0"
      :aria-label="buttonLabel ?? t('tool.uploader.button')"
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
    >
      <span class="drop-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 16V4M7 9l5-5 5 5" />
          <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
        </svg>
      </span>
      <p class="drop-title">{{ heading }}</p>
      <span class="drop-btn">{{ buttonLabel ?? t('tool.uploader.button') }}</span>
    </div>

    <div class="foot">
      <AudioLanguageSelect />
      <span class="formats">{{ hint }}</span>
    </div>
  </div>
</template>

<style scoped>
.uploader {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 26px;
  background: var(--page);
  box-shadow: 0 18px 50px rgba(17, 19, 24, 0.06);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.uploader.dragging {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft), 0 18px 50px rgba(17, 19, 24, 0.06);
}

.drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
  padding: 2.75rem 2rem 2.5rem;
  border: 1.5px dashed #c9cad2;
  border-radius: 19px;
  background: var(--bg);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.drop:hover,
.dragging .drop,
.drop:focus-visible {
  border-color: var(--accent);
  background: #f7f6ff;
  outline: none;
}

.drop-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 0.6rem;
  border-radius: 16px;
  background: var(--page);
  color: var(--accent);
  box-shadow: 0 1px 2px rgba(17, 19, 24, 0.06), 0 0 0 1px var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
}

.drop-btn {
  min-height: 52px;
  margin-top: 1rem;
  padding: 0 2rem;
  border-radius: 14px;
  background: var(--ink);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  transition: background 0.15s;
}

.drop:hover .drop-btn {
  background: #2a2e36;
}

.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px 16px;
  flex-wrap: wrap;
  padding: 10px 10px 4px 12px;
}

.formats {
  font-size: 0.8rem;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .drop {
    padding: 2rem 1.25rem 1.5rem;
  }

  .drop-btn {
    width: 100%;
    justify-content: center;
  }

  .foot {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
