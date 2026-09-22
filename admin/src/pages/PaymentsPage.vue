<script setup lang="ts">
import { onMounted } from 'vue'
import PaginationBar from '../components/PaginationBar.vue'
import PaymentsTable from '../components/PaymentsTable.vue'
import { useAdminPayments } from '../composables/useAdminPayments'

const {
  payments,
  total,
  offset,
  pageSize,
  loading,
  error,
  fetchPayments,
  nextPage,
  prevPage,
} = useAdminPayments()

onMounted(() => {
  void fetchPayments()
})
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-end">
      <button
        type="button"
        class="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-bg hover:text-text disabled:opacity-50"
        :disabled="loading"
        @click="fetchPayments"
      >
        {{ loading ? 'Refreshing…' : 'Refresh' }}
      </button>
    </div>

    <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </p>

    <PaymentsTable :payments="payments" :loading="loading" />
    <PaginationBar
      :total="total"
      :offset="offset"
      :page-size="pageSize"
      :loading="loading"
      @prev="prevPage"
      @next="nextPage"
    />
  </div>
</template>
