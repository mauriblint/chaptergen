import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/HomePage.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/es',
    name: 'home-es',
    component: () => import('./pages/HomePage.vue'),
    meta: { locale: 'es' },
  },
  {
    path: '/podcast-chapters',
    name: 'podcast',
    component: () => import('./pages/PodcastPage.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/es/capitulos-podcast',
    name: 'podcast-es',
    component: () => import('./pages/PodcastPage.vue'),
    meta: { locale: 'es' },
  },
  {
    path: '/jobs/:id',
    name: 'job',
    component: () => import('./pages/JobPage.vue'),
  },
]
