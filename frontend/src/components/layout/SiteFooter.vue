<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Logo from '../ui/Logo.vue'
import { LOCALES, localizedPath, type Locale } from '../../i18n/routing'
import { SUPPORT_EMAIL } from '../../content/home'

const route = useRoute()
const { t, locale } = useI18n()

function path(en: string) {
  return localizedPath(en, locale.value as Locale)
}

const homePath = computed(() => path('/'))
const podcastPath = computed(() => path('/podcast-chapters'))
const pricingPath = computed(() => path('/pricing'))
const aboutPath = computed(() => path('/about'))
const privacyPath = computed(() => path('/privacy'))
const termsPath = computed(() => path('/terms'))

function localeLinkPath(target: Locale) {
  return localizedPath(route.path, target)
}
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <RouterLink :to="homePath" :aria-label="t('common.nav.homeLabel')">
          <Logo :size="30" />
        </RouterLink>
        <p class="footer-tagline">{{ t('common.footer.tagline') }}</p>
      </div>

      <div class="footer-links">
        <div class="footer-col">
          <h2 class="footer-heading">{{ t('common.footer.productHeading') }}</h2>
          <RouterLink :to="homePath" class="footer-link">
            {{ t('common.footer.youtubeChapters') }}
          </RouterLink>
          <RouterLink :to="podcastPath" class="footer-link">
            {{ t('common.footer.podcastChapters') }}
          </RouterLink>
          <RouterLink :to="pricingPath" class="footer-link">
            {{ t('common.nav.pricing') }}
          </RouterLink>
        </div>

        <div class="footer-col">
          <h2 class="footer-heading">{{ t('common.footer.companyHeading') }}</h2>
          <RouterLink :to="aboutPath" class="footer-link">{{ t('common.footer.about') }}</RouterLink>
          <a :href="`mailto:${SUPPORT_EMAIL}`" class="footer-link">{{ t('common.footer.contact') }}</a>
          <RouterLink :to="privacyPath" class="footer-link">{{ t('common.footer.privacy') }}</RouterLink>
          <RouterLink :to="termsPath" class="footer-link">{{ t('common.footer.terms') }}</RouterLink>
        </div>

        <div class="footer-col">
          <h2 class="footer-heading">{{ t('common.footer.languageHeading') }}</h2>
          <template v-for="loc in LOCALES" :key="loc">
            <span v-if="loc === locale" class="footer-link active">
              {{ t(`common.language.${loc}`) }}
            </span>
            <RouterLink v-else :to="localeLinkPath(loc)" class="footer-link">
              {{ t(`common.language.${loc}`) }}
            </RouterLink>
          </template>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} ChapterGen. {{ t('common.footer.rights') }}</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: auto;
  padding: 0 1.5rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4.5rem 0 3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  justify-content: space-between;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  max-width: 300px;
}

.footer-tagline {
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--text-muted);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem 5rem;
}

.footer-heading {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.4rem;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-link {
  font-size: 0.95rem;
  color: var(--text);
  transition: color 0.15s;
}

.footer-link:hover {
  color: var(--accent);
}

.footer-link.active {
  color: var(--text-muted);
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 0 2.5rem;
  border-top: 1px solid var(--border);
}

.footer-bottom p {
  font-size: 0.8rem;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .site-footer {
    padding: 0 1rem;
  }

  .footer-inner {
    padding-top: 3rem;
  }
}
</style>
