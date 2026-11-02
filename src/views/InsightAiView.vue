<script setup>
import { onMounted, ref } from 'vue'
import { useInsightsStore } from '../stores/insights'

const store = useInsightsStore()
const error = ref('')
const expandedId = ref(null)

function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function daysAgoStr(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

const startDate = ref(daysAgoStr(6))
const endDate = ref(todayStr())

async function runAnalysis() {
  error.value = ''
  try {
    await store.analyze(startDate.value, endDate.value)
  } catch (e) {
    error.value = e.message || 'Gagal menjalankan analisis'
  }
}

function getRecs(insight) {
  return insight.recommendations ?? {}
}

onMounted(() => store.fetchInsights())
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-stone-200 pb-4">
      <h1 class="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">Analisis & Rekomendasi AI</h1>
      <p class="text-xs sm:text-sm text-stone-500 mt-0.5">
        Evaluasi tren penjualan dan rekomendasi stok yang dihasilkan via Supabase Edge Function
      </p>
    </div>

    <!-- Parameter Analisis -->
    <section class="bg-white border border-stone-200 rounded-lg p-5">
      <div class="mb-3">
        <h2 class="text-sm font-semibold text-stone-900">Jalankan Analisis Baru</h2>
        <p class="text-xs text-stone-500">Tentukan rentang tanggal transaksi untuk diproses oleh model.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
        <div class="flex-1">
          <label class="block text-xs font-medium text-stone-700 mb-1">Mulai Tanggal</label>
          <input
            v-model="startDate"
            type="date"
            class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900 font-mono"
          />
        </div>
        <div class="flex-1">
          <label class="block text-xs font-medium text-stone-700 mb-1">Sampai Tanggal</label>
          <input
            v-model="endDate"
            type="date"
            class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900 font-mono"
          />
        </div>
        <button
          type="button"
          @click="runAnalysis"
          :disabled="store.analyzing"
          class="h-10 px-5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {{ store.analyzing ? 'Memproses di Edge Function...' : 'Jalankan Analisis' }}
        </button>
      </div>

      <p v-if="error" class="text-xs text-red-800 bg-red-50 border border-red-200 rounded p-2.5 mt-3">
        {{ error }}
      </p>
    </section>

    <div v-if="store.loading" class="bg-white border border-stone-200 rounded-lg p-10 text-center text-xs text-stone-500">
      Mengambil riwayat insight...
    </div>

    <div
      v-else-if="store.insights.length === 0"
      class="bg-white border border-dashed border-stone-300 rounded-lg p-12 text-center"
    >
      <p class="text-sm font-medium text-stone-800">Belum ada rekaman analisis</p>
      <p class="text-xs text-stone-500 mt-1">Pilih rentang tanggal di atas dan klik tombol "Jalankan Analisis" untuk memulai.</p>
    </div>

    <!-- Riwayat Hasil Analisis -->
    <div v-else class="space-y-4">
      <article
        v-for="ins in store.insights"
        :key="ins.id"
        class="bg-white border border-stone-200 rounded-lg p-5"
      >
        <div class="flex justify-between items-start flex-wrap gap-2 pb-3 border-b border-stone-100">
          <div>
            <h3 class="text-sm font-semibold text-stone-900">
              Periode {{ formatDate(ins.period_start) }} hingga {{ formatDate(ins.period_end) }}
            </h3>
            <p class="text-[11px] text-stone-400 font-mono mt-0.5">Dibuat {{ formatDate(ins.created_at) }}</p>
          </div>
          <button
            type="button"
            @click="expandedId = expandedId === ins.id ? null : ins.id"
            class="text-xs font-medium text-stone-700 hover:text-stone-900 underline underline-offset-2"
          >
            {{ expandedId === ins.id ? 'Sembunyikan Rincian' : 'Buka Rincian' }}
          </button>
        </div>

        <p class="text-xs sm:text-sm text-stone-700 whitespace-pre-line leading-relaxed mt-3">
          {{ ins.summary_text }}
        </p>

        <!-- Bagian Rincian -->
        <div v-if="expandedId === ins.id" class="mt-4 pt-4 border-t border-stone-200 space-y-4">
          <!-- Indikator Tren -->
          <div v-if="getRecs(ins).trends?.length">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Evaluasi Tren Menu</h4>
            <div class="space-y-2">
              <div
                v-for="(t, i) in getRecs(ins).trends"
                :key="i"
                class="bg-stone-50 border border-stone-200 rounded-md p-3 text-xs"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-medium text-stone-900">{{ t.product_name }}</span>
                  <span
                    class="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border"
                    :class="{
                      'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold': t.trend === 'naik',
                      'bg-rose-50 text-rose-800 border-rose-200 font-semibold': t.trend === 'turun',
                      'bg-stone-100 text-stone-700 border-stone-300': t.trend === 'stabil',
                      'bg-amber-50 text-amber-800 border-amber-200': t.trend === 'baru',
                    }"
                  >
                    Tren: {{ t.trend }}
                  </span>
                </div>
                <p class="text-stone-600 leading-normal">{{ t.note }}</p>
              </div>
            </div>
          </div>

          <!-- Saran Tindakan -->
          <div v-if="getRecs(ins).recommendations?.length">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Rekomendasi Operasional</h4>
            <div class="space-y-2">
              <div
                v-for="(r, i) in getRecs(ins).recommendations"
                :key="i"
                class="bg-amber-50/40 border border-amber-200/80 rounded-md p-3 text-xs"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold text-stone-900">{{ r.title }}</span>
                  <span class="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600">
                    {{ r.type }}
                  </span>
                </div>
                <p class="text-stone-700 leading-normal">{{ r.detail }}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
