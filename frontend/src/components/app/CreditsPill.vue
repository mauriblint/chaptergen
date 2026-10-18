<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../../composables/useAuth'

const emit = defineEmits<{ buy: [] }>()
const { t } = useI18n()
const { user, me } = useAuth()

// Accounts that never paid see their free videos as a meter; paying accounts
// just see the balance.
const freeMode = computed(() => !!user.value && !user.value.hasPaid)
const freeLimit = computed(() => me.value?.freeLimit ?? 2)
const freeLeft = computed(() => user.value?.freeCredits ?? 0)
const total = computed(() => user.value?.totalCredits ?? 0)
const empty = computed(() => total.value < 1)
const label = computed(() =>
  freeMode.value
    ? t('app.credits.freeLeft', { left: freeLeft.value, total: freeLimit.value })
    : t('app.credits.count', { n: total.value }, total.value)
)
</script>

<template>
  <button
    v-if="user"
    type="button"
    class="pill"
    :class="{ empty }"
    :aria-label="`${label}. ${t('app.nav.buyCredits')}`"
    @click="emit('buy')"
  >
    <span v-if="freeMode" class="meter" aria-hidden="true">
      <span :style="{ width: `${Math.min(100, ((freeLimit - freeLeft) / freeLimit) * 100)}%` }" />
    </span>
    <span v-else class="dot" aria-hidden="true" />
    <span class="text">{{ label }}</span>
    <span v-if="empty" class="cta">{{ t('app.nav.buyCredits') }}</span>
  </button>
</template>

<style scoped>
.pill {
  height: 36px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
}

.pill:hover {
  border-color: var(--text);
}

.meter {
  width: 48px;
  height: 5px;
  border-radius: 3px;
  background: var(--border);
  overflow: hidden;
}

.meter span {
  display: block;
  height: 100%;
  background: var(--accent-bright);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-bright);
}

.empty .dot {
  background: #d92d20;
}

.cta {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-weight: 600;
}

@media (max-width: 640px) {
  .meter {
    display: none;
  }

  .cta {
    display: none;
  }
}
</style>
