import { computed, ref } from 'vue'
import { apiFetch } from '../utils/api'

const TOKEN_KEY = 'chaptergen_admin_token'
const token = ref<string | null>(sessionStorage.getItem(TOKEN_KEY))

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  async function login(password: string): Promise<void> {
    const res = await apiFetch('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      throw new Error(data.error ?? 'Error al iniciar sesión')
    }

    const data = (await res.json()) as { token: string }
    token.value = data.token
    sessionStorage.setItem(TOKEN_KEY, data.token)
  }

  function logout(): void {
    token.value = null
    sessionStorage.removeItem(TOKEN_KEY)
  }

  function getToken(): string | null {
    return token.value
  }

  return { isAuthenticated, login, logout, getToken }
}
