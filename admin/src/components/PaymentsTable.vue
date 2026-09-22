<script setup lang="ts">
import { computed } from 'vue'
import type { AdminPayment, PaymentStatus } from '../types/payment'
import { formatDate, formatMoney, packLabel } from '../utils/format'

const props = defineProps<{
  payments: AdminPayment[]
  loading: boolean
}>()

const statusColors: Record<PaymentStatus, string> = {
  paid: 'bg-green-100 text-green-700',
  refunded: 'bg-amber-100 text-amber-700',
}

const hasPayments = computed(() => props.payments.length > 0)
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-border bg-surface">
    <table class="w-full min-w-[860px] text-left text-sm">
      <thead>
        <tr class="border-b border-border bg-bg text-xs uppercase tracking-wide text-muted">
          <th class="px-4 py-3 font-medium">Date</th>
          <th class="px-4 py-3 font-medium">Email</th>
          <th class="px-4 py-3 font-medium">Pack</th>
          <th class="px-4 py-3 font-medium">Amount</th>
          <th class="px-4 py-3 font-medium">Credits</th>
          <th class="px-4 py-3 font-medium">Status</th>
          <th class="px-4 py-3 font-medium">Session</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading && !hasPayments">
          <td colspan="7" class="px-4 py-8 text-center text-muted">Loading payments…</td>
        </tr>
        <tr v-else-if="!hasPayments">
          <td colspan="7" class="px-4 py-8 text-center text-muted">No payments</td>
        </tr>
        <tr
          v-for="payment in payments"
          :key="payment.id"
          class="border-b border-border last:border-0 hover:bg-bg/60"
        >
          <td class="whitespace-nowrap px-4 py-3 text-muted">
            {{ formatDate(payment.createdAt) }}
          </td>
          <td class="px-4 py-3 font-medium">
            <RouterLink
              v-if="payment.userEmail"
              :to="`/users/${payment.userId}`"
              class="text-primary hover:underline"
            >
              {{ payment.userEmail }}
            </RouterLink>
            <span v-else>—</span>
          </td>
          <td class="px-4 py-3 text-muted">{{ packLabel(payment.pack) }}</td>
          <td class="px-4 py-3 font-medium">{{ formatMoney(payment.amountCents) }}</td>
          <td class="px-4 py-3 text-muted">{{ payment.creditsGranted }}</td>
          <td class="px-4 py-3">
            <span
              class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
              :class="statusColors[payment.status]"
            >
              {{ payment.status }}
            </span>
          </td>
          <td class="max-w-[200px] truncate px-4 py-3 font-mono text-xs text-muted" :title="payment.stripeCheckoutSessionId">
            {{ payment.stripeCheckoutSessionId }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
