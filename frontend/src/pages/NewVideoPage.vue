<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import AppLayout from '../layouts/AppLayout.vue'
import NewVideoPanel from '../components/app/NewVideoPanel.vue'
import { listJobs } from '../composables/useJob'

// Without credits the upload flow itself opens the credits modal when a file is picked.
const { t, locale } = useI18n()
const layout = ref<InstanceType<typeof AppLayout> | null>(null)
const first = ref(false)

useHead(computed(() => ({ title: t('app.newVideo.metaTitle'), htmlAttrs: { lang: locale.value } })))

onMounted(async () => {
  first.value = (await listJobs().catch(() => [])).length === 0
})
</script>

<template>
  <AppLayout ref="layout">
    <NewVideoPanel :first="first" @pick="layout?.pickFile($event)" />
  </AppLayout>
</template>
