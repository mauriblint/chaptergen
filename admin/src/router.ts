import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './composables/useAuth'
import JobsPage from './pages/JobsPage.vue'
import LoginPage from './pages/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/', name: 'jobs', component: JobsPage },
  ],
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()
  if (to.name !== 'login' && !isAuthenticated.value) {
    return { name: 'login' }
  }
  if (to.name === 'login' && isAuthenticated.value) {
    return { name: 'jobs' }
  }
})

export default router
