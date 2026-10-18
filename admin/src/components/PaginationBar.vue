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
  <div v-if="total > pageSize || offset > 0" class="mt-3 flex items-center justify-between text-sm text-muted">
    <span class="num">{{ pageInfo.start }}–{{ pageInfo.end }} of {{ total.toLocaleString('en-US') }}</span>
    <div class="flex gap-2">
      <button type="button" class="btn btn-outline" :disabled="!canPrev || loading" @click="emit('prev')">Previous</button>
      <button type="button" class="btn btn-outline" :disabled="!canNext || loading" @click="emit('next')">Next</button>
    </div>
  </div>
</template>
