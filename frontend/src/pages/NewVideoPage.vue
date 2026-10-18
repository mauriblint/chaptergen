<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import AppLayout from '../layouts/AppLayout.vue'
import NewVideoPanel from '../components/app/NewVideoPanel.vue'
import PaywallModal from '../components/PaywallModal.vue'
import { useAuth } from '../composables/useAuth'
import { listJobs } from '../composables/useJob'
import type { PaywallReason } from '../utils/api'

const { t, locale } = useI18n()
const { ensureLoaded } = useAuth()
const layout = ref<InstanceType<typeof AppLayout> | null>(null)
const first = ref(false)
const paywallReason = ref<PaywallReason | null>(null)

useHead(computed(() => ({ title: t('app.newVideo.metaTitle'), htmlAttrs: { lang: locale.value } })))

onMounted(async () => {
  const [me, jobs] = await Promise.all([ensureLoaded(), listJobs().catch(() => [])])
  first.value = jobs.length === 0
  // Without credits there is nothing to upload yet, so go straight to the packs.
  if (me.user && me.user.totalCredits < 1) {
    paywallReason.value = me.user.hasPaid ? 'credits' : 'free_limit'
  }
})
</script>

<template>
  <AppLayout ref="layout">
    <NewVideoPanel :first="first" @choose="layout?.openPicker()" @pick="layout?.pickFile($event)" />
    <PaywallModal v-if="paywallReason" :reason="paywallReason" @close="paywallReason = null" />
  </AppLayout>
</template>
