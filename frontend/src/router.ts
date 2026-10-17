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
    path: '/pricing',
    name: 'pricing',
    component: () => import('./pages/PricingPage.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/es/precios',
    name: 'pricing-es',
    component: () => import('./pages/PricingPage.vue'),
    meta: { locale: 'es' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('./pages/ProsePage.vue'),
    meta: { locale: 'en', prose: 'about' },
  },
  {
    path: '/es/acerca-de',
    name: 'about-es',
    component: () => import('./pages/ProsePage.vue'),
    meta: { locale: 'es', prose: 'about' },
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('./pages/ProsePage.vue'),
    meta: { locale: 'en', prose: 'privacy' },
  },
  {
    path: '/es/privacidad',
    name: 'privacy-es',
    component: () => import('./pages/ProsePage.vue'),
    meta: { locale: 'es', prose: 'privacy' },
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('./pages/ProsePage.vue'),
    meta: { locale: 'en', prose: 'terms' },
  },
  {
    path: '/es/terminos',
    name: 'terms-es',
    component: () => import('./pages/ProsePage.vue'),
    meta: { locale: 'es', prose: 'terms' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./pages/LoginPage.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./pages/DashboardPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./pages/SettingsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/billing',
    name: 'billing',
    component: () => import('./pages/BillingPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/jobs/:id',
    name: 'job',
    component: () => import('./pages/JobPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('./pages/NotFoundPage.vue'),
  },
]
