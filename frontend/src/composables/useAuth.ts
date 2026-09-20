import { computed, ref } from 'vue'
import { apiFetch } from '../utils/api'
import type { Locale } from '../i18n/routing'

export interface AuthUser {
  id: string
  email: string
  credits: number
  locale: Locale
  googleId: string | null
}

export interface AuthMe {
  user: AuthUser | null
  freeUsed: number
  freeLimit: number
  freeMaxMinutes: number
}

export interface AccountPayment {
  id: string
  pack: 'starter' | 'creator'
  creditsGranted: number
  amountCents: number
  status: 'paid' | 'refunded'
  createdAt: string
}

export interface AccountJob {
  id: string
  status: string
  fileName: string
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
  id: 'starter' | 'creator'
  credits: number
  amountCents: number
}

const me = ref<AuthMe | null>(null)
const loaded = ref(false)
const loading = ref(false)

export function useAuth() {
  const user = computed(() => me.value?.user ?? null)
  const credits = computed(() => me.value?.user?.credits ?? 0)
  const isLoggedIn = computed(() => !!me.value?.user)
  const atFreeLimit = computed(() => {
    if (!me.value || me.value.user) return false
    return me.value.freeUsed >= me.value.freeLimit
  })

  async function refresh(): Promise<AuthMe> {
    loading.value = true
    try {
      const data = await apiFetch<AuthMe>('/auth/me')
      me.value = data
      loaded.value = true
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
    me.value = {
      user: null,
      freeUsed: me.value?.freeUsed ?? 0,
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

  async function requestMagicLink(email: string): Promise<void> {
    await apiFetch('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
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
    const data = await apiFetch<{ user: AuthUser }>('/billing/claim', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    })
    await refresh()
    return data.user
  }

  async function startCheckout(pack: Pack['id'], locale: Locale): Promise<string> {
    const data = await apiFetch<{ url: string }>('/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ pack, locale }),
    })
    return data.url
  }

  async function fetchAccount(): Promise<AccountPayload> {
    return apiFetch<AccountPayload>('/account')
  }

  async function fetchPacks(): Promise<Pack[]> {
    const data = await apiFetch<{ packs: Pack[] }>('/billing/packs')
    return data.packs
  }

  return {
    me,
    user,
    credits,
    isLoggedIn,
    atFreeLimit,
    loaded,
    loading,
    refresh,
    ensureLoaded,
    logout,
    updateLocale,
    requestMagicLink,
    magicLogin,
    claimCheckout,
    startCheckout,
    fetchAccount,
    fetchPacks,
  }
}
