import { getClientId } from './clientId'

export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export type PaywallReason = 'free_limit' | 'credits' | 'refine' | 'free_duration' | 'buy'

const API_PAYWALL_REASONS = new Set(['free_limit', 'credits', 'refine'])

export function parsePaywallReason(value: unknown): PaywallReason | undefined {
  return typeof value === 'string' && API_PAYWALL_REASONS.has(value)
    ? (value as PaywallReason)
    : undefined
}

export class PaywallError extends Error {
  readonly code = 'PAYWALL'
  readonly reason?: PaywallReason
  constructor(message = 'Payment required', reason?: PaywallReason) {
    super(message)
    this.name = 'PaywallError'
    this.reason = reason
  }
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  headers.set('X-Client-Id', getClientId())

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  const data = (await response.json().catch(() => ({}))) as {
    error?: string
    code?: string
    reason?: string
  }

  if (!response.ok) {
    if (response.status === 402 || data.code === 'PAYWALL') {
      throw new PaywallError(data.error ?? 'Payment required', parsePaywallReason(data.reason))
    }
    throw new ApiError(data.error ?? `Error ${response.status}`, response.status, data.code)
  }

  return data as T
}
