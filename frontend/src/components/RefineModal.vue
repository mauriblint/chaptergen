<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RefineOptions } from '../types/refine'

const props = defineProps<{
  initialAutoMode?: boolean
  initialChapterCount?: number
}>()

const { t } = useI18n()

const emit = defineEmits<{
  close: []
  submit: [options: RefineOptions]
}>()

const form = reactive<RefineOptions>({
  mode: 'both',
  granularity: 'balanced',
  contentType: 'auto',
  titleStyle: 'descriptive',
  autoMode: props.initialAutoMode ?? true,
  chapterCount: props.initialChapterCount ?? 10,
  instructions: '',
})

const showGranularity = computed(() => form.mode !== 'titles')
const showCount = computed(() => form.mode !== 'titles')
</script>

<template>
  <Teleport to="body">
    <div class="refine-overlay" @click.self="emit('close')">
      <div class="refine-modal" role="dialog" aria-labelledby="refine-title">
        <div class="refine-header">
          <h2 id="refine-title">{{ t('tool.refine.title') }}</h2>
          <button
            type="button"
            class="refine-close"
            :aria-label="t('tool.refine.close')"
            @click="emit('close')"
          >
            ×
          </button>
        </div>

        <div class="refine-body">
          <section class="refine-field">
            <h3>{{ t('tool.refine.whatToChange') }}</h3>
            <div class="segment-group">
              <label class="segment-option" :class="{ active: form.mode === 'both' }">
                <input v-model="form.mode" type="radio" value="both" class="segment-input" />
                <span>{{ t('tool.refine.titlesAndCuts') }}</span>
              </label>
              <label class="segment-option" :class="{ active: form.mode === 'titles' }">
                <input v-model="form.mode" type="radio" value="titles" class="segment-input" />
                <span>{{ t('tool.refine.titlesOnly') }}</span>
              </label>
              <label class="segment-option" :class="{ active: form.mode === 'segments' }">
                <input v-model="form.mode" type="radio" value="segments" class="segment-input" />
                <span>{{ t('tool.refine.cutsOnly') }}</span>
              </label>
            </div>
          </section>

          <section v-if="showGranularity" class="refine-field">
            <h3>{{ t('tool.refine.granularity') }}</h3>
            <div class="segment-group">
              <label class="segment-option" :class="{ active: form.granularity === 'detailed' }">
                <input
                  v-model="form.granularity"
                  type="radio"
                  value="detailed"
                  class="segment-input"
                />
                <svg class="segment-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <rect x="2" y="4" width="12" height="2" rx="1" />
                  <rect x="2" y="10" width="12" height="2" rx="1" />
                </svg>
                <span>{{ t('tool.refine.moreDetailed') }}</span>
              </label>
              <label class="segment-option" :class="{ active: form.granularity === 'balanced' }">
                <input
                  v-model="form.granularity"
                  type="radio"
                  value="balanced"
                  class="segment-input"
                />
                <svg class="segment-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <rect x="2" y="3" width="12" height="1.5" rx="0.75" />
                  <rect x="2" y="7.25" width="12" height="1.5" rx="0.75" />
                  <rect x="2" y="11.5" width="12" height="1.5" rx="0.75" />
                </svg>
                <span>{{ t('tool.refine.balanced') }}</span>
              </label>
              <label class="segment-option" :class="{ active: form.granularity === 'grouped' }">
                <input
                  v-model="form.granularity"
                  type="radio"
                  value="grouped"
                  class="segment-input"
                />
                <svg class="segment-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <rect x="1" y="9" width="14" height="2.5" rx="0.75" opacity="0.45" />
                  <rect x="2.5" y="5.5" width="11" height="2.5" rx="0.75" opacity="0.7" />
                  <rect x="4" y="2" width="8" height="2.5" rx="0.75" />
                </svg>
                <span>{{ t('tool.refine.moreGrouped') }}</span>
              </label>
            </div>
          </section>

          <div class="refine-row">
            <section class="refine-field">
              <label for="content-type">{{ t('tool.refine.contentType') }}</label>
              <div class="select-wrap">
                <select id="content-type" v-model="form.contentType" class="refine-select">
                  <option value="auto">{{ t('tool.refine.ctAuto') }}</option>
                  <option value="tutorial">{{ t('tool.refine.ctTutorial') }}</option>
                  <option value="podcast">{{ t('tool.refine.ctPodcast') }}</option>
                  <option value="webinar">{{ t('tool.refine.ctWebinar') }}</option>
                  <option value="review">{{ t('tool.refine.ctReview') }}</option>
                </select>
                <svg class="select-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </section>

            <section class="refine-field">
              <label for="title-style">{{ t('tool.refine.titleStyle') }}</label>
              <div class="select-wrap">
                <select id="title-style" v-model="form.titleStyle" class="refine-select">
                  <option value="descriptive">{{ t('tool.refine.tsDescriptive') }}</option>
                  <option value="short">{{ t('tool.refine.tsShort') }}</option>
                  <option value="seo">{{ t('tool.refine.tsSeo') }}</option>
                  <option value="question">{{ t('tool.refine.tsQuestion') }}</option>
                </select>
                <svg class="select-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </section>
          </div>

          <section v-if="showCount" class="refine-field">
            <h3>{{ t('tool.refine.chapterCount') }}</h3>
            <div class="segment-group segment-group--two">
              <label class="segment-option" :class="{ active: form.autoMode }">
                <input v-model="form.autoMode" type="radio" :value="true" class="segment-input" />
                <span>{{ t('tool.refine.automatic') }}</span>
              </label>
              <label class="segment-option" :class="{ active: !form.autoMode }">
                <input v-model="form.autoMode" type="radio" :value="false" class="segment-input" />
                <span>{{ t('tool.refine.fixedCount') }}</span>
              </label>
            </div>
            <div v-if="!form.autoMode" class="slider-group">
              <label for="refine-chapters">
                {{ t('tool.refine.chaptersLabel') }} <strong>{{ form.chapterCount }}</strong>
              </label>
              <input
                id="refine-chapters"
                v-model.number="form.chapterCount"
                type="range"
                min="5"
                max="20"
                step="1"
              />
            </div>
          </section>
        </div>

        <div class="refine-footer">
          <button type="button" class="btn-cancel" @click="emit('close')">
            {{ t('tool.refine.cancel') }}
          </button>
          <button type="button" class="btn-submit" @click="emit('submit', { ...form })">
            {{ t('tool.refine.submit') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.refine-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
  padding: 1rem;
}

.refine-modal {
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
}

.refine-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.refine-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
}

