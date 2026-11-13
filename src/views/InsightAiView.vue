<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { useInsightsStore } from '../stores/insights'
import { useAuthStore } from '../stores/auth'

const store = useInsightsStore()
const auth = useAuthStore()

const chatInput = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)

const messages = ref([
  {
    id: 1,
    sender: 'user',
    text: 'Halo, tolong berikan ringkasan performa penjualan hari ini dan apa tindakan mendesak yang perlu diambil?',
    time: '10:38 WIB',
  },
  {
    id: 2,
    sender: 'ai',
    time: '10:39 WIB',
    type: 'kpi_summary',
    title: 'Ringkasan Performa & Rekomendasi Cepat',
    text: 'Selamat pagi! Operasional Kafe Senopati berjalan sangat dinamis hari ini. Berikut metriks kunci hingga pukul 10:40 WIB:',
  },
  {
    id: 3,
    sender: 'user',
    text: 'Berapa proyeksi penjualan untuk akhir pekan ini?',
    time: '10:41 WIB',
  },
  {
    id: 4,
    sender: 'ai',
    time: '10:41 WIB',
    type: 'forecast',
    title: 'Proyeksi Weekend & Event Senopati Jazz Festival',
    text: 'Berdasarkan data historis 90 hari dan integrasi kalender lokal Senopati Jazz Festival Sabtu ini:',
  },
])

function fillChatInput(text) {
  chatInput.value = text
}

async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

