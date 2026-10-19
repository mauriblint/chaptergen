<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuth } from '../composables/useAuth'
import { listJobs } from '../composables/useJob'
import type { JobSummary } from '../types/job'

interface FaqItem {
  question: string
  answer: string
}

interface FaqGroup {
  title: string
  items: FaqItem[]
}

const { t, tm, locale } = useI18n()
const route = useRoute()
const { user, sendSupport } = useAuth()

useHead(computed(() => ({ title: t('support.metaTitle'), htmlAttrs: { lang: locale.value } })))

const query = ref('')
const groups = computed(() => tm('support.groups') as FaqGroup[])

/** Case- and accent-insensitive, so "codigo" finds "código". */
function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

const filtered = computed(() => {
  const words = normalize(query.value.trim()).split(/\s+/).filter(Boolean)
  if (!words.length) return groups.value
  return groups.value
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const haystack = normalize(`${item.question} ${item.answer}`)
        return words.every((word) => haystack.includes(word))
      }),
    }))
    .filter((group) => group.items.length)
})

const searching = computed(() => query.value.trim().length > 0)

// Contact form
const jobs = ref<JobSummary[]>([])
// A link from a video page can preselect it with ?video=<id>.
const jobId = ref(typeof route.query.video === 'string' ? route.query.video : '')
const subject = ref('')
const message = ref('')
const sending = ref(false)
const sent = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  jobs.value = (await listJobs().catch(() => [])).slice(0, 20)
})

async function submit() {
  if (!subject.value.trim() || !message.value.trim() || sending.value) return
  sending.value = true
  error.value = null
  try {
    await sendSupport(subject.value.trim(), message.value.trim(), jobId.value || null)
    sent.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('support.sendError')
  } finally {
    sending.value = false
  }
}

function reset() {
  sent.value = false
  subject.value = ''
  message.value = ''
  jobId.value = ''
}
</script>

<template>
  <AppLayout>
    <div class="support">
      <header class="head">
        <h1 class="page-title">{{ t('support.title') }}</h1>
        <p class="lead">
          {{ t('support.lead') }}
          <a href="#contact" class="jump">{{ t('support.writeToUs') }} ↓</a>
        </p>
        <label class="search">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input v-model="query" type="search" :placeholder="t('support.search')" :aria-label="t('support.search')" />
        </label>
      </header>

      <div class="groups">
        <section v-for="group in filtered" :key="group.title" class="group">
          <h2 class="group-title">{{ group.title }}</h2>
          <div class="items">
            <details v-for="item in group.items" :key="item.question" class="item" :open="searching">
              <summary>
                <span>{{ item.question }}</span>
                <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
              </summary>
              <p class="answer">{{ item.answer }}</p>
            </details>
          </div>
        </section>
        <p v-if="!filtered.length" class="empty">{{ t('support.noResults') }}</p>
      </div>

      <section id="contact" class="contact">
        <div class="contact-copy">
          <h2 class="contact-title">{{ t('support.contact.title') }}</h2>
          <i18n-t keypath="support.contact.lead" tag="p" class="contact-lead">
            <template #email><strong class="email">{{ user?.email }}</strong></template>
          </i18n-t>
        </div>

        <div v-if="sent" class="sent" role="status">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          <p>{{ t('support.sent') }}</p>
          <button type="button" class="btn btn-ghost" @click="reset">{{ t('support.sendAnother') }}</button>
        </div>

        <form v-else class="form" @submit.prevent="submit">
          <label v-if="jobs.length" class="field">
            <span>{{ t('support.contact.video') }}</span>
            <span class="select-wrap">
              <select v-model="jobId">
                <option value="">{{ t('support.contact.noVideo') }}</option>
                <option v-for="job in jobs" :key="job.id" :value="job.id">{{ job.fileName }}</option>
              </select>
              <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </span>
          </label>
          <label class="field">
            <span>{{ t('support.subject') }}</span>
            <input v-model="subject" type="text" required maxlength="200" :placeholder="t('support.subjectPlaceholder')" />
          </label>
          <label class="field">
            <span>{{ t('support.message') }}</span>
            <textarea v-model="message" required maxlength="5000" rows="5" :placeholder="t('support.messagePlaceholder')" />
          </label>
          <p v-if="error" class="error" role="alert">{{ error }}</p>
          <button type="submit" class="btn btn-ink submit" :disabled="sending || !subject.trim() || !message.trim()">
            {{ sending ? t('support.sending') : t('support.submit') }}
          </button>
        </form>
      </section>
    </div>
  </AppLayout>
</template>

<style scoped>
.support {
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

.head {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.lead {
  color: var(--text-muted);
}

.jump {
  margin-left: 4px;
  font-weight: 600;
  color: var(--accent);
  white-space: nowrap;
}

.jump:hover {
  text-decoration: underline;
}

.email {
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
}

.contact {
  scroll-margin-top: 88px;
}

.search {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--page);
  color: var(--text-muted);
  transition: border-color 0.15s;
}

.search:focus-within {
  border-color: var(--accent);
}

.search input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: none;
  font: inherit;
  color: var(--text);
}

.groups {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-title {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.items {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--page);
  overflow: hidden;
}

.item + .item {
  border-top: 1px solid var(--border-soft);
}

summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 15px 18px;
  font-weight: 600;
  cursor: pointer;
}

summary::-webkit-details-marker {
  display: none;
}

summary:hover {
  background: var(--bg);
}

summary:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

summary .chevron {
  flex-shrink: 0;
  color: var(--text-muted);
  transition: transform 0.15s;
}

details[open] summary .chevron {
  transform: rotate(180deg);
}

.answer {
  padding: 0 18px 16px;
  font-size: 0.925rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.empty {
  padding: 18px;
  border-radius: 16px;
  background: var(--bg);
  color: var(--text-muted);
}

.contact {
  padding: 26px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.contact-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.contact-lead {
  font-size: 0.925rem;
  color: var(--text-muted);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--page);
  font: inherit;
  font-weight: 400;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s;
}

.field textarea {
  resize: vertical;
  min-height: 120px;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: var(--accent);
}

.select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 36px;
  cursor: pointer;
}

.select-wrap .chevron {
  position: absolute;
  right: 14px;
  pointer-events: none;
  color: var(--text-muted);
}

.submit {
  align-self: flex-start;
  min-height: 44px;
}

.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  font-size: 0.875rem;
  color: #b42318;
}

.sent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  color: var(--text);
}

.sent svg {
  color: #12805c;
}

@media (max-width: 640px) {
  .contact {
    padding: 20px;
  }

  .submit {
    align-self: stretch;
  }
}
</style>
