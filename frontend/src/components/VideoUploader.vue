<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  select: [file: File]
}>()

const isDragging = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const ACCEPTED = '.mp4,.mov,.webm,.mkv,.avi,.m4v,.mp3,.wav,.m4a,.aac,.ogg,.flac,.opus'

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
    :class="{ dragging: isDragging }"
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
    <div class="uploader-icon">▶</div>
    <p class="uploader-title">Arrastrá un video o audio, o hacé click para seleccionar</p>
    <p class="uploader-hint">MP4, MOV, WebM, MP3, WAV, M4A — hasta 500 MB</p>
  </div>
</template>

<style scoped>
.uploader {
  border: 2px dashed var(--border);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.uploader:hover,
.uploader.dragging {
  border-color: var(--accent);
  background: rgba(99, 102, 241, 0.06);
}

.uploader-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.uploader-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.uploader-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
