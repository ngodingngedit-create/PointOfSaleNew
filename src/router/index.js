import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guest: true } },
  { path: '/admin/login', name: 'admin-login', component: () => import('../views/AdminLoginView.vue'), meta: { adminGuest: true } },
  { path: '/admin/cashier-pins', name: 'admin-cashier-pins', component: () => import('../views/AdminCashierPinsView.vue'), meta: { requiresAdmin: true } },
  { path: '/', name: 'pos', component: () => import('../views/PosView.vue'), meta: { requiresAuth: true } },
  { path: '/pos', redirect: '/' },
  { path: '/products', name: 'products', component: () => import('../views/ProductsView.vue'), meta: { requiresAuth: true } },
  { path: '/reports', name: 'reports', component: () => import('../views/ReportsView.vue'), meta: { requiresAuth: true } },
  { path: '/insights', name: 'insights', component: () => import('../views/InsightAiView.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) await auth.init()

  if (to.meta.requiresAdmin && !auth.admin) {
    return { name: auth.cashier ? 'login' : 'admin-login' }
  }
  if (to.meta.requiresAuth && !auth.cashier) {
    return { name: auth.admin ? 'admin-cashier-pins' : 'login' }
  }
  if (to.meta.adminGuest && auth.admin) return { name: 'admin-cashier-pins' }
  if (to.meta.guest && auth.cashier) return { name: 'pos' }
  if (to.meta.guest && auth.admin) return { name: 'admin-cashier-pins' }
})

export default router
