<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  if (!password.value) return
  loading.value = true
  error.value = null
  try {
    await login(password.value)
    await router.push({ name: 'users' })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not sign in'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <div class="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-lg">
      <div class="mb-6 flex items-center gap-2.5">
        <img src="/logo.svg" alt="" width="28" height="28" class="block" />
        <div>
          <h1 class="text-lg font-semibold leading-tight text-text">ChapterGen</h1>
          <p class="text-sm text-muted">Admin</p>
        </div>
      </div>
      <p class="mb-6 text-sm text-muted">Enter the admin password to continue.</p>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="password" class="mb-1.5 block text-sm font-medium text-text">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary"
            placeholder="••••••••"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading || !password"
          class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>
