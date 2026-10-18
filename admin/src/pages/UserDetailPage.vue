<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import JobsTable from '../components/JobsTable.vue'
import PaymentsTable from '../components/PaymentsTable.vue'
import type { JobSummary } from '../types/job'
import type { AdminPayment } from '../types/payment'
import type { AdminUser } from '../types/user'
import { adminGet } from '../utils/api'
import { formatDate, formatMoney, formatUsd } from '../utils/format'

const route = useRoute()

const user = ref<AdminUser | null>(null)
const jobs = ref<JobSummary[]>([])
const payments = ref<AdminPayment[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const userId = computed(() => route.params.id as string)

async function fetchUser(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const data = await adminGet<{ user: AdminUser; jobs: JobSummary[]; payments: AdminPayment[] }>(`/admin/users/${userId.value}`)
    user.value = data.user
    jobs.value = data.jobs
    payments.value = data.payments
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUser)
watch(userId, fetchUser)

const spentCents = computed(() =>
  payments.value.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amountCents, 0)
)
const aiCost = computed(() => jobs.value.reduce((sum, j) => sum + (j.aiCostUsd ?? 0), 0))
const tracked = computed(() => jobs.value.some((j) => j.aiCostUsd != null))

const stats = computed(() => {
  const u = user.value
  if (!u) return []
  return [
    { label: 'Paid credits', value: u.creditsRemaining },
    { label: 'Free credits', value: u.freeCredits },
    { label: 'Videos', value: u.jobCount },
    { label: 'Spent', value: formatMoney(spentCents.value) },
    { label: 'AI cost', value: tracked.value ? formatUsd(aiCost.value) : '—' },
  ]
})

const details = computed(() => {
  const u = user.value
  if (!u) return []
  return [
    { label: 'Email verified', value: u.emailVerifiedAt ? formatDate(u.emailVerifiedAt) : 'No' },
    { label: 'Signed up', value: formatDate(u.createdAt) },
    { label: 'Last login', value: u.lastLoginAt ? formatDate(u.lastLoginAt) : '—' },
    { label: 'Locale', value: u.locale.toUpperCase() },
    { label: 'Stripe customer', value: u.stripeCustomerId ?? '—', mono: true },
    { label: 'User ID', value: u.id, mono: true },
  ]
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <RouterLink to="/users" class="text-sm text-muted hover:text-text">← Users</RouterLink>

    <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>
    <p v-else-if="loading && !user" class="text-sm text-muted">Loading user…</p>

    <template v-if="user">
      <h1 class="page-title break-all">{{ user.email }}</h1>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div v-for="stat in stats" :key="stat.label" class="card flex flex-col gap-1 p-4">
          <span class="label">{{ stat.label }}</span>
          <span class="font-display text-[1.5rem] font-extrabold tracking-tight">{{ stat.value }}</span>
        </div>
      </div>

      <section class="card p-5">
        <dl class="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="item in details" :key="item.label">
            <dt class="label">{{ item.label }}</dt>
            <dd class="mt-0.5 break-all" :class="item.mono ? 'font-mono text-xs' : ''">{{ item.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-display text-lg font-extrabold tracking-tight">Videos</h2>
        <JobsTable :jobs="jobs" :loading="false" :show-user="false" />
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-display text-lg font-extrabold tracking-tight">Payments</h2>
        <PaymentsTable :payments="payments" :loading="false" :show-user="false" />
      </section>
    </template>
  </div>
</template>
