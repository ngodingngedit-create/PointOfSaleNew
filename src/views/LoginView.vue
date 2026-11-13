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
    cashiers.value = Array.isArray(list) ? list : []
    if (cashiers.value.length > 0) selectedCashier.value = cashiers.value[0]
  } catch (e) {
    error.value = e.message || 'Unable to load cashier profiles.'
  } finally {
    fetchingCashiers.value = false
  }
}

function selectCashier(cashier) {
  selectedCashier.value = cashier
  pin.value = ''
  error.value = ''
}

function appendPin(digit) {
  if (!loading.value && pin.value.length < 6) {
    pin.value += String(digit)
    error.value = ''
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
    error.value = 'Choose a cashier profile first.'
    return
  }
  if (!/^\d{4,6}$/.test(pin.value)) {
    error.value = 'PIN must contain 4 to 6 digits.'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await auth.loginWithPin(selectedCashier.value.id, pin.value)
    pin.value = ''
    await router.replace('/')
  } catch (e) {
    error.value = e.message || 'PIN is not valid.'
    pin.value = ''
  } finally {
    loading.value = false
  }
}

function handleKeyDown(event) {
  if (loading.value) return
  if (/^[0-9]$/.test(event.key)) appendPin(event.key)
  else if (event.key === 'Backspace') backspacePin()
  else if (event.key === 'Escape') clearPin()
  else if (event.key === 'Enter') submitPin()
}

onMounted(() => {
  loadCashiers()
  window.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-stone-100/80 px-4 py-8">
    <section class="w-full max-w-md bg-white border border-stone-200 rounded-lg p-6 sm:p-8 shadow-xs">
      <header class="text-center mb-6">
        <span class="inline-flex items-center justify-center w-10 h-10 rounded bg-stone-900 text-stone-100 text-xs font-bold tracking-wider uppercase mb-2 font-mono">POS</span>
        <h1 class="text-lg font-semibold text-stone-900 tracking-tight">Cashier terminal</h1>
        <p class="text-xs text-stone-500 mt-1">Choose your profile and enter your PIN to start.</p>
      </header>

      <div class="mb-5">
        <label class="block text-xs font-medium text-stone-600 mb-2">Cashier profile</label>
        <div v-if="fetchingCashiers" class="py-4 text-center text-xs text-stone-400">Loading cashier profiles…</div>
        <div v-else-if="cashiers.length === 0" class="py-4 text-center text-xs text-stone-500">No active cashier profiles were found.</div>
        <div v-else class="grid grid-cols-2 gap-2">
          <button
            v-for="cashier in cashiers"
            :key="cashier.id"
            type="button"
            @click="selectCashier(cashier)"
            class="p-2.5 rounded border text-left flex items-center gap-2.5 transition-colors"
            :class="selectedCashier?.id === cashier.id ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300'"
          >
            <span class="w-7 h-7 rounded text-[10px] font-bold flex items-center justify-center font-mono" :class="selectedCashier?.id === cashier.id ? 'bg-stone-800 text-stone-200' : 'bg-stone-200 text-stone-700'">{{ cashier.avatar || cashier.name.slice(0, 2).toUpperCase() }}</span>
            <span class="min-w-0 flex-1 leading-tight">
              <span class="block text-xs font-medium truncate">{{ cashier.name }}</span>
              <span class="block text-[10px] opacity-75 capitalize font-mono">{{ cashier.role }}</span>
            </span>
          </button>
        </div>
      </div>

      <div class="bg-stone-50 border border-stone-200 rounded-md p-3 mb-4 text-center">
        <p class="text-[11px] text-stone-500 mb-2 font-mono">Cashier: <strong class="text-stone-800">{{ selectedCashier?.name || '—' }}</strong></p>
        <div class="flex items-center justify-center gap-2 h-8">
          <span v-for="idx in 6" :key="idx" class="w-3 h-3 rounded-full border transition-all" :class="pin.length >= idx ? 'bg-stone-900 border-stone-900 scale-110' : 'bg-white border-stone-300'"></span>
        </div>
        <p class="text-[10px] text-stone-400 mt-1">Enter 4 to 6 digits, then choose Sign in.</p>
      </div>

      <p v-if="error" role="alert" class="text-xs text-red-800 bg-red-50 border border-red-200 rounded p-2.5 mb-4 text-center">{{ error }}</p>

      <div class="grid grid-cols-3 gap-2 mb-4">
        <button v-for="digit in [1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="digit" type="button" @click="appendPin(digit)" :disabled="loading || pin.length >= 6" class="h-12 border border-stone-200 bg-white hover:bg-stone-100 active:bg-stone-200 rounded-md text-base font-semibold font-mono text-stone-900 disabled:opacity-40">{{ digit }}</button>
        <button type="button" @click="clearPin" :disabled="loading || pin.length === 0" class="h-12 border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-500 text-xs font-medium rounded-md disabled:opacity-40">Clear</button>
        <button type="button" @click="appendPin(0)" :disabled="loading || pin.length >= 6" class="h-12 border border-stone-200 bg-white hover:bg-stone-100 active:bg-stone-200 rounded-md text-base font-semibold font-mono text-stone-900 disabled:opacity-40">0</button>
        <button type="button" @click="backspacePin" :disabled="loading || pin.length === 0" class="h-12 border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-md disabled:opacity-40">Delete</button>
      </div>

      <button type="button" @click="submitPin" :disabled="loading || pin.length < 4 || !selectedCashier" class="w-full h-11 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-md disabled:opacity-40">
        {{ loading ? 'Verifying…' : 'Sign in to POS' }}
      </button>

      <p class="mt-4 pt-3 border-t border-stone-100 text-center text-[11px] text-stone-500">PIN not set? Ask an administrator to configure it.</p>
      <div class="mt-2 text-center text-xs"><RouterLink to="/admin/login" class="text-stone-800 font-semibold hover:underline">Administrator access</RouterLink></div>
    </section>
  </main>
</template>
