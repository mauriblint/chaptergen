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
    await router.push({ name: 'overview' })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not sign in'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-bg px-4">
    <div class="card w-full max-w-sm p-8 shadow-[0_24px_60px_rgba(17,19,24,0.08)]">
      <div class="mb-7 flex items-center gap-2.5">
        <img src="/logo.svg" alt="" width="34" height="34" />
        <span class="font-display text-[1.35rem] font-extrabold tracking-tight">chapter<span class="text-primary">gen</span></span>
        <span class="ml-auto rounded-md bg-primary-soft px-1.5 py-0.5 text-[0.7rem] font-semibold text-primary">Admin</span>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium">Password</span>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            autofocus
            class="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm outline-none transition focus:border-primary"
          />
        </label>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button type="submit" :disabled="loading || !password" class="btn btn-ink h-11 w-full">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>
