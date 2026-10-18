<script setup lang="ts">
import { computed } from 'vue'
import type { AdminPayment, PaymentStatus } from '../types/payment'
import { formatDate, formatMoney, packLabel } from '../utils/format'

const props = withDefaults(defineProps<{ payments: AdminPayment[]; loading: boolean; showUser?: boolean }>(), {
  showUser: true,
})

const statusStyles: Record<PaymentStatus, string> = {
  paid: 'bg-emerald-50 text-emerald-700',
  refunded: 'bg-amber-50 text-amber-700',
}

const hasPayments = computed(() => props.payments.length > 0)
const columns = computed(() => (props.showUser ? 6 : 5))
</script>

<template>
  <div class="card overflow-x-auto">
    <table class="table min-w-[760px]">
      <thead>
        <tr>
          <th>Date</th>
          <th v-if="showUser">User</th>
          <th>Pack</th>
          <th class="text-right">Amount</th>
          <th class="text-right">Credits</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading && !hasPayments">
          <td :colspan="columns" class="py-10 text-center text-muted">Loading payments…</td>
        </tr>
        <tr v-else-if="!hasPayments">
          <td :colspan="columns" class="py-10 text-center text-muted">No payments</td>
        </tr>
        <tr v-for="payment in payments" :key="payment.id">
          <td class="whitespace-nowrap text-muted">{{ formatDate(payment.createdAt) }}</td>
          <td v-if="showUser" class="max-w-[260px] truncate">
            <RouterLink v-if="payment.userEmail" :to="`/users/${payment.userId}`" class="text-primary hover:underline">
              {{ payment.userEmail }}
            </RouterLink>
            <span v-else class="text-muted">—</span>
          </td>
          <td>{{ packLabel(payment.pack) }}</td>
          <td class="num text-right font-medium">{{ formatMoney(payment.amountCents) }}</td>
          <td class="num text-right text-muted">{{ payment.creditsGranted }}</td>
          <td>
            <span class="inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize" :class="statusStyles[payment.status]">
              {{ payment.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
