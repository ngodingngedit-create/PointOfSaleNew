<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const period = ref(7)
const loading = ref(false)
const error = ref('')
const report = ref(null)

function localDate(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}
function getDateRange(days) {
  const to = localDate(new Date())
  const [year, month, day] = to.split('-').map(Number)
  const from = new Date(Date.UTC(year, month - 1, day - days + 1)).toISOString().slice(0, 10)
  return { from, to }
}
function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value) || 0)
}

async function loadReports() {
  loading.value = true
  error.value = ''
  const { from, to } = getDateRange(period.value)
  try {
    const response = await fetch(`/api/reports?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
      credentials: 'same-origin',
      cache: 'no-store',
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body.error || `Gagal memuat laporan (${response.status})`)
    if (!body || typeof body !== 'object' || !body.summary || !Array.isArray(body.daily) || !Array.isArray(body.topProducts) || !Array.isArray(body.paymentMethods)) {
      throw new Error('Format data laporan dari server tidak valid.')
    }
    report.value = body
  } catch (err) {
    report.value = null
    error.value = err.message || 'Gagal memuat laporan penjualan.'
  } finally {
    loading.value = false
  }
}

const dailyRows = computed(() => report.value?.daily || [])
const productRows = computed(() => report.value?.topProducts || [])
const paymentRows = computed(() => report.value?.paymentMethods || [])
const totalRevenue = computed(() => Number(report.value?.summary?.totalRevenue) || 0)
const totalTransactions = computed(() => Number(report.value?.summary?.totalTransactions) || 0)
const averageOrder = computed(() => Number(report.value?.summary?.averageOrderValue) || 0)
const hasReportData = computed(() => Boolean(report.value) && report.value.empty !== true)
const chartRows = computed(() => {
  const rows = dailyRows.value.slice(-14)
  const max = Math.max(...rows.map((row) => Number(row.totalSales) || 0), 0)
  return rows.map((row) => {
    const date = row.date
    const amount = Number(row.totalSales) || 0
    const parsed = date ? new Date(`${String(date).slice(0, 10)}T00:00:00`) : null
    return {
      label: parsed && !Number.isNaN(parsed.getTime()) ? parsed.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }) : String(date || '—'),
      amount,
      height: max > 0 ? Math.max(3, Math.round((amount / max) * 100)) : 0,
    }
  })
})
const sortedPayments = computed(() => paymentRows.value.map((row) => ({
  name: row.method,
  amount: Number(row.amount) || 0,
  count: Number(row.transactions) || 0,
})))
const sortedProducts = computed(() => productRows.value.map((row) => ({
  id: row.productId,
  name: row.productName,
  category: row.category || '—',
  quantity: Number(row.totalQty) || 0,
  revenue: Number(row.totalSales) || 0,
})))

watch(period, loadReports)
onMounted(loadReports)
</script>

<template>
  <div class="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-1.5 text-secondary mb-1"><span class="material-symbols-outlined text-[18px]">analytics</span><span class="text-[11px] font-bold uppercase tracking-wider">Laporan Penjualan</span></div>
        <h1 class="text-[26px] font-bold tracking-tight">Ringkasan Penjualan</h1>
        <p class="text-[13px] text-on-surface-variant mt-0.5">Agregat penjualan berdasarkan data server untuk periode yang dipilih.</p>
      </div>
      <div class="flex items-center p-1 bg-surface-container-high rounded-xl self-start">
        <button v-for="option in [{days:1,label:'Hari Ini'},{days:7,label:'7 Hari'},{days:30,label:'30 Hari'}]" :key="option.days" type="button" @click="period = option.days" class="px-3 py-1.5 rounded-lg text-[12px] font-medium" :class="period === option.days ? 'bg-white text-on-surface shadow-xs font-semibold' : 'text-on-surface-variant'">{{ option.label }}</button>
      </div>
    </div>

    <div v-if="loading" class="p-12 text-center bg-surface-container-lowest rounded-xl border border-surface-container-high/60 text-[13px] text-on-surface-variant">Memuat laporan penjualan…</div>
    <div v-else-if="error" class="p-5 bg-red-50 border border-red-200 text-red-900 rounded-xl text-[13px]" role="alert"><strong class="block mb-1">Laporan tidak dapat dimuat</strong>{{ error }}<button type="button" @click="loadReports" class="ml-2 underline font-semibold">Coba lagi</button></div>
    <div v-else-if="!hasReportData" class="p-12 text-center bg-surface-container-lowest rounded-xl border border-surface-container-high/60"><span class="material-symbols-outlined text-outline text-[40px]">bar_chart</span><p class="mt-2 text-[14px] font-semibold">Belum ada data laporan untuk periode ini.</p><p class="mt-1 text-[12px] text-on-surface-variant">Pilih periode lain atau periksa kembali setelah ada transaksi.</p></div>
    <template v-else>
      <div v-if="report.truncated" class="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[12px]" role="alert">Laporan hanya mencakup sebagian transaksi karena batas data. Pilih periode yang lebih pendek untuk mendapatkan angka lengkap.</div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <article class="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high/60"><p class="text-[12px] text-on-surface-variant">Total Penjualan</p><p class="mt-2 text-[24px] font-bold">{{ formatRupiah(totalRevenue) }}</p></article>
        <article class="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high/60"><p class="text-[12px] text-on-surface-variant">Jumlah Transaksi</p><p class="mt-2 text-[24px] font-bold">{{ totalTransactions.toLocaleString('id-ID') }}</p></article>
        <article class="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high/60"><p class="text-[12px] text-on-surface-variant">Rata-rata per Transaksi</p><p class="mt-2 text-[24px] font-bold">{{ formatRupiah(averageOrder) }}</p></article>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section class="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high/60">
          <h2 class="text-[16px] font-bold">Penjualan Harian</h2>
          <p class="text-[12px] text-on-surface-variant mt-1">Nilai penjualan dari agregat harian API.</p>
          <div v-if="chartRows.length" class="mt-6 flex items-end gap-2 min-h-48 overflow-x-auto">
            <div v-for="(row, index) in chartRows" :key="`${row.label}-${index}`" class="min-w-10 flex-1 flex flex-col items-center justify-end gap-2 h-48">
              <span class="text-[9px] text-on-surface-variant whitespace-nowrap">{{ formatRupiah(row.amount) }}</span>
              <div class="w-full max-w-10 bg-secondary-fixed rounded-t" :style="{height: `${row.height}%`}" :title="formatRupiah(row.amount)"></div>
              <span class="text-[10px] text-on-surface-variant whitespace-nowrap">{{ row.label }}</span>
            </div>
          </div>
          <p v-else class="mt-5 text-[12px] text-on-surface-variant">Belum ada agregat penjualan harian.</p>
        </section>

        <section class="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high/60">
          <h2 class="text-[16px] font-bold">Metode Pembayaran</h2>
          <p class="text-[12px] text-on-surface-variant mt-1">Agregat yang dikirim oleh server.</p>
          <div v-if="sortedPayments.length" class="mt-4 divide-y divide-surface-container">
            <div v-for="(payment, index) in sortedPayments" :key="`${payment.name}-${index}`" class="py-3 flex items-center justify-between text-[13px]"><span class="font-medium">{{ payment.name }}</span><span class="text-right"><strong>{{ formatRupiah(payment.amount) }}</strong><span v-if="payment.count" class="block text-[11px] text-on-surface-variant">{{ payment.count }} transaksi</span></span></div>
          </div>
          <p v-else class="mt-5 text-[12px] text-on-surface-variant">Belum ada agregat metode pembayaran.</p>
        </section>
      </div>

      <section class="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high/60">
        <h2 class="text-[16px] font-bold">Produk Terlaris</h2>
        <div v-if="sortedProducts.length" class="overflow-x-auto mt-3"><table class="w-full text-left text-[13px]"><thead><tr class="text-[11px] uppercase text-on-surface-variant border-b border-surface-container"><th class="py-2 pr-3">Produk</th><th class="py-2 px-3">Kategori</th><th class="py-2 px-3 text-right">Terjual</th><th class="py-2 pl-3 text-right">Penjualan</th></tr></thead><tbody><tr v-for="product in sortedProducts" :key="product.id" class="border-b border-surface-container/70"><td class="py-3 pr-3 font-semibold">{{ product.name }}</td><td class="py-3 px-3 text-on-surface-variant">{{ product.category }}</td><td class="py-3 px-3 text-right">{{ product.quantity.toLocaleString('id-ID') }}</td><td class="py-3 pl-3 text-right font-semibold">{{ formatRupiah(product.revenue) }}</td></tr></tbody></table></div>
        <p v-else class="mt-4 text-[12px] text-on-surface-variant">Belum ada data produk terlaris.</p>
      </section>
    </template>
  </div>
</template>
