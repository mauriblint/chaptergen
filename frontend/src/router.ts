import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/HomePage.vue'),
  },
  {
    path: '/podcast-chapters',
    name: 'podcast',
    component: () => import('./pages/PodcastPage.vue'),
  },
  {
    path: '/jobs/:id',
    name: 'job',
    component: () => import('./pages/JobPage.vue'),
  },
]