.refine-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.2rem 0.35rem;
  border-radius: 6px;
}

.refine-close:hover {
  color: var(--text);
  background: var(--bg);
}

.refine-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.refine-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.refine-field h3,
.refine-field > label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
}

.refine-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.segment-group {
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: #eef2ff;
  border-radius: 12px;
}

.segment-option {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.65rem 0.5rem;
  border-radius: 9px;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.25;
  text-align: center;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  user-select: none;
}

.segment-option span {
  min-width: 0;
}

.segment-option.active {
  background: #fff;
  color: #581c87;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.segment-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.segment-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.select-wrap {
  position: relative;
}

.refine-select {
  width: 100%;
  appearance: none;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.65rem 2rem 0.65rem 0.75rem;
  font-size: 0.875rem;
  color: var(--text);
  cursor: pointer;
}

.refine-select:focus {
  outline: none;
  border-color: var(--accent);
}

.select-chevron {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: var(--text-muted);
  pointer-events: none;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.slider-group input[type='range'] {
  width: 100%;
  accent-color: var(--accent);
}

.refine-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
}

.btn-cancel,
.btn-submit {
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s, border-color 0.15s;
}

.btn-cancel {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-cancel:hover {
  border-color: var(--accent);
}

.btn-submit {
  background: var(--accent);
  color: #fff;
  border: none;
}

.btn-submit:hover {
  opacity: 0.9;
}

@media (max-width: 480px) {
  .refine-row {
    grid-template-columns: 1fr;
  }

  .segment-option {
    font-size: 0.75rem;
    padding: 0.55rem 0.35rem;
  }
}
</style>
