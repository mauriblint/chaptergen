import { computed, ref } from 'vue'
import { apiFetch } from '../utils/api'
import {
  identifyUser,
  resetAnalytics,
  trackPaymentCompleted,
  trackViewCheckout,
} from '../utils/analytics'
import type { Locale } from '../i18n/routing'

export interface AuthUser {
  id: string
  email: string
  /** Paid credits. */
  credits: number
  freeCredits: number
  totalCredits: number
  hasPaid: boolean
  locale: Locale
  googleId: string | null
  pictureUrl: string | null
  createdAt: string
  lastLoginAt: string | null
}

export interface AuthMe {
  user: AuthUser | null
  freeLimit: number
  freeMaxMinutes: number
}

export interface VerifyCodeResult {
  user: AuthUser
  created: boolean
  freeGranted: number
}

export interface AccountPayment {
  id: string
  pack: 'starter' | 'creator' | 'studio'
  creditsGranted: number
  amountCents: number
  status: 'paid' | 'refunded'
  createdAt: string
}

export interface AccountJob {
  id: string
  status: string
  fileName: string
  fileExtension: string | null
  chaptersGenerated: number | null
  durationSeconds: number | null
  createdAt: string
}

export interface AccountPayload {
  user: AuthUser
  payments: AccountPayment[]
  jobs: AccountJob[]
}

export interface Pack {
  id: 'starter' | 'creator' | 'studio'
  credits: number
  amountCents: number
}

const me = ref<AuthMe | null>(null)
const loaded = ref(false)
const loading = ref(false)

export function useAuth() {
  const user = computed(() => me.value?.user ?? null)
  const credits = computed(() => me.value?.user?.totalCredits ?? 0)
  const isLoggedIn = computed(() => !!me.value?.user)

  async function refresh(): Promise<AuthMe> {
    loading.value = true
    try {
      const data = await apiFetch<AuthMe>('/auth/me')
      me.value = data
      loaded.value = true
      if (data.user) {
        identifyUser(data.user)
      }
      return data
    } finally {
      loading.value = false
    }
  }

  async function ensureLoaded(): Promise<AuthMe> {
    if (loaded.value && me.value) return me.value
    return refresh()
  }

  async function logout(): Promise<void> {
    await apiFetch('/auth/logout', { method: 'POST' })
    resetAnalytics()
    me.value = {
      user: null,
      freeLimit: me.value?.freeLimit ?? 2,
      freeMaxMinutes: me.value?.freeMaxMinutes ?? 20,
    }
  }

  async function updateLocale(locale: Locale): Promise<void> {
    const data = await apiFetch<{ user: AuthUser }>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify({ locale }),
    })
    if (me.value) me.value = { ...me.value, user: data.user }
  }

  /** Sends a 6-digit code. Works for new and existing accounts. */
  async function requestCode(email: string, locale: Locale): Promise<void> {
    await apiFetch('/auth/code/request', {
      method: 'POST',
      body: JSON.stringify({ email, locale }),
    })
  }

  async function verifyCode(email: string, code: string, locale: Locale): Promise<VerifyCodeResult> {
    const data = await apiFetch<VerifyCodeResult>('/auth/code/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code, locale }),
    })
    await refresh()
    return data
  }

  async function magicLogin(token: string): Promise<AuthUser> {
    const data = await apiFetch<{ user: AuthUser }>('/auth/magic-login', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
    await refresh()
    return data.user
  }

  async function claimCheckout(sessionId: string): Promise<AuthUser> {
    const data = await apiFetch<{
      user: AuthUser
      payment?: { pack: Pack['id']; creditsGranted: number; created: boolean }
    }>('/billing/claim', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    })
    await refresh()
    if (data.payment) {
      const key = `analytics:PaymentCompleted:${sessionId}`
      let alreadyTracked = false
      try {
        alreadyTracked = sessionStorage.getItem(key) === '1'
        if (!alreadyTracked) sessionStorage.setItem(key, '1')
      } catch {
        // ignore
      }
      if (!alreadyTracked) {
        trackPaymentCompleted({
          plan: data.payment.pack,
          credits: data.payment.creditsGranted,
        })
      }
    }
    return data.user
  }

  async function startCheckout(pack: Pack['id'], locale: Locale): Promise<string> {
    const data = await apiFetch<{ url: string }>('/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ pack, locale }),
    })
    trackViewCheckout(pack)
    return data.url
  }

  async function fetchAccount(): Promise<AccountPayload> {
    return apiFetch<AccountPayload>('/account')
  }

  async function fetchPacks(): Promise<Pack[]> {
    const data = await apiFetch<{ packs: Pack[] }>('/billing/packs')
    return data.packs
  }

  async function sendSupport(subject: string, message: string): Promise<void> {
    await apiFetch('/support', {
      method: 'POST',
      body: JSON.stringify({ subject, message }),
    })
  }

  return {
    me,
    user,
    credits,
    isLoggedIn,
    loaded,
    loading,
    refresh,
    ensureLoaded,
    logout,
    updateLocale,
    requestCode,
    verifyCode,
    magicLogin,
    claimCheckout,
    startCheckout,
    fetchAccount,
    fetchPacks,
    sendSupport,
  }
}
