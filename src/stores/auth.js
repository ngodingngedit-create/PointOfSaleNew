import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'pos_cashier_session'

export const useAuthStore = defineStore('auth', () => {
  const cashier = ref(null) // { id, name, role }
  const token = ref(null)
  const loading = ref(true)

  // Inisialisasi session dari localStorage
  function init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        cashier.value = parsed.cashier || null
        token.value = parsed.token || null
      }
    } catch (e) {
      console.warn('Gagal memuat session kasir lokal:', e)
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      loading.value = false
    }
  }

  // Ambil daftar kasir aktif untuk pilihan profil
  async function fetchCashiers() {
    const res = await fetch('/api/cashiers')
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Gagal mengambil daftar kasir')
    }
    return await res.json()
  }

  // Verifikasi PIN kasir via serverless endpoint Vercel
  async function loginWithPin(cashierId, pin) {
    const res = await fetch('/api/login-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cashierId, pin }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.error || 'Verifikasi PIN gagal')
    }

    cashier.value = data.cashier
    token.value = data.token

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ cashier: data.cashier, token: data.token })
    )

    return data
  }

  function logout() {
    cashier.value = null
    token.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    cashier,
    token,
    loading,
    init,
    fetchCashiers,
    loginWithPin,
    logout,
  }
})
