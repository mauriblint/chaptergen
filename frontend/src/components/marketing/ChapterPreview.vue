<script setup lang="ts">
import { computed } from 'vue'
import type { PreviewContent } from '../../content/home'

const props = defineProps<{
  preview: PreviewContent
}>()

// Segment widths approximate each chapter's share of the runtime so the
// progress bar reads like YouTube's chapter-split scrubber.
const segments = computed(() => {
  const toSeconds = (time: string) =>
    time.split(':').reduce((total, part) => total * 60 + Number(part), 0)
  const starts = props.preview.chapters.map((c) => toSeconds(c.time))
  const end = toSeconds(props.preview.duration)
  return starts.map((start, i) => ({
    width: `${(((starts[i + 1] ?? end) - start) / end) * 100}%`,
    played: i <= props.preview.activeIndex,
    playhead: i === props.preview.activeIndex,
  }))
})

const activeChapter = computed(() => props.preview.chapters[props.preview.activeIndex])
</script>

<template>
  <figure class="preview" :aria-label="preview.label">
    <div class="player">
      <div class="player-top">
        <span class="mono file-name">{{ preview.fileName }}</span>
        <span class="tag">{{ preview.label }}</span>
      </div>
      <div class="play" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24"><path d="M8 5.5 L19 12 L8 18.5 Z" fill="#FFFFFF" /></svg>
      </div>
      <div class="player-bottom">
        <div class="scrubber" aria-hidden="true">
          <span
            v-for="(seg, i) in segments"
            :key="i"
            class="segment"
            :class="{ played: seg.played }"
            :style="{ width: seg.width }"
          >
            <span v-if="seg.playhead" class="playhead" />
          </span>
        </div>
        <div class="mono player-meta">
          <span>{{ activeChapter?.time }} · {{ activeChapter?.title }}</span>
          <span>{{ preview.duration }}</span>
        </div>
      </div>
    </div>

    <ol class="chapters">
      <li
        v-for="(chapter, i) in preview.chapters"
        :key="chapter.time"
        class="chapter"
        :class="{ active: i === preview.activeIndex }"
      >
        <span class="mono time">{{ chapter.time }}</span>
        <span class="title">{{ chapter.title }}</span>
      </li>
    </ol>

    <div class="actions" aria-hidden="true">
      <span class="btn btn-ink action-main">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>
        {{ preview.copy }}
      </span>
      <span class="btn btn-ghost">{{ preview.refine }}</span>
    </div>
  </figure>
</template>

<style scoped>
.preview {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.player {
  aspect-ratio: 16 / 8.5;
  padding: 1.1rem 1.25rem;
  background: var(--ink-2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.player-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.file-name {
  font-size: 0.8rem;
  color: #c9ccd2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag {
  flex-shrink: 0;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
}

.play {
  align-self: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-bottom {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.scrubber {
  display: flex;
  gap: 4px;
}

.segment {
  position: relative;
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.28);
}

.segment.played {
  background: var(--accent-bright);
}

.playhead {
  position: absolute;
  right: -7px;
  top: -5px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #fff;
}

.player-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.75rem;
  color: #c9ccd2;
}

.player-meta span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapters {
  list-style: none;
  padding: 0.5rem 1.35rem 0;
}

.chapter {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 0.68rem 0;
  border-bottom: 1px solid var(--border-soft);
  font-size: 0.95rem;
}

.chapter:last-child {
  border-bottom: none;
}

.chapter.active {
  margin: 0 -0.75rem;
  padding: 0.68rem 0.75rem;
  border-radius: 10px;
  border-bottom-color: transparent;
  background: var(--accent-soft);
  font-weight: 600;
}

.time {
  width: 3.4rem;
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent);
}

.actions {
  display: flex;
  gap: 0.6rem;
  padding: 0.75rem 1.35rem 1.35rem;
}

.action-main {
  flex: 1;
  cursor: default;
}

.btn-ghost {
  border-color: var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: default;
}

@media (max-width: 640px) {
  .chapters {
    padding: 0.35rem 1rem 0;
  }

  .chapter {
    font-size: 0.875rem;
  }

  .actions {
    padding: 0.75rem 1rem 1rem;
  }

  .btn-ghost {
    display: none;
  }
}
</style>
