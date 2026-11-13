import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createPinia, setActivePinia } from 'pinia'
import { buildCheckoutPlan, parseCheckoutItems } from '../api/_lib/checkout-plan.js'
import { normalizeSanityProduct } from '../src/lib/product.js'
import { useCartStore } from '../src/stores/cart.js'

test('Sanity product normalization prefers uploaded assets and retains legacy imageUrl support', () => {
  const uploaded = normalizeSanityProduct({
    _id: 'coffee-1',
    name: 'Coffee',
    price: 12000,
    stock: 5,
    image: {asset: {url: 'https://cdn.sanity.io/images/uploaded.jpg'}},
    imageUrl: 'https://example.com/old.jpg',
  })
  assert.equal(uploaded.image_url, 'https://cdn.sanity.io/images/uploaded.jpg')
  assert.deepEqual(uploaded.variants, [])

  const legacy = normalizeSanityProduct({
    _id: 'coffee-2',
    name: 'Legacy Coffee',
    price: 10000,
    stock: 2,
    imageUrl: 'https://example.com/legacy.jpg',
  })
  assert.equal(legacy.image_url, 'https://example.com/legacy.jpg')
  assert.equal(legacy.sku, '')
})

test('product normalization preserves zero-valued variant price and stock overrides', () => {
  const product = normalizeSanityProduct({
    _id: 'tea',
    name: 'Tea',
    price: 9000,
    stock: 8,
    variants: [{_key: 'sugar-free', name: 'Sugar Free', sku: 'TEA-SF', price: 0, stock: 0}],
  })
  assert.deepEqual(product.variants, [{id: 'sugar-free', name: 'Sugar Free', sku: 'TEA-SF', price: 0, stock: 0}])
})

test('checkout request parsing aggregates duplicate product/variant lines but keeps variants separate', () => {
  const lines = parseCheckoutItems([
    {productId: 'drink', variantKey: 'large', qty: 1},
    {productId: 'drink', variantKey: 'large', qty: 2},
    {productId: 'drink', variantKey: 'small', qty: 1},
    {productId: 'snack', qty: 1},
  ])
  assert.deepEqual(lines, [
    {productId: 'drink', variantKey: 'large', qty: 3},
    {productId: 'drink', variantKey: 'small', qty: 1},
    {productId: 'snack', variantKey: null, qty: 1},
  ])
  assert.throws(() => parseCheckoutItems([{productId: 'drink', variantKey: 'bad"].stock', qty: 1}]), (error) => error.statusCode === 400)
})

test('checkout resolves per-variant SKU and overrides, using parent values when overrides are blank', () => {
  const products = [{
    _id: 'drink',
    _rev: 'rev-1',
    name: 'Kopi Galariku',
    category: 'Kopi',
    price: 10000,
    stock: 10,
    isActive: true,
    variants: [
      {_key: 'large', name: 'Large', sku: 'KG-L', price: 12500, stock: 2},
      {_key: 'regular', name: 'Regular', sku: 'KG-R', price: null, stock: null},
    ],
  }]
  const plan = buildCheckoutPlan([
    {productId: 'drink', variantKey: 'large', qty: 2},
    {productId: 'drink', variantKey: 'regular', qty: 3},
  ], products)

  assert.equal(plan.calculatedTotal, 55000)
  assert.deepEqual(plan.verifiedItems.map(({sku, priceAtSale, qty, variantName}) => ({sku, priceAtSale, qty, variantName})), [
    {sku: 'KG-L', priceAtSale: 12500, qty: 2, variantName: 'Large'},
    {sku: 'KG-R', priceAtSale: 10000, qty: 3, variantName: 'Regular'},
  ])
  assert.deepEqual(plan.stockUpdates, [{
    productId: 'drink',
    revision: 'rev-1',
    parentQty: 3,
    variantQtys: [{variantKey: 'large', qty: 2}],
  }])
})

test('a non-variant single-SKU product still checks out with its product-level SKU, price, and stock', () => {
  const plan = buildCheckoutPlan(
    [{productId: 'cookie', variantKey: null, qty: 2}],
    [{_id: 'cookie', _rev: 'rev-cookie', name: 'Cookie', sku: 'CK-01', price: 5000, stock: 3}],
  )
  assert.equal(plan.calculatedTotal, 10000)
  assert.equal(plan.verifiedItems[0].sku, 'CK-01')
  assert.equal(plan.stockUpdates[0].parentQty, 2)
  assert.deepEqual(plan.stockUpdates[0].variantQtys, [])
})

test('checkout rejects missing/unknown variants and insufficient variant or shared parent stock', () => {
  const product = {
    _id: 'drink',
    name: 'Drink',
    price: 10000,
    stock: 3,
    variants: [
      {_key: 'a', name: 'A', sku: 'A', price: 10000, stock: 1},
      {_key: 'b', name: 'B', sku: 'B', price: null, stock: null},
    ],
  }
  assert.throws(() => buildCheckoutPlan([{productId: 'drink', variantKey: null, qty: 1}], [product]), (error) => error.statusCode === 400)
  assert.throws(() => buildCheckoutPlan([{productId: 'drink', variantKey: 'missing', qty: 1}], [product]), (error) => error.statusCode === 400)
  assert.throws(() => buildCheckoutPlan([{productId: 'drink', variantKey: 'a', qty: 2}], [product]), (error) => error.statusCode === 409)
  assert.throws(() => buildCheckoutPlan([{productId: 'drink', variantKey: 'b', qty: 4}], [product]), (error) => error.statusCode === 409)
})

test('checkout rejects missing product price or stock instead of treating null as zero', () => {
  const line = [{productId: 'missing-data', variantKey: null, qty: 1}]
  assert.throws(
    () => buildCheckoutPlan(line, [{_id: 'missing-data', name: 'Missing price', price: null, stock: 4}]),
    (error) => error.statusCode === 409,
  )
  assert.throws(
    () => buildCheckoutPlan(line, [{_id: 'missing-data', name: 'Missing stock', price: 4000, stock: null}]),
    (error) => error.statusCode === 409,
  )
})

test('cart keeps variant SKUs/prices/stocks on separate lines and keeps simple products valid', () => {
  setActivePinia(createPinia())
  const cart = useCartStore()
  const product = {id: 'coffee', name: 'Coffee', price: 10000, stock: 5, sku: 'COF', variants: []}
  const small = {id: 'small', name: 'Small', sku: 'COF-S', price: 10000, stock: 1}
  const large = {id: 'large', name: 'Large', sku: 'COF-L', price: 15000, stock: 3}

  cart.addItem(product, small)
  cart.addItem(product, small)
  cart.addItem(product, large)
  assert.equal(cart.items.length, 2)
  assert.equal(cart.items[0].qty, 1)
  assert.equal(cart.items[0].product.sku, 'COF-S')
  assert.equal(cart.items[0].product.price, 10000)
  assert.equal(cart.items[0].product.stock, 1)
  assert.equal(cart.total, 25000)

  cart.incrementQty('coffee', 'large')
  assert.equal(cart.items[1].qty, 2)
  cart.addItem(product)
  assert.equal(cart.items[2].product.variantKey, null)
  assert.equal(cart.items[2].product.sku, 'COF')
})
