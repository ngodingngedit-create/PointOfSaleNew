<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabase'

const loading = ref(true)
const period = ref(7) // hari
const daily = ref([])
const byProduct = ref([])
const todayTotal = ref(0)

function formatRupiah(v) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v || 0)
}

async function loadReports() {
  loading.value = true
  const since = new Date()
  since.setDate(since.getDate() - period.value)
  const sinceStr = since.toISOString().slice(0, 10)

  const [dailyRes, productRes] = await Promise.all([
    supabase.from('daily_sales').select('*').gte('sale_date', sinceStr).order('sale_date'),
    supabase.from('product_sales').select('*').order('total_qty', { ascending: false }).limit(20),
  ])

  daily.value = dailyRes.data ?? []
  byProduct.value = productRes.data ?? []
  todayTotal.value = daily.value.at(-1)?.total_sales ?? 0
  loading.value = false
}

function changePeriod(p) {
  period.value = p
  loadReports()
}

onMounted(loadReports)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-4 border-b border-stone-200 pb-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">Laporan Penjualan</h1>
        <p class="text-xs sm:text-sm text-stone-500 mt-0.5">Statistik pendapatan dan rekap performa menu</p>
      </div>

      <div class="inline-flex rounded-md border border-stone-300 bg-stone-100 p-0.5 text-xs">
        <button
          v-for="p in [7, 30, 90]"
          :key="p"
          @click="changePeriod(p)"
          :class="period === p
            ? 'bg-white text-stone-900 shadow-sm font-semibold'
            : 'text-stone-600 hover:text-stone-900'"
          class="px-3 py-1.5 rounded transition-colors"
        >
          {{ p }} Hari Terakhir
        </button>
      </div>
    </div>

    <div v-if="loading" class="bg-white border border-stone-200 rounded-lg p-10 text-center text-xs text-stone-500">
      Mengambil data penjualan...
    </div>

    <template v-else>
      <!-- Diagram Batang Sederhana -->
      <section class="bg-white border border-stone-200 rounded-lg p-5">
        <div class="flex items-baseline justify-between mb-4">
          <div>
            <h2 class="text-sm font-semibold text-stone-900">Pergerakan Omset Harian</h2>
            <p class="text-xs text-stone-500">Total nominal transaksi per tanggal</p>
          </div>
        </div>

        <div v-if="daily.length === 0" class="py-12 text-center text-xs text-stone-400">
          Belum ada riwayat transaksi pada rentang waktu ini.
        </div>

        <div v-else class="space-y-2">
          <div class="flex items-end gap-2 h-44 overflow-x-auto pt-6 pb-2 px-1">
            <div
              v-for="d in daily"
              :key="d.sale_date"
              class="flex flex-col items-center min-w-[42px] flex-1 group"
            >
              <div class="text-[10px] text-stone-500 font-mono mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {{ Math.round((d.total_sales || 0) / 1000) }}k
              </div>
              <div
                class="w-full bg-stone-800 rounded-t group-hover:bg-amber-700 transition-colors"
                :style="{ height: Math.max(6, (d.total_sales / Math.max(...daily.map(x => x.total_sales || 1))) * 120) + 'px' }"
                :title="`${d.sale_date}: ${formatRupiah(d.total_sales)}`"
              ></div>
              <span class="text-[10px] text-stone-500 font-mono mt-1.5">{{ d.sale_date.slice(5) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Tabel Produk Terlaris -->
      <section class="bg-white border border-stone-200 rounded-lg p-5">
        <div class="mb-4">
          <h2 class="text-sm font-semibold text-stone-900">Produk Terlaris</h2>
          <p class="text-xs text-stone-500">Diurutkan berdasarkan kuantitas pesanan terbanyak</p>
        </div>

        <div v-if="byProduct.length === 0" class="py-10 text-center text-xs text-stone-400">
          Belum ada data penjualan produk.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr class="border-b border-stone-200 text-stone-500 font-medium">
                <th class="py-2.5 pr-4">Nama Produk</th>
                <th class="py-2.5 pr-4">Kategori</th>
                <th class="py-2.5 pr-4 text-right">Kuantitas</th>
                <th class="py-2.5 text-right">Total Nilai</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr v-for="p in byProduct" :key="p.product_id" class="hover:bg-stone-50/70 transition-colors">
                <td class="py-2.5 pr-4 font-medium text-stone-900">{{ p.product_name }}</td>
                <td class="py-2.5 pr-4 text-stone-500">{{ p.category || 'Reguler' }}</td>
                <td class="py-2.5 pr-4 text-right font-mono text-stone-700">{{ p.total_qty }} unit</td>
                <td class="py-2.5 text-right font-mono font-medium text-stone-900">{{ formatRupiah(p.total_revenue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>
