import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const PENDING_CHECKOUT_STORAGE_KEY = 'pos_pending_checkout_v1'
const PRODUCT_SNAPSHOT_FIELDS = ['id', 'name', 'price', 'stock', 'sku', 'variantName', 'variantKey']

function snapshotProduct(product = {}) {
  return Object.fromEntries(PRODUCT_SNAPSHOT_FIELDS
    .filter((field) => Object.hasOwn(product, field))
    .map((field) => [field, product[field]]))
}

function readPendingCheckout() {
  try {
    if (typeof sessionStorage === 'undefined') return null
    const raw = sessionStorage.getItem(PENDING_CHECKOUT_STORAGE_KEY)
    if (!raw) return null
    const pending = JSON.parse(raw)
    if (!pending || typeof pending !== 'object' || typeof pending.key !== 'string' ||
      !pending.payload || typeof pending.payload !== 'object' || !Array.isArray(pending.items) ||
      pending.items.length === 0 || !Array.isArray(pending.payload.items)) return null
    const items = pending.items.filter((item) => item && item.product && item.product.id != null &&
      Number.isInteger(item.qty) && item.qty > 0)
      .map((item) => ({ product: snapshotProduct(item.product), qty: item.qty }))
    if (!items.length || items.length !== pending.items.length) return null
    return { key: pending.key, payload: pending.payload, items }
  } catch {
    return null
  }
}

export const useCartStore = defineStore('cart', () => {
  const restoredCheckout = readPendingCheckout()
  const items = ref(restoredCheckout?.items || []) // { product, qty }
  const pendingCheckoutKey = ref(restoredCheckout?.key || null)
  const pendingCheckoutPayload = ref(restoredCheckout?.payload || null)
  const pendingCheckoutItems = ref(restoredCheckout?.items || null)
  const checkoutOutcomeUnknown = computed(() => Boolean(pendingCheckoutKey.value))

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  )
  const count = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))

  function matchesLine(item, productId, variantKey = null) {
    return item.product.id === productId && (item.product.variantKey || null) === (variantKey || null)
  }

  function addItem(product, variant = null) {
    if (checkoutOutcomeUnknown.value) return
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
    if (checkoutOutcomeUnknown.value) return
    const item = items.value.find((i) => matchesLine(i, productId, variantKey))
    if (item && item.qty < item.product.stock) item.qty++
  }

  function decrementQty(productId, variantKey = null) {
    if (checkoutOutcomeUnknown.value) return
    const item = items.value.find((i) => matchesLine(i, productId, variantKey))
    if (!item) return
    if (item.qty <= 1) removeItem(productId, variantKey)
    else item.qty--
  }

  function setQty(productId, newQty, variantKey = null) {
    if (checkoutOutcomeUnknown.value) return
    const item = items.value.find((i) => matchesLine(i, productId, variantKey))
    if (!item) return
    const parsed = Number(newQty)
    if (isNaN(parsed) || parsed <= 0) removeItem(productId, variantKey)
    else item.qty = Math.min(parsed, item.product.stock)
  }

  function removeItem(productId, variantKey = null) {
    if (checkoutOutcomeUnknown.value) return
    items.value = items.value.filter((i) => !matchesLine(i, productId, variantKey))
  }

  function clear() {
    if (checkoutOutcomeUnknown.value) return
    items.value = []
  }

  function makeIdempotencyKey() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
    const bytes = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256))
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  function persistPendingCheckout() {
    if (typeof sessionStorage === 'undefined') {
      throw new Error('Checkout dibatalkan karena penyimpanan sesi tidak tersedia; tidak ada permintaan yang dikirim.')
    }
    // Simpan hanya data transaksi yang diperlukan untuk retry; tidak menyertakan nama/telepon member.
    const persisted = {
      key: pendingCheckoutKey.value,
      payload: pendingCheckoutPayload.value,
      items: pendingCheckoutItems.value.map((item) => ({ product: snapshotProduct(item.product), qty: item.qty })),
    }
    sessionStorage.setItem(PENDING_CHECKOUT_STORAGE_KEY, JSON.stringify(persisted))
  }

  function clearPendingCheckout() {
    pendingCheckoutKey.value = null
    pendingCheckoutPayload.value = null
    pendingCheckoutItems.value = null
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(PENDING_CHECKOUT_STORAGE_KEY)
    } catch {
      // In-memory state is cleared; a stale session snapshot can still be safely retried by its key.
    }
  }

  async function checkout({ paymentMethod, branchId, cashierId, memberId, orderType, tableId } = {}) {
    if (!pendingCheckoutKey.value && items.value.length === 0) throw new Error('Keranjang belanja kosong')

    if (!pendingCheckoutKey.value) {
      pendingCheckoutKey.value = makeIdempotencyKey()
      pendingCheckoutItems.value = items.value.map((item) => ({ product: { ...item.product }, qty: item.qty }))
      // Harga dan stok tetap divalidasi ulang oleh server.
      pendingCheckoutPayload.value = {
        ...(branchId ? { branchId } : {}),
        ...(cashierId ? { cashierId } : {}),
        ...(memberId ? { memberId } : {}),
        ...(orderType ? { orderType } : {}),
        ...(orderType === 'dine_in' && tableId ? { tableId } : {}),
        paymentMethod,
        items: pendingCheckoutItems.value.map((i) => ({
          productId: i.product.id,
          ...(i.product.variantKey ? { variantKey: i.product.variantKey } : {}),
          qty: i.qty,
        })),
      }
      try {
        persistPendingCheckout()
      } catch (error) {
        clearPendingCheckout()
        throw error
      }
    }

    // If this is a retry, ignore current form/cart values and use the persisted request verbatim.
    const payload = { ...pendingCheckoutPayload.value, idempotencyKey: pendingCheckoutKey.value }
    let response
    try {
      response = await fetch('/api/checkout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (cause) {
      const error = new Error(cause?.message || 'Koneksi terputus saat checkout. Coba lagi untuk memastikan hasil transaksi.')
      error.outcomeUnknown = true
      throw error
    }

    let data = null
    try {
      data = await response.json()
    } catch {
      if (response.ok || response.status >= 500) {
        const error = new Error('Respons checkout tidak dapat diverifikasi. Ulangi checkout untuk mencoba lagi dengan kunci yang sama.')
        error.outcomeUnknown = true
        throw error
      }
    }

    if (!response.ok) {
      const error = new Error(data?.error || `Checkout gagal (${response.status})`)
      error.outcomeUnknown = response.status >= 500 || data?.outcomeUnknown === true
      if (!error.outcomeUnknown) clearPendingCheckout()
      throw error
    }

    if (!data || typeof data !== 'object' || Array.isArray(data) || data.status !== 'success' ||
      typeof data.transactionId !== 'string' || !Array.isArray(data.items)) {
      const error = new Error('Respons sukses checkout tidak valid. Ulangi checkout dengan kunci yang sama untuk memastikan hasil transaksi.')
      error.outcomeUnknown = true
      throw error
    }

    const completedItems = pendingCheckoutItems.value || []
    items.value = []
    clearPendingCheckout()
    return { ...data, items: completedItems }
  }

  return {
    items,
    total,
    count,
    checkoutOutcomeUnknown,
    addItem,
    incrementQty,
    decrementQty,
    setQty,
    removeItem,
    clear,
    checkout,
  }
})
