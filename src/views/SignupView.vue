<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const cafeName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSignup() {
  error.value = ''
  if (password.value.length < 6) {
    error.value = 'Password minimal 6 karakter'
    return
  }
  loading.value = true
  try {
    await auth.signup(email.value, password.value, cafeName.value)
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-100/80 px-4 py-8">
    <div class="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-6 sm:p-7 shadow-xs">
      <div class="mb-6">
        <span class="inline-flex items-center justify-center w-9 h-9 rounded bg-stone-900 text-stone-100 text-xs font-bold tracking-wider uppercase mb-3">
          POS
        </span>
        <h1 class="text-lg font-semibold text-stone-900 tracking-tight">Registrasi Cafe Baru</h1>
        <p class="text-xs text-stone-500 mt-1">Satu akun mendaftarkan cafe independen dengan isolasi data multi-tenant.</p>
      </div>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-stone-700 mb-1">Nama Cafe</label>
          <input
            v-model="cafeName"
            type="text"
            required
            class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900 transition-colors"
            placeholder="Kopi Senja"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-stone-700 mb-1">Email Administrator</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900 transition-colors"
            placeholder="owner@kopisenja.com"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-stone-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900 transition-colors"
            placeholder="Minimal 6 karakter"
          />
        </div>

        <p v-if="error" class="text-xs text-red-800 bg-red-50 border border-red-200 rounded p-2.5">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full h-10 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm rounded-md disabled:opacity-40 transition-colors"
        >
          {{ loading ? 'Mendaftarkan cafe...' : 'Daftar & Buat Cafe' }}
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
        Sudah memiliki akun?
        <RouterLink to="/login" class="text-stone-900 font-semibold hover:underline ml-1">
          Masuk di sini
        </RouterLink>
      </div>
    </div>
  </div>
</template>
