import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([]) // { product, qty }

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  )
  const count = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))

  function addItem(product) {
    if (product.stock <= 0) return
    const existing = items.value.find((i) => i.product.id === product.id)
    if (existing) {
      if (existing.qty >= product.stock) return
      existing.qty++
    } else {
      items.value.push({ product, qty: 1 })
    }
  }

  function incrementQty(productId) {
    const item = items.value.find((i) => i.product.id === productId)
    if (item && item.qty < item.product.stock) {
      item.qty++
    }
  }

  function decrementQty(productId) {
    const item = items.value.find((i) => i.product.id === productId)
    if (!item) return
    if (item.qty <= 1) {
      removeItem(productId)
    } else {
      item.qty--
    }
  }

  function setQty(productId, newQty) {
    const item = items.value.find((i) => i.product.id === productId)
    if (!item) return
    const parsed = Number(newQty)
    if (isNaN(parsed) || parsed <= 0) {
      removeItem(productId)
    } else {
      item.qty = Math.min(parsed, item.product.stock)
    }
  }

  function removeItem(productId) {
    items.value = items.value.filter((i) => i.product.id !== productId)
  }

  function clear() {
    items.value = []
  }

  // Checkout via server-side endpoint /api/checkout
  async function checkout(paymentMethod) {
    if (items.value.length === 0) {
      throw new Error('Keranjang belanja kosong')
    }

    // Buat idempotency key unik untuk mencegah submit dobel
    const idempotencyKey =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `idemp-${Date.now()}-${Math.random().toString(36).slice(2)}`

    // Payload hanya mengirim ID produk, jumlah, payment method, dan idempotency key
    const payload = {
      items: items.value.map((i) => ({
        productId: i.product.id,
        qty: i.qty,
      })),
      paymentMethod,
      idempotencyKey,
    }

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.error || `Checkout gagal (${response.status})`)
    }

    const completedItems = [...items.value]
    clear()
    return { ...data, items: completedItems }
  }

  return {
    items,
    total,
    count,
    addItem,
    incrementQty,
    decrementQty,
    setQty,
    removeItem,
    clear,
    checkout,
  }
})
