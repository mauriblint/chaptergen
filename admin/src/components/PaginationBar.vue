<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  offset: number
  pageSize: number
  loading?: boolean
}>()

const emit = defineEmits<{
  prev: []
  next: []
}>()

const pageInfo = computed(() => {
  const start = props.total === 0 ? 0 : props.offset + 1
  const end = Math.min(props.offset + props.pageSize, props.total)
  return { start, end }
})

const canPrev = computed(() => props.offset > 0)
const canNext = computed(() => props.offset + props.pageSize < props.total)
</script>

<template>
  <div class="mt-4 flex items-center justify-between text-sm text-muted">
    <span v-if="total > 0">
      Showing {{ pageInfo.start }}–{{ pageInfo.end }} of {{ total }}
    </span>
    <span v-else>No results</span>

    <div class="flex gap-2">
      <button
        type="button"
        class="rounded-lg border border-border px-3 py-1.5 transition hover:bg-bg disabled:opacity-40"
        :disabled="!canPrev || loading"
        @click="emit('prev')"
      >
        Previous
      </button>
      <button
        type="button"
        class="rounded-lg border border-border px-3 py-1.5 transition hover:bg-bg disabled:opacity-40"
        :disabled="!canNext || loading"
        @click="emit('next')"
      >
        Next
      </button>
    </div>
  </div>
</template>
