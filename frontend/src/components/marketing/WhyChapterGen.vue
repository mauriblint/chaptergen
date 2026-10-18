<script setup lang="ts">
import Section from '../ui/Section.vue'

defineProps<{
  eyebrow: string
  title: string
  intro: string
  outro: string
  bullets: { title: string; description: string }[]
  colYoutube: string
  colChaptergen: string
  yesLabel: string
  noLabel: string
  rows: {
    feature: string
    youtube: string
    chaptergen: string
  }[]
}>()
</script>

<template>
  <Section id="why" dark>
    <div class="grid">
      <div class="copy">
        <span class="eyebrow eyebrow-dark">{{ eyebrow }}</span>
        <h2 class="section-title">{{ title }}</h2>
        <p class="intro">{{ intro }}</p>
        <ul class="bullets">
          <li v-for="(item, i) in bullets" :key="i">
            <h3 class="bullet-title">{{ item.title }}</h3>
            <p class="bullet-desc">{{ item.description }}</p>
          </li>
        </ul>
      </div>

      <div class="table-col">
        <div class="table-wrap">
          <table class="comparison">
            <thead>
              <tr>
                <td />
                <th scope="col">{{ colYoutube }}</th>
                <th scope="col" class="ours">{{ colChaptergen }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in rows" :key="i">
                <th scope="row">{{ row.feature }}</th>
                <td class="theirs">
                  {{ row.youtube === 'no' ? noLabel : row.youtube === 'yes' ? yesLabel : row.youtube }}
                </td>
                <td class="ours">
                  <svg
                    v-if="row.chaptergen === 'yes'"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    role="img"
                    :aria-label="yesLabel"
                  ><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  <template v-else>{{ row.chaptergen }}</template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="outro">{{ outro }}</p>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 4.5rem;
  align-items: center;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.eyebrow-dark {
  color: var(--accent-on-ink);
}

.intro {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--on-ink-muted);
}

.bullets {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.4rem 1.75rem;
  margin-top: 0.75rem;
}

.bullet-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.bullet-desc {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--on-ink-muted);
}

.table-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.table-wrap {
  border: 1px solid var(--ink-line);
  border-radius: var(--radius-lg);
  overflow-x: auto;
}

.comparison {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.comparison thead {
  background: var(--ink-2);
}

.comparison th,
.comparison td {
  padding: 1.1rem 1.4rem;
  text-align: center;
}

.comparison thead th {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--on-ink-muted);
}

.comparison thead th.ours {
  color: #fff;
}

.comparison tbody tr {
  border-top: 1px solid var(--ink-line);
}

.comparison tbody th {
  text-align: left;
  font-weight: 400;
}

.theirs {
  color: #8a8f98;
}

td.ours {
  color: var(--accent-on-ink);
  font-weight: 600;
}

td.ours svg {
  display: inline-block;
  vertical-align: middle;
}

.outro {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--on-ink-muted);
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.5rem;
  }
}

@media (max-width: 640px) {
  .bullets {
    grid-template-columns: minmax(0, 1fr);
  }

  .comparison th,
  .comparison td {
    padding: 0.85rem 0.75rem;
  }

  .comparison {
    font-size: 0.85rem;
  }
}
</style>
