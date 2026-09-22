<script setup lang="ts">
import { computed } from 'vue'
import type { AdminUser } from '../types/user'
import { formatDate } from '../utils/format'

const props = defineProps<{
  users: AdminUser[]
  loading: boolean
}>()

const hasUsers = computed(() => props.users.length > 0)
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-border bg-surface">
    <table class="w-full min-w-[860px] text-left text-sm">
      <thead>
        <tr class="border-b border-border bg-bg text-xs uppercase tracking-wide text-muted">
          <th class="px-4 py-3 font-medium">Email</th>
          <th class="px-4 py-3 font-medium">Credits</th>
          <th class="px-4 py-3 font-medium">Locale</th>
          <th class="px-4 py-3 font-medium">Jobs</th>
          <th class="px-4 py-3 font-medium">Payments</th>
          <th class="px-4 py-3 font-medium">Stripe</th>
          <th class="px-4 py-3 font-medium">Created</th>
          <th class="px-4 py-3 font-medium">Last login</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading && !hasUsers">
          <td colspan="8" class="px-4 py-8 text-center text-muted">Loading users…</td>
        </tr>
        <tr v-else-if="!hasUsers">
          <td colspan="8" class="px-4 py-8 text-center text-muted">No users</td>
        </tr>
        <tr
          v-for="user in users"
          :key="user.id"
          class="border-b border-border last:border-0 hover:bg-bg/60"
        >
          <td class="px-4 py-3 font-medium">
            <RouterLink :to="`/users/${user.id}`" class="text-primary hover:underline">
              {{ user.email }}
            </RouterLink>
          </td>
          <td class="px-4 py-3 text-muted">{{ user.creditsRemaining }}</td>
          <td class="px-4 py-3 uppercase text-muted">{{ user.locale }}</td>
          <td class="px-4 py-3 text-muted">{{ user.jobCount }}</td>
          <td class="px-4 py-3 text-muted">{{ user.paymentCount }}</td>
          <td class="max-w-[160px] truncate px-4 py-3 font-mono text-xs text-muted">
            {{ user.stripeCustomerId ?? '—' }}
          </td>
          <td class="whitespace-nowrap px-4 py-3 text-muted">
            {{ formatDate(user.createdAt) }}
          </td>
          <td class="whitespace-nowrap px-4 py-3 text-muted">
            {{ user.lastLoginAt ? formatDate(user.lastLoginAt) : '—' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
