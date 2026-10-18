<script setup lang="ts">
import { onMounted } from 'vue'
import PaginationBar from '../components/PaginationBar.vue'
import UsersTable from '../components/UsersTable.vue'
import { useAdminUsers } from '../composables/useAdminUsers'

const { users, total, offset, pageSize, loading, error, fetchUsers, nextPage, prevPage } = useAdminUsers()

onMounted(() => {
  void fetchUsers()
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="page-title">Users</h1>
        <p class="mt-1 text-sm text-muted">{{ total.toLocaleString('en-US') }} accounts. A green dot means the email is verified.</p>
      </div>
      <button type="button" class="btn btn-outline" :disabled="loading" @click="fetchUsers">
        {{ loading ? 'Refreshing…' : 'Refresh' }}
      </button>
    </div>

    <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

    <div>
      <UsersTable :users="users" :loading="loading" />
      <PaginationBar :total="total" :offset="offset" :page-size="pageSize" :loading="loading" @prev="prevPage" @next="nextPage" />
    </div>
  </div>
</template>
