<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuth } from '../composables/useAuth'
import { LOCALES, LOCALE_STORAGE_KEY, type Locale } from '../i18n/routing'
import { formatDate } from '../utils/format'
import { SUPPORT_EMAIL } from '../content/home'

const { t, locale } = useI18n()
const router = useRouter()
const { user, ensureLoaded, updateLocale, logout } = useAuth()
const saving = ref(false)

useHead(computed(() => ({ title: t('app.settings.metaTitle'), htmlAttrs: { lang: locale.value } })))

onMounted(async () => {
  const me = await ensureLoaded()
  if (!me.user) await router.replace('/login')
})

async function setLanguage(next: Locale) {
  if (saving.value || next === user.value?.locale) return
  saving.value = true
  try {
    await updateLocale(next)
    locale.value = next
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      // ignore
    }
  } finally {
    saving.value = false
  }
}

const deleteHref = computed(() => {
  const subject = encodeURIComponent(t('app.settings.deleteSubject'))
  const body = encodeURIComponent(t('app.settings.deleteBody', { email: user.value?.email ?? '' }))
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
})

async function onLogout() {
  await logout()
  await router.push('/')
}
</script>

<template>
  <AppLayout :crumbs="[{ label: t('app.nav.settings') }]">
    <h1 class="page-title">{{ t('app.nav.settings') }}</h1>

    <div v-if="user" class="sections">
      <section class="section">
        <div class="section-head">
          <h2 class="section-title">{{ t('app.settings.account') }}</h2>
        </div>
        <dl class="rows">
          <div class="row">
            <dt>{{ t('app.settings.email') }}</dt>
            <dd>{{ user.email }}</dd>
          </div>
          <div class="row">
            <dt>{{ t('app.settings.memberSince') }}</dt>
            <dd>{{ formatDate(user.createdAt, locale) }}</dd>
          </div>
          <div class="row">
            <dt>{{ t('app.settings.signIn') }}</dt>
            <dd class="muted">{{ t('app.settings.signInValue') }}</dd>
          </div>
        </dl>
      </section>

      <section class="section">
        <div class="section-head">
          <h2 class="section-title">{{ t('app.settings.language') }}</h2>
          <p class="section-sub">{{ t('app.settings.languageHelp') }}</p>
        </div>
        <div class="segmented" role="group" :aria-label="t('app.settings.language')">
          <button
            v-for="loc in LOCALES"
            :key="loc"
            type="button"
            :aria-pressed="user.locale === loc"
            :class="{ active: user.locale === loc }"
            :disabled="saving"
            @click="setLanguage(loc)"
          >
            {{ t(`common.language.${loc}`) }}
          </button>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <h2 class="section-title">{{ t('app.settings.session') }}</h2>
        </div>
        <button type="button" class="btn btn-ghost" @click="onLogout">{{ t('app.account.logout') }}</button>
      </section>

      <section class="section danger">
        <div class="section-head">
          <h2 class="section-title">{{ t('app.settings.deleteTitle') }}</h2>
          <p class="section-sub">{{ t('app.settings.deleteHelp') }}</p>
        </div>
        <a class="btn btn-danger" :href="deleteHref">{{ t('app.settings.deleteCta') }}</a>
      </section>
    </div>
  </AppLayout>
</template>

<style scoped>
.page-title {
  margin-bottom: 1.5rem;
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.sections {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.section-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
}

.section-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.rows {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.row {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid var(--border-soft);
  font-size: 0.9rem;
}

.row:first-child {
  border-top: 0;
  padding-top: 0;
}

dt {
  color: var(--text-muted);
}

dd {
  overflow-wrap: anywhere;
}

.muted {
  color: var(--text-muted);
}

.segmented {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: var(--bg);
}

.segmented button {
  min-height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.segmented button.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 1px 3px rgba(17, 19, 24, 0.1);
}

.btn-ghost {
  background: var(--surface);
  color: var(--text);
  border-color: var(--border);
}

.btn-ghost:hover {
  border-color: var(--text);
}

.danger {
  border-color: #f5c2c0;
}

.btn-danger {
  background: var(--surface);
  color: #b42318;
  border-color: #f5c2c0;
}

.btn-danger:hover {
  background: #fdecec;
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
}
</style>
