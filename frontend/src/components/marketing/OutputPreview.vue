<script setup lang="ts">
defineProps<{
  fileName: string
  label: string
  kind: 'transcript' | 'subtitles'
  /** Transcript: [time, text]. Subtitles: [index, timing, text]. */
  lines: string[][]
}>()
</script>

<template>
  <figure class="preview" :aria-label="label">
    <div class="bar">
      <span class="mono file">{{ fileName }}</span>
      <span class="tag">{{ label }}</span>
    </div>
    <div v-if="kind === 'transcript'" class="transcript">
      <p v-for="(line, i) in lines" :key="i" class="line">
        <span class="mono time">{{ line[0] }}</span>
        <span>{{ line[1] }}</span>
      </p>
    </div>
    <pre v-else class="mono srt"><template v-for="(cue, i) in lines" :key="i"><span class="muted">{{ cue[0] }}</span>
<span class="timing">{{ cue[1] }}</span>
{{ cue[2] }}

</template></pre>
  </figure>
</template>

<style scoped>
.preview {
  border: 1px solid var(--border);
  border-radius: 22px;
  overflow: hidden;
  background: var(--surface);
  box-shadow: var(--shadow-lg);
}

.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--ink-2);
}

.file {
  font-size: 0.8rem;
  color: #c9ccd2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag {
  flex-shrink: 0;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
}

.transcript {
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.line {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 12px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #2c2f35;
}

.time {
  padding-top: 3px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent);
}

.srt {
  margin: 0;
  padding: 20px 24px;
  background: #fbfbfc;
  font-size: 0.85rem;
  line-height: 1.65;
  white-space: pre-wrap;
}

.muted {
  color: var(--text-muted);
}

.timing {
  color: var(--accent);
}

@media (max-width: 640px) {
  .transcript,
  .srt {
    padding: 16px;
  }
}
</style>
