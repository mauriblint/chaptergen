<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <p class="footer-tagline">AI chapters for every story.</p>
      </div>

      <div class="footer-links">
        <div class="footer-col">
          <h3 class="footer-heading">Product</h3>
          <RouterLink to="/" class="footer-link">YouTube Chapters</RouterLink>
          <RouterLink to="/podcast-chapters" class="footer-link">Podcast Chapters</RouterLink>
        </div>

        <div class="footer-col">
          <h3 class="footer-heading">Legal</h3>
          <a href="#" class="footer-link">Privacy</a>
          <a href="#" class="footer-link">Terms</a>
          <a href="#" class="footer-link">Contact</a>
        </div>

        <div class="footer-col">
          <h3 class="footer-heading">Language</h3>
          <span class="footer-link active">English</span>
          <a href="#" class="footer-link muted">Español (coming soon)</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} ChapterGen. All rights reserved.</p>
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
