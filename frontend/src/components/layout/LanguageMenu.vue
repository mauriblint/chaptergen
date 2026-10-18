<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LOCALES, LOCALE_STORAGE_KEY, isAppPath, localizedPath, type Locale } from '../../i18n/routing'
import { useAuth } from '../../composables/useAuth'

const props = withDefaults(
  defineProps<{
    variant?: 'dropdown' | 'segmented'
    /** Where the dropdown opens; 'top' for menus pinned to the bottom of the screen. */
    placement?: 'bottom' | 'top'
  }>(),
  { variant: 'dropdown', placement: 'bottom' }
)

const emit = defineEmits<{ change: [] }>()

const route = useRoute()
const { t, locale } = useI18n()
const { user, updateLocale } = useAuth()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const onApp = computed(() => isAppPath(route.path))
const current = computed(() => locale.value as Locale)

function pathFor(target: Locale) {
  return localizedPath(route.path, target)
}

// Marketing pages have a URL per language, so switching is a link. App pages
// share one URL, so the locale is switched in place and saved to the account.
async function selectInApp(target: Locale) {
  if (user.value) await updateLocale(target)
  locale.value = target
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, target)
  } catch {
    // ignore
  }
  close()
}

async function onLinkSelect(target: Locale) {
  if (user.value && target !== current.value) await updateLocale(target)
  close()
}

function close() {
  open.value = false
  emit('change')
}

function onDocumentPointer(e: PointerEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointer)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointer)
})
</script>

<template>
  <div v-if="props.variant === 'segmented'" class="segmented" role="group" :aria-label="t('common.language.label')">
    <template v-for="loc in LOCALES" :key="loc">
      <button
        v-if="onApp"
        type="button"
        class="seg-option"
        :class="{ active: loc === current }"
        :aria-pressed="loc === current"
        @click="selectInApp(loc)"
      >
        {{ t(`common.language.${loc}`) }}
      </button>
      <RouterLink
        v-else
        :to="pathFor(loc)"
        class="seg-option"
        :class="{ active: loc === current }"
        :aria-current="loc === current ? 'true' : undefined"
        @click="onLinkSelect(loc)"
      >
        {{ t(`common.language.${loc}`) }}
      </RouterLink>
    </template>
  </div>

  <div v-else ref="root" class="lang-menu" @keydown="onKey">
    <button
      type="button"
      class="lang-trigger"
      :aria-expanded="open"
      aria-haspopup="true"
      :aria-label="`${t('common.language.label')}: ${t(`common.language.${current}`)}`"
      @click="open = !open"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>
      <span>{{ t(`common.language.${current}`) }}</span>
      <svg class="chevron" :class="{ up: open }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
    </button>

    <div v-if="open" class="lang-panel" :class="`lang-panel--${props.placement}`">
      <p class="panel-label">{{ t('common.language.label') }}</p>
      <template v-for="loc in LOCALES" :key="loc">
        <button
          v-if="onApp"
          type="button"
          class="lang-option"
          :class="{ active: loc === current }"
          :aria-pressed="loc === current"
          @click="selectInApp(loc)"
        >
          <span class="option-name"><span class="mono code">{{ loc.toUpperCase() }}</span>{{ t(`common.language.${loc}`) }}</span>
          <svg v-if="loc === current" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </button>
        <RouterLink
          v-else
          :to="pathFor(loc)"
          class="lang-option"
          :class="{ active: loc === current }"
          :aria-current="loc === current ? 'true' : undefined"
          @click="onLinkSelect(loc)"
        >
          <span class="option-name"><span class="mono code">{{ loc.toUpperCase() }}</span>{{ t(`common.language.${loc}`) }}</span>
          <svg v-if="loc === current" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </RouterLink>
      </template>
    </div>
  </div>
</template>

<style scoped>
.lang-menu {
  position: relative;
}

.lang-trigger {
  height: 40px;
  padding: 0 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s;
}

.lang-trigger:hover,
.lang-trigger[aria-expanded='true'] {
  border-color: var(--text);
}

.chevron {
  color: var(--text-muted);
  transition: transform 0.15s;
}

.chevron.up {
  transform: rotate(180deg);
}

.lang-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 60;
  width: 220px;
  padding: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(17, 19, 24, 0.12);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lang-panel--top {
  top: auto;
  bottom: calc(100% + 8px);
  left: 0;
  right: auto;
}

.panel-label {
  padding: 8px 10px 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

.lang-option {
  min-height: 44px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.lang-option:hover {
  background: var(--bg);
}

.lang-option.active {
  background: var(--bg);
  font-weight: 600;
}

.lang-option svg {
  color: var(--accent);
}

.option-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.code {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.segmented {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 4px;
  border-radius: 12px;
  background: var(--bg);
}

.seg-option {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
}

.seg-option.active {
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(17, 19, 24, 0.1);
}
</style>
