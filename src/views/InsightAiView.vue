<script setup>
import { nextTick, onMounted, ref } from 'vue'

const question = ref('')
const sending = ref(false)
const error = ref('')
const messages = ref([])
const chatContainer = ref(null)

async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
}
function askSalesQuestion(text) {
  question.value = text
}
function clearConversation() {
  messages.value = []
  error.value = ''
  question.value = ''
}

async function sendQuestion() {
  const text = question.value.trim()
  if (!text || sending.value) return
  error.value = ''
  messages.value.push({ id: `${Date.now()}-user`, sender: 'user', text })
  question.value = ''
  sending.value = true
  await scrollToBottom()
  try {
    const response = await fetch('/api/insight', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: text }),
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body.error || `Permintaan insight gagal (${response.status})`)
    const noData = body.empty === true
    messages.value.push({
      id: `${Date.now()}-assistant`,
      sender: 'assistant',
      text: noData
        ? (body.message || 'Belum ada data penjualan yang tersedia untuk menjawab pertanyaan ini.')
        : (typeof body.answer === 'string' && body.answer.trim() ? body.answer : 'Server tidak mengirimkan jawaban insight.'),
      empty: noData,
    })
  } catch (err) {
    error.value = err.message || 'Insight tidak dapat dimuat dari server.'
  } finally {
    sending.value = false
    await scrollToBottom()
  }
}

onMounted(scrollToBottom)
</script>

<template>
  <div class="flex-1 w-full max-w-[1500px] mx-auto flex flex-col h-[calc(100vh-64px)] overflow-hidden">
    <header class="px-4 sm:px-6 py-4 bg-surface-container-lowest border-b border-surface-container-high/60 flex items-center justify-between gap-3 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center"><span class="material-symbols-outlined">query_stats</span></div>
        <div><h1 class="text-[17px] font-bold">Insight Penjualan</h1><p class="text-[11px] text-on-surface-variant">Tanya dan analisis data penjualan melalui server.</p></div>
      </div>
      <button type="button" @click="clearConversation" class="px-3 py-2 rounded-lg bg-surface-container-low text-[12px] font-semibold">Percakapan Baru</button>
    </header>

    <main ref="chatContainer" class="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
      <div v-if="messages.length === 0 && !sending" class="h-full min-h-64 flex flex-col items-center justify-center text-center">
        <span class="material-symbols-outlined text-[48px] text-outline">query_stats</span>
        <h2 class="mt-3 text-[16px] font-bold">Belum ada percakapan</h2>
        <p class="mt-1 max-w-md text-[12px] text-on-surface-variant">Ajukan pertanyaan khusus tentang penjualan. Jawaban dan ketersediaan data berasal dari server.</p>
        <div class="flex flex-wrap justify-center gap-2 mt-4">
          <button type="button" @click="askSalesQuestion('Berapa total penjualan hari ini?')" class="px-3 py-2 rounded-full bg-surface-container-lowest border border-surface-container text-[11px]">Total penjualan hari ini</button>
          <button type="button" @click="askSalesQuestion('Produk apa yang paling banyak terjual minggu ini?')" class="px-3 py-2 rounded-full bg-surface-container-lowest border border-surface-container text-[11px]">Produk terlaris minggu ini</button>
          <button type="button" @click="askSalesQuestion('Bagaimana tren penjualan 7 hari terakhir?')" class="px-3 py-2 rounded-full bg-surface-container-lowest border border-surface-container text-[11px]">Tren penjualan 7 hari</button>
        </div>
      </div>

      <div v-for="message in messages" :key="message.id" class="flex" :class="message.sender === 'user' ? 'justify-end' : 'justify-start'">
        <div class="max-w-3xl flex items-start gap-2" :class="message.sender === 'user' ? 'flex-row-reverse' : ''">
          <div class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center" :class="message.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary-fixed text-secondary'"><span class="material-symbols-outlined text-[17px]">{{ message.sender === 'user' ? 'person' : 'query_stats' }}</span></div>
          <div class="px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap" :class="message.sender === 'user' ? 'bg-primary text-white rounded-tr-sm' : (message.empty ? 'bg-surface-container-low border border-surface-container text-on-surface-variant rounded-tl-sm' : 'bg-surface-container-lowest border border-surface-container-high/60 rounded-tl-sm')">{{ message.text }}</div>
        </div>
      </div>

      <div v-if="error" class="max-w-3xl mx-auto p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-[12px]" role="alert"><strong class="block">Insight gagal dimuat</strong>{{ error }}</div>
      <div v-if="sending" class="flex items-center gap-2 text-[12px] text-on-surface-variant"><span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>Menunggu jawaban dari server…</div>
    </main>

    <footer class="p-4 md:px-8 md:pb-6 bg-surface shrink-0">
      <form @submit.prevent="sendQuestion" class="max-w-4xl mx-auto">
        <label for="sales-question" class="block mb-1.5 text-[11px] text-on-surface-variant">Pertanyaan hanya untuk analisis penjualan</label>
        <div class="w-full bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 shadow-sm p-2 flex items-center gap-2">
          <input id="sales-question" v-model="question" :disabled="sending" class="w-full bg-transparent text-[13px] py-2.5 px-2 focus:outline-none disabled:opacity-60" placeholder="Tanyakan tentang penjualan…" type="text" />
          <button type="submit" :disabled="sending || !question.trim()" class="h-10 px-4 rounded-xl bg-primary text-white font-medium text-[13px] flex items-center gap-1.5 disabled:opacity-40"><span>{{ sending ? 'Mengirim…' : 'Kirim' }}</span><span class="material-symbols-outlined text-[16px]">send</span></button>
        </div>
        <p class="mt-2 text-center text-[10px] text-on-surface-variant">Server memvalidasi pertanyaan dan menggunakan data penjualan yang tersedia.</p>
      </form>
    </footer>
  </div>
</template>
