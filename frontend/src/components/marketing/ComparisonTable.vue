<script setup lang="ts">
import Section from '../ui/Section.vue'

defineProps<{
  title: string
  intro: string
  outro: string
  colYoutube: string
  colChaptergen: string
  rows: {
    feature: string
    youtube: string
    chaptergen: string
  }[]
}>()

function formatCell(value: string) {
  if (value === 'yes') return '✓'
  if (value === 'no') return '✗'
  return value
}

function cellClass(value: string, positive?: boolean) {
  if (value === 'yes') return 'cell-yes'
  if (value === 'no') return 'cell-no'
  return positive ? 'cell-yes' : 'cell-no'
}
</script>

<template>
  <Section alt>
    <h2 class="section-title">{{ title }}</h2>
    <p class="section-intro">{{ intro }}</p>

    <div class="table-wrap">
      <table class="comparison-table">
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">{{ colYoutube }}</th>
            <th scope="col">{{ colChaptergen }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <th scope="row">{{ row.feature }}</th>
            <td :class="cellClass(row.youtube)">{{ formatCell(row.youtube) }}</td>
            <td :class="cellClass(row.chaptergen, true)">{{ formatCell(row.chaptergen) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="section-outro">{{ outro }}</p>
  </Section>
</template>

<style scoped>
.section-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.section-intro,
.section-outro {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 720px;
}

.section-intro {
  margin-bottom: 2rem;
}

.section-outro {
  margin-top: 2rem;
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.comparison-table th,
.comparison-table td {
  padding: 0.85rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.comparison-table thead th {
  font-weight: 600;
  background: var(--bg);
  color: var(--text-muted);
  font-size: 0.85rem;
}

.comparison-table tbody tr:last-child th,
.comparison-table tbody tr:last-child td {
  border-bottom: none;
}

.comparison-table tbody th {
  font-weight: 500;
  color: var(--text);
}

.cell-yes {
  color: #059669;
  font-weight: 500;
}

.cell-no {
  color: #dc2626;
}
</style>
