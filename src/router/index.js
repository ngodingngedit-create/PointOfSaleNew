import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guest: true } },
  { path: '/', name: 'pos', component: () => import('../views/PosView.vue'), meta: { requiresAuth: true } },
  { path: '/pos', redirect: '/' },
  { path: '/products', name: 'products', component: () => import('../views/ProductsView.vue'), meta: { requiresAuth: true } },
  { path: '/reports', name: 'reports', component: () => import('../views/ReportsView.vue'), meta: { requiresAuth: true } },
  { path: '/insights', name: 'insights', component: () => import('../views/InsightAiView.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.loading) {
    auth.init()
  }

  // Jika butuh auth dan belum ada kasir aktif, arahkan ke login PIN
  if (to.meta.requiresAuth && !auth.cashier) {
    return { name: 'login' }
  }

  // Jika sudah login dan membuka halaman login, langsung arahkan ke POS
  if (to.meta.guest && auth.cashier) {
    return { name: 'pos' }
  }
})

export default router
