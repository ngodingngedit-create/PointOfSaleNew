<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const cashiers = ref([])
const loading = ref(true)
const busyId = ref('')
const error = ref('')
const notice = ref('')

async function loadCashiers() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/admin/cashier-pins', { credentials: 'same-origin', cache: 'no-store' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Unable to load cashier profiles.')
    cashiers.value = Array.isArray(data) ? data.map((cashier) => ({ ...cashier, newPin: '' })) : []
  } catch (err) {
    error.value = err.message || 'Unable to load cashier profiles.'
  } finally {
    loading.value = false
  }
}

function keepDigits(cashier) {
  cashier.newPin = String(cashier.newPin || '').replace(/\D/g, '').slice(0, 4)
}

async function savePin(cashier) {
  keepDigits(cashier)
  if (!/^\d{4}$/.test(cashier.newPin)) {
    error.value = 'A cashier PIN must contain exactly 4 digits.'
    notice.value = ''
    return
  }
  busyId.value = cashier.id
  error.value = ''
  notice.value = ''
  try {
    const res = await fetch('/api/admin/cashier-pins', {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cashierId: cashier.id, pin: cashier.newPin }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Unable to save PIN.')
    cashier.hasPin = true
    notice.value = `PIN saved for ${cashier.name}.`
  } catch (err) {
    error.value = err.message || 'Unable to save PIN.'
  } finally {
    cashier.newPin = ''
    busyId.value = ''
  }
}

async function clearPin(cashier) {
  if (!window.confirm(`Remove the PIN for ${cashier.name}? They will no longer be able to sign in until a new PIN is set.`)) return
  busyId.value = cashier.id
  error.value = ''
  notice.value = ''
  try {
    const res = await fetch('/api/admin/cashier-pins', {
      method: 'DELETE',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cashierId: cashier.id }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Unable to remove PIN.')
    cashier.hasPin = false
    notice.value = `PIN removed for ${cashier.name}.`
  } catch (err) {
    error.value = err.message || 'Unable to remove PIN.'
  } finally {
    cashier.newPin = ''
    busyId.value = ''
  }
}

async function signOut() {
  await auth.logout()
  await router.replace({ name: 'admin-login' })
}

onMounted(loadCashiers)
</script>

<template>
  <main class="min-h-screen bg-stone-100/80 px-4 py-8">
    <section class="max-w-3xl mx-auto">
      <header class="flex items-start justify-between gap-4 mb-6">
        <div>
          <span class="inline-flex items-center justify-center w-9 h-9 rounded bg-stone-900 text-stone-100 text-xs font-bold tracking-wider uppercase mb-3 font-mono">POS</span>
          <h1 class="text-xl font-semibold text-stone-900 tracking-tight">Cashier PIN management</h1>
          <p class="text-sm text-stone-500 mt-1">PINs are salted and hashed on the server. The original PIN is never displayed or saved in the public cashier directory.</p>
        </div>
        <button type="button" @click="signOut" class="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 bg-white rounded-md whitespace-nowrap">Sign out</button>
      </header>

      <p v-if="error" role="alert" class="text-sm text-red-800 bg-red-50 border border-red-200 rounded p-3 mb-4">{{ error }}</p>
      <p v-if="notice" role="status" class="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded p-3 mb-4">{{ notice }}</p>

      <div v-if="loading" class="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-500">Loading cashier profiles…</div>
      <div v-else-if="cashiers.length === 0" class="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-600">No active cashier profiles were found in the existing directory.</div>
      <div v-else class="space-y-3">
        <article v-for="cashier in cashiers" :key="cashier.id" class="rounded-lg border border-stone-200 bg-white p-4 sm:p-5">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div class="min-w-0">
              <h2 class="font-semibold text-stone-900 truncate">{{ cashier.name }}</h2>
              <p class="text-xs text-stone-500 capitalize">{{ cashier.role || 'cashier' }} · {{ cashier.hasPin ? 'PIN set' : 'No PIN set' }}</p>
            </div>
            <span class="text-[11px] px-2 py-1 rounded-full font-medium" :class="cashier.hasPin ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'">{{ cashier.hasPin ? 'Configured' : 'Setup required' }}</span>
          </div>

          <div class="flex flex-col sm:flex-row gap-2">
            <label class="sr-only" :for="`pin-${cashier.id}`">New PIN for {{ cashier.name }}</label>
            <input
              :id="`pin-${cashier.id}`"
              v-model="cashier.newPin"
              type="password"
              inputmode="numeric"
              autocomplete="new-password"
              pattern="[0-9]{4}"
              minlength="4"
              maxlength="4"
              placeholder="Enter a new 4-digit PIN"
              @input="keepDigits(cashier)"
              class="flex-1 min-w-0 h-10 px-3 text-sm font-mono tracking-widest bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900"
            />
            <button type="button" :disabled="busyId === cashier.id" @click="savePin(cashier)" class="h-10 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md disabled:opacity-40">
              {{ busyId === cashier.id ? 'Saving…' : cashier.hasPin ? 'Save / change PIN' : 'Set PIN' }}
            </button>
            <button v-if="cashier.hasPin" type="button" :disabled="busyId === cashier.id" @click="clearPin(cashier)" class="h-10 px-4 border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-md disabled:opacity-40">Remove PIN</button>
          </div>
        </article>
      </div>

      <p class="text-xs text-stone-500 mt-5">A cashier must use the new PIN the next time they sign in. Removing a PIN blocks that cashier from signing in until you set one again.</p>
    </section>
  </main>
</template>
