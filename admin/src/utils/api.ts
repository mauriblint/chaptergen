import { useAuth } from '../composables/useAuth'

export const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${path}`, init)
}

/** GET an admin endpoint as JSON; a 401 signs out and returns to the login page. */
export async function adminGet<T>(path: string): Promise<T> {
  const { getToken, logout } = useAuth()
  const res = await apiFetch(path, { headers: { Authorization: `Bearer ${getToken() ?? ''}` } })
  if (res.status === 401) {
    logout()
    window.location.assign('/login')
    throw new Error('Session expired')
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(data.error ?? `Error ${res.status}`)
  }
  return (await res.json()) as T
}
