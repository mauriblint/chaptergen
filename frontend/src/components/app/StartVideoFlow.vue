<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import EmailGateModal from '../auth/EmailGateModal.vue'
import FileChip from './FileChip.vue'
import PaywallModal from '../PaywallModal.vue'
import { useAuth, type VerifyCodeResult } from '../../composables/useAuth'
import { useChunkedUpload } from '../../composables/useChunkedUpload'
import { PaywallError, type PaywallReason } from '../../utils/api'
import { trackUpload, trackUploadError } from '../../utils/analytics'

/**
 * One flow for every "new video" entry point. Signed-in users upload and go
 * straight to processing. Visitors start uploading at once while they confirm
 * their email; processing (the part that costs money) starts after that.
 */
const { t } = useI18n()
const router = useRouter()
const { ensureLoaded } = useAuth()
const { progress, startUpload, startJob } = useChunkedUpload()

const phase = ref<'idle' | 'gate' | 'working'>('idle')
const file = ref<File | null>(null)
const uploadError = ref<string | null>(null)
const workError = ref<string | null>(null)
const paywallReason = ref<PaywallReason | null>(null)
let pendingUpload: Promise<string | null> | null = null

const percent = computed(() => (phase.value === 'idle' ? null : progress.value?.percent ?? 0))
const busy = computed(() => phase.value !== 'idle')

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : t('app.upload.failed')
}

function beginUpload(selected: File): Promise<string | null> {
  uploadError.value = null
  return startUpload(selected).catch((err) => {
    uploadError.value = messageOf(err)
    trackUploadError(uploadError.value)
    return null
  })
}

async function launch(uploadPromise: Promise<string | null>) {
  phase.value = 'working'
  workError.value = null
  const uploadId = await uploadPromise
  if (!uploadId) {
    workError.value = uploadError.value ?? t('app.upload.failed')
    return
  }
  try {
    const id = await startJob(uploadId)
    phase.value = 'idle'
    await router.push(`/videos/${id}`)
  } catch (err) {
    phase.value = 'idle'
    if (err instanceof PaywallError) {
      paywallReason.value = err.reason ?? 'credits'
      return
    }
    workError.value = messageOf(err)
    phase.value = 'working'
  }
}

async function pick(selected: File) {
  if (busy.value) return
  file.value = selected
  trackUpload()
  const me = await ensureLoaded()

  if (me.user) {
    if (me.user.totalCredits < 1) {
      paywallReason.value = me.user.hasPaid ? 'credits' : 'free_limit'
      return
    }
    await launch(beginUpload(selected))
    return
  }

  pendingUpload = beginUpload(selected)
  phase.value = 'gate'
}

async function onVerified(result: VerifyCodeResult) {
  if (result.user.totalCredits < 1) {
    // Account exists, but this device or IP already used its free videos.
    phase.value = 'idle'
    paywallReason.value = 'free_limit'
    return
  }
  await launch(pendingUpload ?? Promise.resolve(null))
}

function cancel() {
  phase.value = 'idle'
  workError.value = null
  pendingUpload = null
}

defineExpose({ pick, busy })
</script>

<template>
  <EmailGateModal
    v-if="phase === 'gate' && file"
    :file-name="file.name"
    :percent="percent"
    :upload-error="uploadError"
    @close="cancel"
    @verified="onVerified"
  />

  <Teleport v-if="phase === 'working' && file" to="body">
    <div class="overlay">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="t('app.upload.startingTitle')">
        <FileChip :name="file.name" :percent="percent" :error="workError" />
        <div class="copy">
          <h2 class="title">{{ workError ? t('app.upload.failedTitle') : t('app.upload.startingTitle') }}</h2>
          <p class="lead">{{ workError ? t('app.upload.failedLead') : t('app.upload.startingLead') }}</p>
        </div>
        <button v-if="workError" type="button" class="btn btn-ink" @click="cancel">{{ t('app.common.close') }}</button>
        <span v-else class="spinner" aria-hidden="true" />
      </div>
    </div>
  </Teleport>

  <PaywallModal v-if="paywallReason" :reason="paywallReason" @close="paywallReason = null" />
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(17, 19, 24, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  width: 100%;
  max-width: 440px;
  padding: 1.75rem;
  background: var(--surface);
  border-radius: 22px;
  box-shadow: 0 30px 80px rgba(17, 19, 24, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.lead {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.spinner {
  align-self: center;
  width: 28px;
  height: 28px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
