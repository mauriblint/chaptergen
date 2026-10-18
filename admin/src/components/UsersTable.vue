<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { AdminUser } from '../types/user'
import { formatDate } from '../utils/format'

const props = defineProps<{
  users: AdminUser[]
  loading: boolean
}>()

const router = useRouter()
const hasUsers = computed(() => props.users.length > 0)
</script>

<template>
  <div class="card overflow-x-auto">
    <table class="table min-w-[860px]">
      <thead>
        <tr>
          <th>Email</th>
          <th class="text-right">Paid credits</th>
          <th class="text-right">Free credits</th>
          <th class="text-right">Jobs</th>
          <th class="text-right">Payments</th>
          <th>Locale</th>
          <th>Signed up</th>
          <th>Last login</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading && !hasUsers">
          <td colspan="8" class="py-10 text-center text-muted">Loading users…</td>
        </tr>
        <tr v-else-if="!hasUsers">
          <td colspan="8" class="py-10 text-center text-muted">No users</td>
        </tr>
        <tr v-for="user in users" :key="user.id" class="row-link" @click="router.push(`/users/${user.id}`)">
          <td class="max-w-[280px]">
            <span class="flex items-center gap-2">
              <span
                class="size-1.5 shrink-0 rounded-full"
                :class="user.emailVerifiedAt ? 'bg-emerald-500' : 'bg-border'"
                :title="user.emailVerifiedAt ? 'Email verified' : 'Not verified'"
              />
              <span class="truncate font-medium">{{ user.email }}</span>
            </span>
          </td>
          <td class="num text-right" :class="user.creditsRemaining ? 'font-medium' : 'text-muted'">{{ user.creditsRemaining }}</td>
          <td class="num text-right text-muted">{{ user.freeCredits }}</td>
          <td class="num text-right">{{ user.jobCount }}</td>
          <td class="num text-right" :class="user.paymentCount ? 'font-medium text-primary' : 'text-muted'">{{ user.paymentCount }}</td>
          <td class="uppercase text-muted">{{ user.locale }}</td>
          <td class="whitespace-nowrap text-muted">{{ formatDate(user.createdAt) }}</td>
          <td class="whitespace-nowrap text-muted">{{ user.lastLoginAt ? formatDate(user.lastLoginAt) : '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
