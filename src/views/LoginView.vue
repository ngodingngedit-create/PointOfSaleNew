<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const cashiers = ref([])
const selectedCashier = ref(null)
const pin = ref('')
const error = ref('')
const loading = ref(false)
const fetchingCashiers = ref(true)

async function loadCashiers() {
  fetchingCashiers.value = true
  error.value = ''
  try {
    const list = await auth.fetchCashiers()
    cashiers.value = list || []
    if (cashiers.value.length > 0) {
      selectedCashier.value = cashiers.value[0]
    }
  } catch (e) {
    error.value = e.message || 'Gagal memuat daftar kasir'
  } finally {
    fetchingCashiers.value = false
  }
}

function selectCashier(c) {
  selectedCashier.value = c
  pin.value = ''
  error.value = ''
}

function appendPin(digit) {
  if (pin.value.length < 6) {
    pin.value += String(digit)
    error.value = ''
    if (pin.value.length >= 4) {
      // Auto submit saat mencapai 4 digit
      submitPin()
    }
  }
}

function backspacePin() {
  pin.value = pin.value.slice(0, -1)
  error.value = ''
}

function clearPin() {
  pin.value = ''
  error.value = ''
}

async function submitPin() {
  if (!selectedCashier.value) {
    error.value = 'Pilih profil kasir terlebih dahulu'
    return
  }
  if (pin.value.length < 4) {
    error.value = 'PIN minimal 4 digit angka'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await auth.loginWithPin(selectedCashier.value.id, pin.value)
    router.push('/')
  } catch (e) {
    error.value = e.message || 'PIN tidak sesuai'
    pin.value = ''
  } finally {
    loading.value = false
  }
}

// Support input dari keyboard fisik
function handleKeyDown(e) {
  if (loading.value) return
  if (/^[0-9]$/.test(e.key)) {
    appendPin(e.key)
  } else if (e.key === 'Backspace') {
    backspacePin()
  } else if (e.key === 'Escape') {
    clearPin()
  } else if (e.key === 'Enter') {
    submitPin()
  }
}

onMounted(() => {
  loadCashiers()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-100/80 px-4 py-8">
    <div class="w-full max-w-md bg-white border border-stone-200 rounded-lg p-6 sm:p-8 shadow-xs">
      <div class="text-center mb-6">
        <span class="inline-flex items-center justify-center w-10 h-10 rounded bg-stone-900 text-stone-100 text-xs font-bold tracking-wider uppercase mb-2 font-mono">
          POS
        </span>
        <h1 class="text-lg font-semibold text-stone-900 tracking-tight">Kunci Akses Terminal Kasir</h1>
        <p class="text-xs text-stone-500 mt-1">Pilih nama staf lalu masukkan PIN untuk memulai transaksi.</p>
      </div>

      <!-- Pemilihan Kasir Profil -->
      <div class="mb-5">
        <label class="block text-xs font-medium text-stone-600 mb-2">Pilih Akun Kasir / Shift:</label>
        <div v-if="fetchingCashiers" class="py-4 text-center text-xs text-stone-400">
          Memuat daftar kasir...
        </div>
        <div v-else class="grid grid-cols-2 gap-2">
          <button
            v-for="c in cashiers"
            :key="c.id"
            type="button"
            @click="selectCashier(c)"
            class="p-2.5 rounded border text-left flex items-center gap-2.5 transition-colors"
            :class="selectedCashier?.id === c.id
              ? 'border-stone-900 bg-stone-900 text-white'
              : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300'"
          >
            <span
              class="w-7 h-7 rounded text-[10px] font-bold flex items-center justify-center font-mono"
              :class="selectedCashier?.id === c.id ? 'bg-stone-800 text-stone-200' : 'bg-stone-200 text-stone-700'"
            >
              {{ c.avatar || c.name.slice(0, 2).toUpperCase() }}
            </span>
            <div class="min-w-0 flex-1 leading-tight">
              <p class="text-xs font-medium truncate">{{ c.name }}</p>
              <p class="text-[10px] opacity-75 capitalize font-mono">{{ c.role }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Indikator Dots PIN -->
      <div class="bg-stone-50 border border-stone-200 rounded-md p-3 mb-4 text-center">
        <p class="text-[11px] text-stone-500 mb-2 font-mono">
          Kasir: <strong class="text-stone-800">{{ selectedCashier?.name || '-' }}</strong>
        </p>
        <div class="flex items-center justify-center gap-3 h-8">
          <div
            v-for="idx in 4"
            :key="idx"
            class="w-3.5 h-3.5 rounded-full border transition-all"
            :class="pin.length >= idx
              ? 'bg-stone-900 border-stone-900 scale-110'
              : 'bg-white border-stone-300'"
          ></div>
        </div>
      </div>

      <p v-if="error" class="text-xs text-red-800 bg-red-50 border border-red-200 rounded p-2.5 mb-4 text-center">
        {{ error }}
      </p>

      <!-- Numpad Sentuh 1-9, 0, Backspace -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <button
          v-for="digit in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
          :key="digit"
          type="button"
          @click="appendPin(digit)"
          :disabled="loading"
          class="h-12 border border-stone-200 bg-white hover:bg-stone-100 active:bg-stone-200 rounded-md text-base font-semibold font-mono text-stone-900 transition-colors flex items-center justify-center"
        >
          {{ digit }}
        </button>
        <button
          type="button"
          @click="clearPin"
          :disabled="loading || pin.length === 0"
          class="h-12 border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-500 text-xs font-medium rounded-md transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          @click="appendPin(0)"
          :disabled="loading"
          class="h-12 border border-stone-200 bg-white hover:bg-stone-100 active:bg-stone-200 rounded-md text-base font-semibold font-mono text-stone-900 transition-colors flex items-center justify-center"
        >
          0
        </button>
        <button
          type="button"
          @click="backspacePin"
          :disabled="loading || pin.length === 0"
          class="h-12 border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-md transition-colors flex items-center justify-center font-mono"
        >
          Hapus
        </button>
      </div>

      <button
        type="button"
        @click="submitPin"
        :disabled="loading || pin.length < 4"
        class="w-full h-11 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-md disabled:opacity-40 transition-colors"
      >
        {{ loading ? 'Memverifikasi PIN...' : 'Masuk ke Layar Kasir' }}
      </button>

      <div class="mt-4 pt-3 border-t border-stone-100 text-center text-[11px] text-stone-400 font-mono">
        Ketik PIN via keyboard fisik atau tombol layar. (PIN default: 1234)
      </div>
    </div>
  </div>
</template>
