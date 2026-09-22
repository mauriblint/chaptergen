<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import JobsTable from '../components/JobsTable.vue'
import PaymentsTable from '../components/PaymentsTable.vue'
import { useAuth } from '../composables/useAuth'
import type { JobSummary } from '../types/job'
import type { AdminPayment } from '../types/payment'
import type { AdminUser } from '../types/user'
import { apiFetch } from '../utils/api'
import { formatDate } from '../utils/format'

const route = useRoute()
const { getToken } = useAuth()

const user = ref<AdminUser | null>(null)
const jobs = ref<JobSummary[]>([])
const payments = ref<AdminPayment[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const userId = computed(() => route.params.id as string)

async function fetchUser(): Promise<void> {
  const token = getToken()
  if (!token) return

  loading.value = true
  error.value = null

  try {
    const res = await apiFetch(`/admin/users/${userId.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      throw new Error(data.error ?? 'Could not load user')
    }
    const data = (await res.json()) as {
      user: AdminUser
      jobs: JobSummary[]
      payments: AdminPayment[]
    }
    user.value = data.user
    jobs.value = data.jobs
    payments.value = data.payments
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchUser()
})

watch(userId, () => {
  void fetchUser()
})
</script>

<template>
  <div>
    <RouterLink to="/users" class="mb-4 inline-block text-sm text-muted hover:text-text">
      ← Users
    </RouterLink>

    <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </p>

    <div v-if="user" class="mb-6 rounded-xl border border-border bg-surface p-4">
      <h2 class="mb-3 text-base font-semibold text-text">{{ user.email }}</h2>
      <dl class="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt class="text-xs uppercase tracking-wide text-muted">Credits</dt>
          <dd class="mt-0.5 text-text">{{ user.creditsRemaining }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wide text-muted">Locale</dt>
          <dd class="mt-0.5 uppercase text-text">{{ user.locale }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wide text-muted">Stripe customer</dt>
          <dd class="mt-0.5 font-mono text-xs text-text">{{ user.stripeCustomerId ?? '—' }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wide text-muted">Created</dt>
          <dd class="mt-0.5 text-text">{{ formatDate(user.createdAt) }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wide text-muted">Last login</dt>
          <dd class="mt-0.5 text-text">
            {{ user.lastLoginAt ? formatDate(user.lastLoginAt) : '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wide text-muted">Activity</dt>
          <dd class="mt-0.5 text-text">{{ user.jobCount }} jobs · {{ user.paymentCount }} payments</dd>
        </div>
      </dl>
    </div>

    <p v-else-if="loading" class="mb-6 text-sm text-muted">Loading user…</p>

    <section class="mb-6">
      <h3 class="mb-3 text-sm font-semibold text-text">Jobs</h3>
      <JobsTable :jobs="jobs" :loading="loading && !user" />
    </section>

    <section>
      <h3 class="mb-3 text-sm font-semibold text-text">Payments</h3>
      <PaymentsTable :payments="payments" :loading="loading && !user" />
    </section>
  </div>
</template>
