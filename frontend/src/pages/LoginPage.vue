<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import Logo from '../components/ui/Logo.vue'
import EmailCodeForm from '../components/auth/EmailCodeForm.vue'
import { useAuth, type AuthUser } from '../composables/useAuth'
import { LOCALE_STORAGE_KEY, localizedPath, type Locale } from '../i18n/routing'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const { magicLogin, ensureLoaded } = useAuth()

const error = ref<string | null>(null)
const checking = ref(true)

useHead(
  computed(() => ({
    title: t('app.login.metaTitle'),
    htmlAttrs: { lang: locale.value },
    meta: [{ name: 'robots', content: 'noindex' }],
  }))
)

/** Only same-site paths are allowed as a redirect target. */
const next = computed(() => {
  const value = typeof route.query.next === 'string' ? route.query.next : ''
  return value.startsWith('/') && !value.startsWith('//') ? value : '/library'
})

function applyLocale(user: AuthUser) {
  locale.value = user.locale
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, user.locale)
  } catch {
    // ignore
  }
}

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (token) {
    try {
      applyLocale(await magicLogin(token))
      await router.replace(next.value)
      return
    } catch {
      error.value = t('app.login.invalidLink')
    }
  } else {
    const me = await ensureLoaded()
    if (me.user) {
      await router.replace(next.value)
      return
    }
  }
  checking.value = false
})

async function onVerified(result: { user: AuthUser }) {
  applyLocale(result.user)
  await router.replace(next.value)
}
</script>

<template>
  <div class="login">
    <RouterLink :to="localizedPath('/', locale as Locale)" class="logo" :aria-label="t('common.nav.homeLabel')">
      <Logo />
    </RouterLink>
    <main class="card">
      <div v-if="checking && !error" class="checking" role="status">
        <span class="spinner" aria-hidden="true" />
        {{ t('app.login.checking') }}
      </div>
      <template v-else>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <EmailCodeForm variant="login" @verified="onVerified" />
      </template>
    </main>
    <p class="foot">
      {{ t('app.login.noAccount') }}
      <RouterLink :to="localizedPath('/', locale as Locale)">{{ t('app.login.tryFree') }}</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  padding: 2.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background: var(--bg);
}

.logo {
  display: flex;
}

.card {
  width: 100%;
  max-width: 440px;
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: 22px;
  background: var(--surface);
  box-shadow: 0 18px 50px rgba(17, 19, 24, 0.06);
}

.checking {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  margin-bottom: 1rem;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fdecec;
  color: #b42318;
  font-size: 0.875rem;
}

.foot {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.foot a {
  font-weight: 600;
  color: var(--accent);
}

@media (max-width: 520px) {
  .card {
    padding: 1.5rem 1.25rem;
  }
}
</style>
