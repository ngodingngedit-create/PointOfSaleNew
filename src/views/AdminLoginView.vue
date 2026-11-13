<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function signIn() {
  if (!username.value || !password.value) {
    error.value = 'Enter the administrator username and password.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await auth.loginAdmin(username.value, password.value)
    password.value = ''
    await router.replace({ name: 'admin-cashier-pins' })
  } catch (err) {
    error.value = err.message || 'Administrator sign-in failed.'
    password.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-stone-100/80 px-4 py-8">
    <section class="w-full max-w-sm bg-white border border-stone-200 rounded-lg p-6 sm:p-8 shadow-xs">
      <div class="mb-6">
        <span class="inline-flex items-center justify-center w-10 h-10 rounded bg-stone-900 text-stone-100 text-xs font-bold tracking-wider uppercase mb-3 font-mono">POS</span>
        <h1 class="text-lg font-semibold text-stone-900 tracking-tight">Administrator sign-in</h1>
        <p class="text-xs text-stone-500 mt-1">Private access for managing cashier PINs.</p>
      </div>

      <form class="space-y-4" @submit.prevent="signIn">
        <div>
          <label for="admin-user" class="block text-xs font-medium text-stone-700 mb-1">Username</label>
          <input id="admin-user" v-model="username" autocomplete="username" required maxlength="128" class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900" />
        </div>
        <div>
          <label for="admin-password" class="block text-xs font-medium text-stone-700 mb-1">Password</label>
          <input id="admin-password" v-model="password" type="password" autocomplete="current-password" required maxlength="1024" class="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:border-stone-900" />
        </div>
        <p v-if="error" role="alert" class="text-xs text-red-800 bg-red-50 border border-red-200 rounded p-2.5">{{ error }}</p>
        <button type="submit" :disabled="loading" class="w-full h-11 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-md disabled:opacity-40">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <div class="mt-5 pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
        <RouterLink to="/login" class="font-semibold text-stone-900 hover:underline">Back to cashier login</RouterLink>
      </div>
    </section>
  </main>
</template>
