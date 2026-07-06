<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LOCALES, localizedPath, type Locale } from '../../i18n/routing'

const route = useRoute()
const { t, locale } = useI18n()

const homePath = computed(() => localizedPath('/', locale.value as Locale))
const podcastPath = computed(() => localizedPath('/podcast-chapters', locale.value as Locale))

function localeLinkPath(target: Locale) {
  return localizedPath(route.path, target)
}
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <p class="footer-tagline">{{ t('common.footer.tagline') }}</p>
      </div>

      <div class="footer-links">
        <div class="footer-col">
          <h3 class="footer-heading">{{ t('common.footer.productHeading') }}</h3>
          <RouterLink :to="homePath" class="footer-link">
            {{ t('common.footer.youtubeChapters') }}
          </RouterLink>
          <RouterLink :to="podcastPath" class="footer-link">
            {{ t('common.footer.podcastChapters') }}
          </RouterLink>
        </div>

        <div class="footer-col">
          <h3 class="footer-heading">{{ t('common.footer.legalHeading') }}</h3>
          <a href="#" class="footer-link">{{ t('common.footer.privacy') }}</a>
          <a href="#" class="footer-link">{{ t('common.footer.terms') }}</a>
          <a href="#" class="footer-link">{{ t('common.footer.contact') }}</a>
        </div>

        <div class="footer-col">
          <h3 class="footer-heading">{{ t('common.footer.languageHeading') }}</h3>
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
  background: var(--surface);
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  justify-content: space-between;
}

.footer-tagline {
  font-size: 0.95rem;
  color: var(--text-muted);
  max-width: 220px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

.footer-heading {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  font-size: 0.9rem;
  color: var(--text);
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--accent);
}

.footer-link.active {
  font-weight: 500;
}

.footer-link.muted {
  color: var(--text-muted);
}

.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border);
}

.footer-bottom p {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
