import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

async function parseResponse(res, fallback) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || fallback)
  return data
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null)
  const loading = ref(true)
  const initialized = ref(false)
  const cashier = computed(() => session.value?.role === 'cashier' ? session.value.cashier : null)
  const admin = computed(() => session.value?.role === 'admin' ? session.value.admin : null)

  function clearSession() {
    session.value = null
  }

  async function init(force = false) {
    if (initialized.value && !force) return
    loading.value = true
    try {
      const res = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' })
      if (!res.ok) {
        clearSession()
        return
      }
      const data = await res.json()
      if (data.authenticated && data.role === 'cashier' && data.cashier?.id) {
        session.value = { role: 'cashier', cashier: data.cashier }
      } else if (data.authenticated && data.role === 'admin' && data.admin?.username) {
        session.value = { role: 'admin', admin: data.admin }
      } else {
        clearSession()
      }
    } catch {
      clearSession()
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function fetchCashiers() {
    const res = await fetch('/api/cashiers', { credentials: 'same-origin', cache: 'no-store' })
    return parseResponse(res, 'Unable to load cashier profiles')
  }

  async function loginWithPin(cashierId, pin) {
    const res = await fetch('/api/login-pin', {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cashierId, pin }),
    })
    const data = await parseResponse(res, 'PIN verification failed')
    session.value = { role: 'cashier', cashier: data.cashier }
    initialized.value = true
    return data
  }

  async function loginAdmin(username, password) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await parseResponse(res, 'Administrator sign-in failed')
    session.value = { role: 'admin', admin: data.admin }
    initialized.value = true
    return data
  }

  async function logout() {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
      })
    } finally {
      clearSession()
      initialized.value = true
    }
  }

  return {
    session,
    cashier,
    admin,
    loading,
    initialized,
    init,
    fetchCashiers,
    loginWithPin,
    loginAdmin,
    logout,
  }
})
