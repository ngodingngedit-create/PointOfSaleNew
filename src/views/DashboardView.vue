<script setup>
import { computed, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { useProductsStore } from '../stores/products'

const auth = useAuthStore()
const productsStore = useProductsStore()

const lowStock = computed(() => productsStore.products.filter((p) => p.stock <= 5))

function formatRupiah(v) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v || 0)
}

onMounted(() => productsStore.fetchProducts())
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-stone-200 pb-4">
      <h1 class="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
        Ringkasan Operasional
      </h1>
      <p class="text-xs sm:text-sm text-stone-500 mt-0.5">
        Workspace: {{ auth.cafeName || 'Cafe Utama' }}
      </p>
    </div>

    <!-- Navigasi Cepat Modul -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <RouterLink
        to="/pos"
        class="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-900 transition flex flex-col justify-between"
      >
        <div>
          <span class="text-[11px] font-mono uppercase tracking-wider text-stone-500">Operasi Kasir</span>
          <h2 class="text-base font-semibold text-stone-900 mt-1">Buka Terminal Kasir</h2>
          <p class="text-xs text-stone-600 mt-1">Input pesanan dan catat pembayaran pelanggan.</p>
        </div>
        <span class="text-xs font-medium text-amber-800 mt-4">Menuju Kasir</span>
      </RouterLink>

      <RouterLink
        to="/reports"
        class="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-900 transition flex flex-col justify-between"
      >
        <div>
          <span class="text-[11px] font-mono uppercase tracking-wider text-stone-500">Analitik Penjualan</span>
          <h2 class="text-base font-semibold text-stone-900 mt-1">Laporan Penjualan</h2>
          <p class="text-xs text-stone-600 mt-1">Evaluasi tren harian dan produk berpendapatan tertinggi.</p>
        </div>
        <span class="text-xs font-medium text-amber-800 mt-4">Buka Laporan</span>
      </RouterLink>

      <RouterLink
        to="/insights"
        class="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-900 transition flex flex-col justify-between"
      >
        <div>
          <span class="text-[11px] font-mono uppercase tracking-wider text-stone-500">Modul AI</span>
          <h2 class="text-base font-semibold text-stone-900 mt-1">Rekomendasi Penjualan</h2>
          <p class="text-xs text-stone-600 mt-1">Rangkuman tren otomatis dan saran tindakan bisnis.</p>
        </div>
        <span class="text-xs font-medium text-amber-800 mt-4">Buka Insight AI</span>
      </RouterLink>
    </div>

    <!-- Peringatan Inventori -->
    <div class="bg-white border border-stone-200 rounded-lg p-5">
      <div class="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
        <div>
          <h2 class="text-sm font-semibold text-stone-900">Perhatian Inventori</h2>
          <p class="text-xs text-stone-500">Daftar produk dengan stok kritis (5 item atau kurang)</p>
        </div>
        <RouterLink
          to="/products"
          class="text-xs font-medium text-stone-700 hover:text-stone-900 underline underline-offset-2"
        >
          Kelola Inventori
        </RouterLink>
      </div>

      <div v-if="lowStock.length === 0" class="py-6 text-center text-xs text-stone-500">
        Seluruh stok produk berada dalam batas aman.
      </div>

      <ul v-else class="divide-y divide-stone-100 text-sm">
        <li
          v-for="p in lowStock"
          :key="p.id"
          class="py-2.5 flex items-center justify-between"
        >
          <div>
            <p class="font-medium text-stone-800">{{ p.name }}</p>
            <p class="text-xs text-stone-500">{{ p.category || 'Tanpa kategori' }}</p>
          </div>
          <span class="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold font-mono">
            Tersisa {{ p.stock }} unit
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
