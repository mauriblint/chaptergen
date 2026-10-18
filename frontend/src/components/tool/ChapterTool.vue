<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '../ui/Card.vue'
import VideoUploader from '../VideoUploader.vue'
import StartVideoFlow from '../app/StartVideoFlow.vue'
import AudioLanguageSelect from '../app/AudioLanguageSelect.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'video' | 'audio'
    compact?: boolean
    buttonLabel?: string
  }>(),
  { variant: 'video', compact: false }
)

const { t } = useI18n()
const flow = ref<InstanceType<typeof StartVideoFlow> | null>(null)

const trustItems = computed(() => [
  t('tool.chapterTool.noSignup'),
  t('tool.chapterTool.filesDeleted'),
  t('tool.chapterTool.languages'),
])

function onFileSelect(file: File) {
  void flow.value?.pick(file)
}
</script>

<template>
  <Card class="chapter-tool" :class="{ compact }" :shadow="compact ? 'lg' : 'none'">
    <div class="controls">
      <VideoUploader :variant="variant" :compact="compact" :button-label="buttonLabel" @select="onFileSelect" />
      <AudioLanguageSelect v-if="!props.compact" align="center" />

      <ul v-if="!props.compact" class="trust-strip">
        <li v-for="item in trustItems" :key="item" class="trust-item">
          <svg class="trust-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          {{ item }}
        </li>
      </ul>
    </div>
  </Card>

  <StartVideoFlow ref="flow" />
</template>

<style scoped>
.chapter-tool {
  width: 100%;
}

.chapter-tool.compact {
  padding: 0.65rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.chapter-tool:not(.compact) {
  padding: 0;
  border: none;
  background: transparent;
}

.trust-strip {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.trust-icon {
  color: var(--accent);
  flex-shrink: 0;
}
</style>
