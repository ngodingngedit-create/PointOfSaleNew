import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createPinia, setActivePinia } from 'pinia'
import { useCartStore } from '../src/stores/cart.js'

const STORAGE_KEY = 'pos_pending_checkout_v1'

function createSessionStorage() {
  const values = new Map()
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null },
    setItem(key, value) { values.set(key, String(value)) },
    removeItem(key) { values.delete(key) },
    clear() { values.clear() },
  }
}

function installGlobals(storage, fetchImpl) {
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage')
  const oldFetch = Object.getOwnPropertyDescriptor(globalThis, 'fetch')
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, writable: true, value: storage })
  Object.defineProperty(globalThis, 'fetch', { configurable: true, writable: true, value: fetchImpl })
  return () => {
    if (oldStorage) Object.defineProperty(globalThis, 'sessionStorage', oldStorage)
    else delete globalThis.sessionStorage
    if (oldFetch) Object.defineProperty(globalThis, 'fetch', oldFetch)
    else delete globalThis.fetch
  }
}

function newCart() {
  setActivePinia(createPinia())
  return useCartStore()
}

function addTestProduct(cart) {
  cart.addItem({
    id: 'coffee-1', name: 'Kopi Susu', price: 12000, stock: 5, sku: 'KS-1',
    phone: 'field-that-must-not-be-persisted',
  })
}

const firstCheckoutOptions = {
  branchId: 'branch-1',
  cashierId: 'cashier-1',
  memberId: 'member-42',
  orderType: 'dine_in',
  tableId: 'table-3',
  paymentMethod: 'qris',
}

test('unknown checkout survives reload and retry sends the exact frozen payload and key', async () => {
  const storage = createSessionStorage()
  const requestBodies = []
  const restoreGlobals = installGlobals(storage, async (_url, request) => {
    requestBodies.push(request.body)
    if (requestBodies.length === 1) throw new Error('network disconnected')
    return {
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', transactionId: 'transaction-1', items: [] }),
    }
  })
  try {
    const cart = newCart()
    addTestProduct(cart)
    await assert.rejects(cart.checkout(firstCheckoutOptions), (error) => error.outcomeUnknown === true)
    assert.equal(cart.checkoutOutcomeUnknown, true)
    cart.addItem({ id: 'another', name: 'Other', price: 1, stock: 1 })
    cart.setQty('coffee-1', 4)
    assert.equal(cart.items.length, 1)
    assert.equal(cart.items[0].qty, 1)

    const persistedRaw = storage.getItem(STORAGE_KEY)
    assert.ok(persistedRaw)
    assert.doesNotMatch(persistedRaw, /field-that-must-not-be-persisted|Ayu Rahasia|08123456789/)
    const persisted = JSON.parse(persistedRaw)
    assert.equal(persisted.payload.memberId, 'member-42')
    assert.equal(persisted.payload.items[0].productId, 'coffee-1')
    assert.equal(persisted.payload.items[0].qty, 1)
    assert.equal(persisted.payload.idempotencyKey, undefined)

    // A fresh Pinia store represents the app after refreshing this tab.
    const restoredCart = newCart()
    assert.equal(restoredCart.checkoutOutcomeUnknown, true)
    assert.equal(restoredCart.count, 1)
    const result = await restoredCart.checkout({
      branchId: 'different-branch', cashierId: 'different-cashier', memberId: null,
      orderType: 'take_away', paymentMethod: 'cash',
    })
    assert.equal(result.transactionId, 'transaction-1')
    assert.deepEqual(JSON.parse(requestBodies[1]), JSON.parse(requestBodies[0]))
    assert.equal(JSON.parse(requestBodies[1]).idempotencyKey, persisted.key)
    assert.equal(restoredCart.checkoutOutcomeUnknown, false)
    assert.equal(restoredCart.items.length, 0)
    assert.equal(storage.getItem(STORAGE_KEY), null)
  } finally {
    restoreGlobals()
  }
})

test('network errors, every 5xx, and invalid successful JSON preserve unknown checkout state', async () => {
  const scenarios = [
    ['network', async () => { throw new Error('offline') }],
    ['server error', async () => ({ ok: false, status: 503, json: async () => ({ error: 'temporary' }) })],
    ['invalid success JSON', async () => ({ ok: true, status: 200, json: async () => { throw new Error('invalid JSON') } })],
    ['invalid success shape', async () => ({ ok: true, status: 200, json: async () => ({ transactionId: 'missing-status-and-items' }) })],
  ]
  const storage = createSessionStorage()
  for (const [label, fetchImpl] of scenarios) {
    storage.clear()
    const restoreGlobals = installGlobals(storage, fetchImpl)
    try {
      const cart = newCart()
      addTestProduct(cart)
      await assert.rejects(cart.checkout(firstCheckoutOptions), (error) => {
        assert.equal(error.outcomeUnknown, true, label)
        return true
      })
      assert.equal(cart.checkoutOutcomeUnknown, true, label)
      assert.ok(storage.getItem(STORAGE_KEY), label)
      const frozen = JSON.parse(storage.getItem(STORAGE_KEY))
      cart.clear()
      assert.equal(cart.count, 1, label)
      assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).key, frozen.key, label)
    } finally {
      restoreGlobals()
    }
  }
})

test('a definitive 4xx response releases the pending checkout for a corrected new attempt', async () => {
  const storage = createSessionStorage()
  const restoreGlobals = installGlobals(storage, async () => ({
    ok: false,
    status: 400,
    json: async () => ({ error: 'invalid request' }),
  }))
  try {
    const cart = newCart()
    addTestProduct(cart)
    await assert.rejects(cart.checkout(firstCheckoutOptions), (error) => error.outcomeUnknown === false)
    assert.equal(cart.checkoutOutcomeUnknown, false)
    assert.equal(storage.getItem(STORAGE_KEY), null)
    assert.equal(cart.count, 1)
  } finally {
    restoreGlobals()
  }
})
