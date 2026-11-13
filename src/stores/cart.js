import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([]) // { product, qty }

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  )
  const count = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))

  function matchesLine(item, productId, variantKey = null) {
    return item.product.id === productId && (item.product.variantKey || null) === (variantKey || null)
  }

  function addItem(product, variant = null) {
    const selected = {
      ...product,
      price: variant?.price ?? product.price,
      stock: variant?.stock ?? product.stock,
      sku: variant?.sku || product.sku || '',
      variantName: variant?.name || '',
      variantKey: variant?.id || null,
    }
    if (selected.stock <= 0) return
    const existing = items.value.find((i) => matchesLine(i, product.id, selected.variantKey))
    if (existing) {
      if (existing.qty >= selected.stock) return
      existing.qty++
    } else {
      items.value.push({ product: selected, qty: 1 })
    }
  }

  function incrementQty(productId, variantKey = null) {
    const item = items.value.find((i) => matchesLine(i, productId, variantKey))
    if (item && item.qty < item.product.stock) {
      item.qty++
    }
  }

  function decrementQty(productId, variantKey = null) {
    const item = items.value.find((i) => matchesLine(i, productId, variantKey))
    if (!item) return
    if (item.qty <= 1) {
      removeItem(productId, variantKey)
    } else {
      item.qty--
    }
  }

  function setQty(productId, newQty, variantKey = null) {
    const item = items.value.find((i) => matchesLine(i, productId, variantKey))
    if (!item) return
    const parsed = Number(newQty)
    if (isNaN(parsed) || parsed <= 0) {
      removeItem(productId, variantKey)
    } else {
      item.qty = Math.min(parsed, item.product.stock)
    }
  }

  function removeItem(productId, variantKey = null) {
    items.value = items.value.filter((i) => !matchesLine(i, productId, variantKey))
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

    // Server resolves authoritative SKU, price, and stock from Sanity.
    const payload = {
      items: items.value.map((i) => ({
        productId: i.product.id,
        ...(i.product.variantKey ? { variantKey: i.product.variantKey } : {}),
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
