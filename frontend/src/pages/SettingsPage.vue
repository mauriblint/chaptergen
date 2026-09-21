<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import MarketingLayout from '../layouts/MarketingLayout.vue'
import Card from '../components/ui/Card.vue'
import { useAuth } from '../composables/useAuth'
import { formatDate } from '../utils/format'

const { t, locale } = useI18n()
const { user, ensureLoaded } = useAuth()
const loading = ref(true)

useHead(
  computed(() => ({
    title: t('settings.metaTitle'),
    htmlAttrs: { lang: locale.value },
  }))
)

onMounted(async () => {
  await ensureLoaded()
  loading.value = false
})

const rows = computed(() => {
  if (!user.value) return []
  return [
    { label: t('settings.email'), value: user.value.email },
    { label: t('settings.language'), value: t(`common.language.${user.value.locale}`) },
    { label: t('settings.credits'), value: String(user.value.credits) },
    {
      label: t('settings.google'),
      value: user.value.googleId ? t('settings.googleConnected') : t('settings.googleNotConnected'),
    },
    { label: t('settings.createdAt'), value: formatDate(user.value.createdAt, locale.value) },
    {
      label: t('settings.lastLogin'),
      value: user.value.lastLoginAt
        ? formatDate(user.value.lastLoginAt, locale.value)
        : t('settings.never'),
    },
  ]
})
</script>

<template>
  <MarketingLayout>
    <div class="wrap">
      <div v-if="loading" class="muted">{{ t('dashboard.loading') }}</div>

      <template v-else-if="user">
        <h1>{{ t('settings.title') }}</h1>
        <p class="lead">{{ t('settings.subtitle') }}</p>

        <Card shadow="lg">
          <dl class="fields">
            <div v-for="row in rows" :key="row.label" class="row">
              <dt>{{ row.label }}</dt>
              <dd>{{ row.value }}</dd>
            </div>
          </dl>
        </Card>
      </template>
    </div>
  </MarketingLayout>
</template>

<style scoped>
.wrap {
  max-width: 640px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

h1 {
  font-size: 1.8rem;
}

.lead {
  color: var(--text-muted);
  margin: 0.35rem 0 1.5rem;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.row {
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

dt {
  font-size: 0.85rem;
  color: var(--text-muted);
}

dd {
  font-size: 0.95rem;
  word-break: break-word;
}

.muted {
  color: var(--text-muted);
}

@media (max-width: 560px) {
  .row {
    grid-template-columns: 1fr;
    gap: 0.2rem;
  }
}
</style>