async function handleSendMessage() {
  const q = chatInput.value.trim()
  if (!q) return

  const now = new Date()
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`

  messages.value.push({
    id: Date.now(),
    sender: 'user',
    text: q,
    time: timeStr,
  })

  chatInput.value = ''
  await scrollToBottom()
  isTyping.value = true

  // Simulasi query intel / edge function
  setTimeout(async () => {
    isTyping.value = false
    const qLower = q.toLowerCase()
    let aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      time: timeStr,
      type: 'custom',
    }

    if (qLower.includes('margin') || qLower.includes('laba')) {
      aiMsg.title = 'Analisis Margin Menu Terendah'
      aiMsg.text = 'Menu dengan margin laba bersih terendah saat ini adalah Matcha Oat Latte Ice (margin 38%) akibat kenaikan harga bahan baku Oat Milk impor.'
      aiMsg.recommendation = 'Ganti ke Oat Milk lokal barista edition (hemat Rp 3.200/serving) atau sesuaikan harga jual dari Rp 36.000 menjadi Rp 39.000 untuk mempertahankan target margin 55%.'
    } else if (qLower.includes('stok') || qLower.includes('restock') || qLower.includes('susu')) {
      aiMsg.title = 'Rekomendasi Restock Sebelum Akhir Pekan'
      aiMsg.text = 'Bahan baku prioritas tinggi untuk pemesanan supplier hari ini:'
      aiMsg.list = [
        'Fresh Milk Pasteurisasi: Butuh +60 Liter (stok aman weekend)',
        'Biji Kopi House Blend (70:30): Sisa 3.5 Kg, order minimal +15 Kg',
        'Sirup Gula Aren Organik: Sisa 2 Jerigen (estimasi habis Sabtu siang)',
      ]
    } else {
      aiMsg.title = 'Rekomendasi Operasional & Penjualan'
      aiMsg.text = 'Berdasarkan pola transaksi 14 hari terakhir di Cabang Senopati, rasio konversi tertinggi terjadi pada kombinasi kopi filter manual brew dengan pastry di pagi hari, serta cold brew aren saat sore hari.'
      aiMsg.recommendation = 'Aktifkan banner promosi bundling pagi pada jam 08:00 - 11:00 WIB untuk menaikkan basket size transaksi kasir.'
    }

    messages.value.push(aiMsg)
    await scrollToBottom()

    // Coba trigger store fetch jika perlu
    try {
      await store.fetchInsights()
    } catch {
      // safe fallback
    }
  }, 800)
}

function handleAlertPO() {
  alert('Permintaan Purchase Order 40L Susu telah diteruskan ke Supplier Greenfields!')
}

function handleApplyPromo() {
  alert('Promo Bundling Almond Croissant + Caramel Macchiato telah diaktifkan di terminal POS Kasir!')
}

onMounted(() => {
  store.fetchInsights()
  scrollToBottom()
})
</script>

<template>
  <div class="flex-1 w-full max-w-[1600px] mx-auto flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
    <!-- KOLOM KIRI (SIDEBAR AI QUICK PROMPTS & HISTORY) -->
    <aside class="w-full md:w-[320px] lg:w-[340px] shrink-0 bg-surface-container-lowest border-r border-surface-container-high/60 flex flex-col h-full overflow-hidden">
      <!-- Sidebar Header -->
      <div class="p-4 border-b border-surface-container-high/60 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-secondary-fixed/50 text-secondary flex items-center justify-center">
              <span class="material-symbols-outlined text-[17px]">smart_toy</span>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-[13px] text-on-surface">Asisten AI Kafe</span>
              <span class="text-[10px] text-on-surface-variant">Senopati Roastery Intel</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary text-[10px] font-semibold border border-secondary-fixed/50">
            GPT-4o &amp; Supabase
          </span>
        </div>

        <button
          type="button"
          @click="messages = []"
          class="w-full py-2 px-3 rounded-xl bg-primary hover:bg-neutral-800 text-white text-[12px] font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
        >
          <span class="material-symbols-outlined text-[18px] text-secondary-fixed">add</span>
          <span>Percakapan Baru</span>
        </button>
      </div>

      <!-- Scrollable Prompt Categories & History -->
      <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        <!-- Quick Prompts Section -->
        <div class="flex flex-col gap-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Rekomendasi Cepat</span>
            <span class="text-[10px] text-secondary font-medium">Klik untuk tanya</span>
          </div>

          <button
            type="button"
            @click="fillChatInput('Menu apa dengan margin laba terendah minggu ini?')"
            class="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-secondary/40 border border-transparent transition-all group flex flex-col gap-1"
          >
            <div class="flex items-center gap-1.5 text-[12px] font-bold text-on-surface group-hover:text-secondary">
              <span>📊 Evaluasi Menu &amp; Margin</span>
            </div>
            <p class="text-[11px] text-on-surface-variant line-clamp-1 leading-snug">"Menu apa dengan margin laba terendah minggu ini?"</p>
          </button>

          <button
            type="button"
            @click="fillChatInput('Bahan baku apa yang perlu direstock sebelum akhir pekan?')"
            class="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-secondary/40 border border-transparent transition-all group flex flex-col gap-1"
          >
            <div class="flex items-center gap-1.5 text-[12px] font-bold text-on-surface group-hover:text-secondary">
              <span>📦 Prediksi Stok Habis</span>
            </div>
            <p class="text-[11px] text-on-surface-variant line-clamp-1 leading-snug">"Bahan baku apa yang perlu direstock sebelum akhir pekan?"</p>
          </button>

          <button
            type="button"
            @click="fillChatInput('Kapan jam terpadat esok hari dan rekomendasi shift barista?')"
            class="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-secondary/40 border border-transparent transition-all group flex flex-col gap-1"
          >
            <div class="flex items-center gap-1.5 text-[12px] font-bold text-on-surface group-hover:text-secondary">
              <span>👥 Jam Sibuk Barista</span>
            </div>
            <p class="text-[11px] text-on-surface-variant line-clamp-1 leading-snug">"Kapan jam terpadat esok hari dan rekomendasi shift barista?"</p>
          </button>

          <button
            type="button"
            @click="fillChatInput('Buatkan paket bundling pastry + kopi untuk jam 14:00 - 17:00')"
            class="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-secondary/40 border border-transparent transition-all group flex flex-col gap-1"
          >
            <div class="flex items-center gap-1.5 text-[12px] font-bold text-on-surface group-hover:text-secondary">
              <span>💡 Ide Bundling Promo</span>
            </div>
            <p class="text-[11px] text-on-surface-variant line-clamp-1 leading-snug">"Buatkan paket bundling pastry + kopi untuk jam 14:00 - 17:00"</p>
          </button>
        </div>

        <!-- History Sessions Section -->
        <div class="flex flex-col gap-2 pt-2 border-t border-surface-container-high/60">
          <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Sesi Analisis Sebelumnya</span>
          <div class="flex flex-col gap-1">
            <button
              v-for="item in ['Lonjakan Matcha Oat (Kemarin)', 'Restock Susu & Flores Bajawa', 'Evaluasi Diskon Member']"
              :key="item"
              type="button"
              class="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-container-low flex items-center justify-between text-on-surface-variant hover:text-on-surface transition-all text-[12px]"
            >
              <span class="truncate pr-2">{{ item }}</span>
              <span class="material-symbols-outlined text-[15px] opacity-60">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar Status Footer -->
      <div class="p-3 bg-surface-container-low border-t border-surface-container-high/60 flex items-center justify-between text-[11px] text-on-surface-variant">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Supabase Edge Sync</span>
        </div>
        <span class="font-medium text-on-surface">v2.4 Live</span>
      </div>
    </aside>

    <!-- KOLOM UTAMA (CHAT INTERFACE WORKSPACE) -->
    <section class="flex-1 flex flex-col h-full bg-surface relative overflow-hidden">
      <!-- Chat Header -->
      <div class="h-14 px-6 bg-surface-container-lowest/80 backdrop-blur-xs border-b border-surface-container-high/60 flex items-center justify-between shrink-0 z-10">
        <div class="flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <div class="flex items-center gap-2">
            <span class="font-semibold text-[13px] text-on-surface">Status Real-time:</span>
            <span class="text-[12px] text-on-surface-variant">
              Terkoneksi ke POS Senopati <strong class="text-on-surface">(1.420 transaksi dianalisis)</strong>
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[11px] px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface-variant font-medium hidden sm:inline">
            Latensi: 140ms
          </span>
          <button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container" title="Export Chat">
            <span class="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>
      </div>

      <!-- Chat Timeline Messages (Scrollable) -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        <div v-for="msg in messages" :key="msg.id">
          <!-- User Bubble -->
          <div v-if="msg.sender === 'user'" class="flex justify-end gap-3 max-w-3xl ml-auto">
            <div class="flex flex-col items-end gap-1">
              <div class="px-4 py-3 rounded-2xl rounded-tr-xs bg-primary text-white text-[13px] leading-relaxed shadow-xs">
                {{ msg.text }}
              </div>
              <span class="text-[10px] text-on-surface-variant pr-1">{{ msg.time }} • Anda</span>
            </div>
            <div class="w-8 h-8 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {{ (auth.cashier?.name || 'BS').slice(0, 2).toUpperCase() }}
            </div>
          </div>

          <!-- AI Bubble -->
          <div v-else class="flex items-start gap-3 max-w-3xl mr-auto">
            <div class="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0 mt-0.5 border border-secondary/20 shadow-xs">
              <span class="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div class="flex flex-col items-start gap-3 w-full">
              <!-- KPI Summary Card -->
              <div
                v-if="msg.type === 'kpi_summary'"
                class="w-full p-5 rounded-2xl rounded-tl-xs bg-surface-container-lowest border border-surface-container-high/60 shadow-xs flex flex-col gap-4"
              >
                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-[13px] text-on-surface">{{ msg.title }}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      Data Terupdate 10:40 WIB
                    </span>
                  </div>
                  <p class="text-[13px] text-on-surface-variant leading-relaxed">{{ msg.text }}</p>

                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    <div class="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col">
                      <span class="text-[11px] text-on-surface-variant">Omset Hari Ini</span>
                      <span class="text-[16px] font-bold text-on-surface">Rp 6.420.000</span>
                      <span class="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                        <span class="material-symbols-outlined text-[12px]">trending_up</span> +14% vs kemarin
                      </span>
                    </div>
                    <div class="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col">
                      <span class="text-[11px] text-on-surface-variant">Volume Terjual</span>
                      <span class="text-[16px] font-bold text-on-surface">184 Cups</span>
                      <span class="text-[10px] font-semibold text-secondary flex items-center gap-0.5 mt-0.5">
                        Puncak: 08:30 - 09:30
                      </span>
                    </div>
                    <div class="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex flex-col col-span-2 sm:col-span-1">
                      <span class="text-[11px] text-on-surface-variant">Rata-rata Basket</span>
                      <span class="text-[16px] font-bold text-on-surface">Rp 34.800</span>
                      <span class="text-[10px] text-on-surface-variant mt-0.5">Target: Rp 35.000</span>
                    </div>
                  </div>
                </div>

                <!-- Alert Visual: Stok Kritis -->
                <div class="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div class="flex items-start gap-2.5">
                    <span class="material-symbols-outlined text-amber-600 text-[20px] shrink-0 mt-0.5">warning</span>
                    <div class="flex flex-col">
                      <span class="text-[12px] font-bold text-amber-950">⚠️ Stok Kritis: Susu Segar Pasteurisasi Tersisa 4 Liter</span>
                      <p class="text-[11px] text-amber-800 leading-snug mt-0.5">Estimasi habis pukul 14:30 WIB saat peak hour barista. Segera re-order ke supplier!</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="handleAlertPO"
                    class="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-[11px] shrink-0 flex items-center gap-1 shadow-xs transition-all active:scale-95"
                  >
                    <span class="material-symbols-outlined text-[14px]">local_shipping</span>
                    <span>Buat PO Supplier</span>
                  </button>
                </div>

                <!-- Rekomendasi Bundling Promo -->
                <div class="p-3.5 rounded-xl bg-secondary-fixed/30 border border-secondary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div class="flex items-start gap-2.5">
                    <span class="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">local_offer</span>
                    <div class="flex flex-col">
                      <span class="text-[12px] font-bold text-on-surface">💡 Bundling Promo: Almond Croissant (Sisa 14 pcs)</span>
                      <p class="text-[11px] text-on-surface-variant leading-snug mt-0.5">Pasangkan dengan Iced Caramel Macchiato diskon 15% untuk mendongkrak omset sore dan kurangi sisa bahan.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="handleApplyPromo"
                    class="px-3 py-1.5 rounded-lg bg-primary hover:bg-neutral-800 text-white font-semibold text-[11px] shrink-0 flex items-center gap-1 shadow-xs transition-all active:scale-95"
                  >
                    <span class="material-symbols-outlined text-[14px] text-secondary-fixed">bolt</span>
                    <span>Terapkan Promo Kasir</span>
                  </button>
                </div>

                <!-- Mini Forecast Chart Card -->
                <div class="p-3 rounded-xl bg-surface-container-low border border-surface-container-high/50 flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-on-surface flex items-center gap-1">
                      <span class="material-symbols-outlined text-[15px] text-secondary">trending_up</span>
                      <span>Proyeksi Lonjakan Pesanan Sore (15:00 - 18:00 WIB)</span>
                    </span>
                    <span class="text-[10px] font-semibold text-secondary">+65 Cup Diproyeksikan</span>
                  </div>
                  <div class="h-16 w-full flex items-end gap-1.5 pt-2">
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <span class="text-[9px] text-on-surface-variant">12:00</span>
                      <div class="w-full bg-surface-container-highest rounded-t h-6"></div>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <span class="text-[9px] text-on-surface-variant">13:00</span>
                      <div class="w-full bg-surface-container-highest rounded-t h-7"></div>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <span class="text-[9px] text-on-surface-variant">14:00</span>
                      <div class="w-full bg-surface-container-highest rounded-t h-9"></div>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <span class="text-[9px] text-secondary font-bold">15:00</span>
                      <div class="w-full bg-secondary-container rounded-t h-12 relative group">
                        <span class="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-secondary">Peak</span>
                      </div>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <span class="text-[9px] text-secondary font-bold">16:00</span>
                      <div class="w-full bg-secondary rounded-t h-14"></div>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <span class="text-[9px] text-secondary font-bold">17:00</span>
                      <div class="w-full bg-secondary-container rounded-t h-11"></div>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-1">
                      <span class="text-[9px] text-on-surface-variant">18:00</span>
                      <div class="w-full bg-surface-container-highest rounded-t h-8"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Forecast Card -->
              <div
                v-else-if="msg.type === 'forecast'"
                class="w-full p-5 rounded-2xl rounded-tl-xs bg-surface-container-lowest border border-surface-container-high/60 shadow-xs flex flex-col gap-3"
              >
                <div class="flex items-center gap-2 text-secondary">
                  <span class="material-symbols-outlined text-[18px]">event_upcoming</span>
                  <span class="font-bold text-[13px] text-on-surface">{{ msg.title }}</span>
                </div>
                <p class="text-[13px] text-on-surface-variant leading-relaxed">{{ msg.text }}</p>
                <div class="p-3 rounded-xl bg-surface-container-low border-l-4 border-secondary flex flex-col gap-1.5">
                  <div class="flex items-center justify-between">
                    <span class="text-[12px] font-bold text-on-surface">Estimasi Revenue Sabtu &amp; Minggu:</span>
                    <span class="text-[14px] font-bold text-secondary">Rp 21.800.000 <span class="text-[11px] font-normal text-emerald-600">(+28%)</span></span>
                  </div>
                  <p class="text-[12px] text-on-surface-variant leading-normal">
                    Kapasitas barista saat ini berpotensi mengalami bottleneck pada pukul 15:00 - 20:00 dengan antrean di atas 9 menit.
                  </p>
                  <div class="mt-1 pt-2 border-t border-surface-container-high flex items-center justify-between text-[11px]">
                    <span class="font-semibold text-on-surface">📌 Tindakan Rekomendasi:</span>
                    <span class="text-secondary font-medium">Siapkan 2 barista tambahan pada shift 14:00 - 22:00</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 pt-1 text-[11px] text-on-surface-variant">
                  <span class="flex h-2 w-2 relative">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  <span>Model AI terus memantau pemesanan masuk secara adaptif</span>
                </div>
              </div>

              <!-- Custom Generic AI Reply -->
              <div
                v-else
                class="w-full p-4 rounded-2xl rounded-tl-xs bg-surface-container-lowest border border-surface-container-high/60 shadow-xs flex flex-col gap-2"
              >
                <div class="font-bold text-[13px] text-on-surface">{{ msg.title }}</div>
                <p class="text-[13px] text-on-surface-variant leading-relaxed">{{ msg.text }}</p>
                <ul v-if="msg.list" class="text-[12px] text-on-surface-variant space-y-1 list-disc list-inside">
                  <li v-for="item in msg.list" :key="item">{{ item }}</li>
                </ul>
                <div v-if="msg.recommendation" class="p-2.5 rounded-lg bg-surface-container-low text-[12px] border border-surface-container-high mt-1">
                  <strong>Solusi AI:</strong> {{ msg.recommendation }}
                </div>
              </div>

              <span class="text-[10px] text-on-surface-variant pl-1">{{ msg.time }} • AI Kafe Specialty</span>
            </div>
          </div>
        </div>

        <!-- Typing Bubble -->
        <div v-if="isTyping" class="flex items-start gap-3 max-w-3xl mr-auto">
          <div class="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0 mt-0.5 border border-secondary/20 shadow-xs">
            <span class="material-symbols-outlined text-[18px]">smart_toy</span>
          </div>
          <div class="p-3.5 rounded-2xl rounded-tl-xs bg-surface-container-lowest border border-surface-container-high/60 shadow-xs flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-secondary animate-bounce"></span>
            <span class="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.4s]"></span>
            <span class="text-[11px] text-on-surface-variant ml-2 font-medium">Sedang menghitung data POS Senopati...</span>
          </div>
        </div>
      </div>

      <!-- DOCKED CHAT INPUT BAR (BOTTOM) -->
      <div class="p-4 md:px-8 md:pb-6 bg-gradient-to-t from-surface via-surface to-transparent shrink-0 z-20">
        <div class="max-w-3xl mx-auto flex flex-col gap-2">
          <!-- Quick Suggestion Mini Chips -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            <span class="text-on-surface-variant text-[10px] font-medium shrink-0 flex items-center gap-0.5">
              <span class="material-symbols-outlined text-[13px]">bolt</span> Saran:
            </span>
            <button
              type="button"
              @click="fillChatInput('Cek profit margin Iced Aren Latte vs Oat Latte')"
              class="px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container-high border border-surface-container-high/80 text-on-surface-variant hover:text-on-surface whitespace-nowrap transition-all"
            >
              Margin Aren vs Oat
            </button>
            <button
              type="button"
              @click="fillChatInput('Berapa liter susu yang harus dipesan untuk 3 hari ke depan?')"
              class="px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container-high border border-surface-container-high/80 text-on-surface-variant hover:text-on-surface whitespace-nowrap transition-all"
            >
              Kebutuhan Susu 3 Hari
            </button>
            <button
              type="button"
              @click="fillChatInput('Rekomendasikan diskon happy hour sore ini')"
              class="px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container-high border border-surface-container-high/80 text-on-surface-variant hover:text-on-surface whitespace-nowrap transition-all"
            >
              Happy Hour Sore
            </button>
          </div>

          <!-- Floating Input Container -->
          <div class="w-full bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 shadow-[0_4px_20px_rgba(28,25,23,0.06)] p-2 flex items-center gap-2">
            <button
              type="button"
              class="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all shrink-0"
              title="Lampirkan data transaksi POS"
            >
              <span class="material-symbols-outlined text-[20px]">attach_file</span>
            </button>

            <input
              v-model="chatInput"
              @keydown.enter="handleSendMessage"
              class="w-full bg-transparent border-0 focus:ring-0 text-[13px] text-on-surface placeholder:text-on-surface-variant/60 py-2.5 px-1 focus:outline-none"
              placeholder="Tanyakan apa saja tentang penjualan, stok, atau strategi kafe..."
              type="text"
            />

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                class="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all"
                title="Input Suara"
              >
                <span class="material-symbols-outlined text-[19px]">mic</span>
              </button>
              <button
                type="button"
                @click="handleSendMessage"
                class="h-10 px-4 rounded-xl bg-primary hover:bg-neutral-800 text-white font-medium text-[13px] flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <span>Kirim</span>
                <span class="material-symbols-outlined text-[16px] text-secondary-fixed">send</span>
              </button>
            </div>
          </div>

          <div class="text-center text-[10px] text-on-surface-variant">
            AI Kafe terlatih dengan data transaksi Senopati Roastery. Verifikasi aksi kritis stok sebelum finalisasi PO.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
