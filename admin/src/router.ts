import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './composables/useAuth'
import AdminLayout from './layouts/AdminLayout.vue'
import JobDetailPage from './pages/JobDetailPage.vue'
import JobsPage from './pages/JobsPage.vue'
import LoginPage from './pages/LoginPage.vue'
import OverviewPage from './pages/OverviewPage.vue'
import PaymentsPage from './pages/PaymentsPage.vue'
import UserDetailPage from './pages/UserDetailPage.vue'
import UsersPage from './pages/UsersPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginPage },
    {
      path: '/',
      component: AdminLayout,
      redirect: '/overview',
      children: [
        { path: 'overview', name: 'overview', component: OverviewPage },
        { path: 'users', name: 'users', component: UsersPage },
        { path: 'users/:id', name: 'user', component: UserDetailPage },
        { path: 'jobs', name: 'jobs', component: JobsPage },
        { path: 'jobs/:id', name: 'job', component: JobDetailPage },
        { path: 'payments', name: 'payments', component: PaymentsPage },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()
  if (to.name !== 'login' && !isAuthenticated.value) {
    return { name: 'login' }
  }
  if (to.name === 'login' && isAuthenticated.value) {
    return { name: 'overview' }
  }
})

export default router
