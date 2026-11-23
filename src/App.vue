<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

const navItems = [
  { to: '/', label: 'Kasir POS', icon: 'point_of_sale' },
  { to: '/products', label: 'Katalog Menu', icon: 'menu_book' },
  { to: '/reports', label: 'Laporan Penjualan', icon: 'bar_chart' },
  { to: '/insights', label: 'Insight Bisnis', icon: 'auto_awesome' },
]

const userInitials = computed(() => {
  const name = auth.cashier?.name || 'Kasir'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
})

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <div v-if="auth.cashier" class="min-h-screen bg-surface flex flex-col font-sans text-on-surface antialiased">
    <header class="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(28,25,23,0.04)]">
      <div class="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        <div class="flex items-center gap-3 min-w-max">
          <div class="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm shrink-0">
            <span class="material-symbols-outlined text-[20px] text-secondary-fixed">local_cafe</span>
          </div>
          <span class="font-bold text-[16px] text-on-surface tracking-tight">POS Kafe</span>
        </div>

        <button
          type="button"
          class="lg:hidden h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors"
          :aria-label="mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'"
          aria-controls="mobile-primary-navigation"
          :aria-expanded="mobileMenuOpen"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="material-symbols-outlined text-[20px]">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>

        <nav class="hidden lg:flex items-center bg-surface-container-low p-1 rounded-xl gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all flex items-center gap-2"
            :class="route.path === item.to
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'"
          >
            <span class="material-symbols-outlined text-[17px]">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <div class="flex items-center gap-2 sm:gap-3 min-w-max">
          <div class="flex items-center gap-2.5 px-2 sm:px-3 py-1 bg-surface-container-low rounded-xl border border-surface-container">
            <div class="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-[11px] shrink-0">
              {{ userInitials }}
            </div>
            <div class="hidden sm:flex flex-col text-right leading-tight">
              <span class="font-semibold text-[13px] text-on-surface">{{ auth.cashier.name }}</span>
              <span class="text-[11px] text-secondary font-medium">{{ auth.cashier.role || 'Kasir' }}</span>
            </div>
          </div>

          <button
            @click="handleLogout"
            type="button"
            class="h-9 w-9 sm:w-auto flex items-center justify-center gap-1.5 px-2 sm:px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-medium text-[12px] transition-all active:scale-[0.98] border border-surface-container-high"
            aria-label="Logout kasir"
          >
            <span class="material-symbols-outlined text-[16px] text-on-surface-variant">logout</span>
            <span class="hidden sm:inline">Logout Kasir</span>
          </button>
        </div>
      </div>
    </header>

    <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        class="absolute inset-0 h-full w-full bg-black/30"
        aria-label="Tutup menu navigasi"
        @click="mobileMenuOpen = false"
      ></button>
      <nav
        id="mobile-primary-navigation"
        aria-label="Navigasi utama"
        class="absolute top-16 inset-x-0 bg-surface-container-lowest border-b border-surface-container-high shadow-lg p-2"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          class="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition-colors"
          :class="route.path === item.to
            ? 'bg-primary text-white shadow-sm'
            : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'"
        >
          <span class="material-symbols-outlined text-[20px]">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>

    <main class="w-full bg-surface min-h-[calc(100vh-64px)] pt-16 flex-1 flex flex-col">
      <RouterView />
    </main>

    <footer class="w-full bg-surface-container-lowest py-3 border-t border-surface-container-high/60 mt-auto">
      <div class="w-full px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant text-[12px]">
        <div>© 2025 POS Kafe Specialty Coffee. All rights reserved.</div>
        <div class="flex items-center gap-4">
          <span>Versi Terminal 2.4.0</span>
        </div>
      </div>
    </footer>
  </div>

  <RouterView v-else />
</template>
