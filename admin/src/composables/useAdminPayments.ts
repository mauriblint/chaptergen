import { ref } from 'vue'
import type { PaymentsListResponse } from '../types/payment'
import { apiFetch } from '../utils/api'
import { useAuth } from './useAuth'

const PAGE_SIZE = 50

export function useAdminPayments() {
  const { getToken } = useAuth()
  const payments = ref<PaymentsListResponse['payments']>([])
  const total = ref(0)
  const offset = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPayments(): Promise<void> {
    const token = getToken()
    if (!token) return

    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset.value),
      })
      const res = await apiFetch(`/admin/payments?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 401) {
        error.value = 'Session expired'
        return
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? 'Could not load payments')
      }

      const data = (await res.json()) as PaymentsListResponse
      payments.value = data.payments
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
      void fetchPayments()
    }
  }

  function prevPage(): void {
    if (offset.value > 0) {
      offset.value = Math.max(0, offset.value - PAGE_SIZE)
      void fetchPayments()
    }
  }

  return {
    payments,
    total,
    offset,
    pageSize: PAGE_SIZE,
    loading,
    error,
    fetchPayments,
    nextPage,
    prevPage,
  }
}
