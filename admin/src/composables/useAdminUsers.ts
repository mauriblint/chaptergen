import { ref } from 'vue'
import type { UsersListResponse } from '../types/user'
import { apiFetch } from '../utils/api'
import { useAuth } from './useAuth'

const PAGE_SIZE = 50

export function useAdminUsers() {
  const { getToken } = useAuth()
  const users = ref<UsersListResponse['users']>([])
  const total = ref(0)
  const offset = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers(): Promise<void> {
    const token = getToken()
    if (!token) return

    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset.value),
      })
      const res = await apiFetch(`/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 401) {
        error.value = 'Session expired'
        return
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? 'Could not load users')
      }

      const data = (await res.json()) as UsersListResponse
      users.value = data.users
      total.value = data.total
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function nextPage(): void {
    if (offset.value + PAGE_SIZE < total.value) {
      offset.value += PAGE_SIZE
      void fetchUsers()
    }
  }

  function prevPage(): void {
    if (offset.value > 0) {
      offset.value = Math.max(0, offset.value - PAGE_SIZE)
      void fetchUsers()
    }
  }

  return {
    users,
    total,
    offset,
    pageSize: PAGE_SIZE,
    loading,
    error,
    fetchUsers,
    nextPage,
    prevPage,
  }
}
