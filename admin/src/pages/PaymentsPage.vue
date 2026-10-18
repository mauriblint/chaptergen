<script setup lang="ts">
import { onMounted } from 'vue'
import PaginationBar from '../components/PaginationBar.vue'
import PaymentsTable from '../components/PaymentsTable.vue'
import { useAdminPayments } from '../composables/useAdminPayments'

const { payments, total, offset, pageSize, loading, error, fetchPayments, nextPage, prevPage } = useAdminPayments()

onMounted(() => {
  void fetchPayments()
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="page-title">Payments</h1>
        <p class="mt-1 text-sm text-muted">{{ total.toLocaleString('en-US') }} credit purchases through Stripe.</p>
      </div>
      <button type="button" class="btn btn-outline" :disabled="loading" @click="fetchPayments">
        {{ loading ? 'Refreshing…' : 'Refresh' }}
      </button>
    </div>

    <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

    <div>
      <PaymentsTable :payments="payments" :loading="loading" />
      <PaginationBar :total="total" :offset="offset" :page-size="pageSize" :loading="loading" @prev="prevPage" @next="nextPage" />
    </div>
  </div>
</template>
