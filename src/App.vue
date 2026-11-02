<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const router = useRouter()

const navItems = [
  { to: '/', label: 'Kasir POS' },
  { to: '/products', label: 'Katalog Menu' },
  { to: '/reports', label: 'Laporan Penjualan' },
  { to: '/insights', label: 'Insight Bisnis' },
]

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div v-if="auth.cashier" class="min-h-screen bg-stone-100/70 text-stone-900">
    <header class="bg-white border-b border-stone-200 sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-md bg-stone-900 text-stone-100 text-xs font-bold tracking-wider uppercase font-mono">
            {{ (auth.cashier.name || 'POS').slice(0, 2) }}
          </span>
          <div class="leading-tight">
            <h1 class="text-sm font-semibold text-stone-900">POS Kafe</h1>
            <p class="text-[11px] text-stone-500 font-mono">
              Kasir: <span class="font-medium text-stone-700">{{ auth.cashier.name }}</span> ({{ auth.cashier.role }})
            </p>
          </div>
        </div>

        <nav class="flex items-center gap-1 overflow-x-auto py-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors"
            :class="$route.path === item.to
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <button
          @click="handleLogout"
          type="button"
          class="px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors whitespace-nowrap"
        >
          Kunci / Ganti Kasir
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <RouterView />
    </main>
  </div>
  <RouterView v-else />
</template>
