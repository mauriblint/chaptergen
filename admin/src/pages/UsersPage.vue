<script setup lang="ts">
import { onMounted } from 'vue'
import PaginationBar from '../components/PaginationBar.vue'
import UsersTable from '../components/UsersTable.vue'
import { useAdminUsers } from '../composables/useAdminUsers'

const {
  users,
  total,
  offset,
  pageSize,
  loading,
  error,
  fetchUsers,
  nextPage,
  prevPage,
} = useAdminUsers()

onMounted(() => {
  void fetchUsers()
})
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-end">
      <button
        type="button"
        class="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:bg-bg hover:text-text disabled:opacity-50"
        :disabled="loading"
        @click="fetchUsers"
      >
        {{ loading ? 'Refreshing…' : 'Refresh' }}
      </button>
    </div>

    <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </p>

    <UsersTable :users="users" :loading="loading" />
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
