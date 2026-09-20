<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import { useAuth } from '../composables/useAuth'
import { LOCALE_STORAGE_KEY } from '../i18n/routing'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const { requestMagicLink, magicLogin, isLoggedIn } = useAuth()

const email = ref('')
const sent = ref(false)
const error = ref<string | null>(null)
const loading = ref(false)

useHead(
  computed(() => ({
    title: t('login.metaTitle'),
    htmlAttrs: { lang: locale.value },
  }))
)

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (!token) {
    if (isLoggedIn.value) {
      await router.replace('/dashboard')
    }
    return
  }
  loading.value = true
  try {
    const user = await magicLogin(token)
    locale.value = user.locale
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, user.locale)
    } catch {
      // ignore
    }
    await router.replace('/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('login.invalidLink')
    loading.value = false
  }
})

async function onSubmit() {
  error.value = null
  loading.value = true
  try {
    await requestMagicLink(email.value)
    sent.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('login.sendError')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <MarketingLayout>
    <div class="wrap">
      <Card class="card" shadow="lg">
        <h1>{{ t('login.title') }}</h1>
        <p class="lead">{{ t('login.subtitle') }}</p>

        <form v-if="!sent" class="form" @submit.prevent="onSubmit">
          <label for="email">{{ t('login.email') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            :placeholder="t('login.placeholder')"
          />
          <Button type="submit" :disabled="loading || !email">
            {{ loading ? t('login.sending') : t('login.submit') }}
          </Button>
        </form>

        <p v-else class="ok">{{ t('login.sent') }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </Card>
    </div>
  </MarketingLayout>
</template>

<style scoped>
.wrap {
  max-width: 440px;
  margin: 4rem auto;
  padding: 0 1.5rem 4rem;
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 0.4rem;
}

.lead {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.85rem;
  font-weight: 500;
}

input {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.7rem 0.85rem;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.ok {
  color: var(--text);
}

.error {
  color: #dc2626;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}
</style>
