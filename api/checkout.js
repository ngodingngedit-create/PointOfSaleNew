import { createClient } from '@sanity/client'
import crypto from 'node:crypto'
import { requireSession } from './_lib/sessions.js'
import { methodNotAllowed, publicError, sendJson, validateSameOrigin } from './_lib/http.js'
import { buildCheckoutPlan, parseCheckoutItems } from './_lib/checkout-plan.js'

// Memory cache untuk idempotency key guna mencegah request dobel / replay attack
const processedTransactions = new Map()

export async function processCheckout(body, env = process.env) {
  const { items, paymentMethod, idempotencyKey } = body || {}

  if (!items || !Array.isArray(items) || items.length === 0) {
    const err = new Error('Keranjang belanja kosong')
    err.statusCode = 400
    throw err
  }

  if (!paymentMethod || !['cash', 'qris'].includes(paymentMethod)) {
    const err = new Error('Metode pembayaran harus cash atau qris')
    err.statusCode = 400
    throw err
  }

  // Cek idempotency key
  if (idempotencyKey) {
    if (processedTransactions.has(idempotencyKey)) {
      return processedTransactions.get(idempotencyKey)
    }
  }

  const projectId = env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID || 'aejzrj0n'
  const dataset = env.SANITY_DATASET || env.VITE_SANITY_DATASET || 'production'
  const apiVersion = env.SANITY_API_VERSION || '2025-02-06'
  const token = env.SANITY_API_TOKEN

  if (!token) {
    const err = new Error('SANITY_API_TOKEN belum dikonfigurasi di server environment')
    err.statusCode = 500
    throw err
  }

  // Client server-side dengan Editor Token untuk read & write mutasi atomik
  const serverClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  })

  const requestedLines = parseCheckoutItems(items)
  const productIds = [...new Set(requestedLines.map((line) => line.productId))]

  // Ambil ulang snapshot harga dan stok terkini secara real-time dari Sanity
  const query = `*[_type == "product" && _id in $productIds]{
    _id,
    _rev,
    name,
    category,
    sku,
    price,
    stock,
    isActive,
    variants[]{_key,name,sku,price,stock}
  }`
  const dbProducts = await serverClient.fetch(query, { productIds })
  const {verifiedItems, calculatedTotal, stockUpdates} = buildCheckoutPlan(requestedLines, dbProducts)

  // Eksekusi mutasi decrement stok secara atomik melalui Sanity transaction
  let mutation = serverClient.transaction()
  for (const update of stockUpdates) {
    mutation = mutation.patch(update.productId, (patch) => {
      if (update.parentQty > 0) patch.dec({stock: update.parentQty})
      for (const variantUpdate of update.variantQtys) {
        patch.dec({[`variants[_key=="${variantUpdate.variantKey}"].stock`]: variantUpdate.qty})
      }
      if (update.revision) patch.ifRevisionId(update.revision)
      return patch
    })
  }

  await mutation.commit()

  const transactionRecord = {
    transactionId: `TX-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
    createdAt: new Date().toISOString(),
    paymentMethod,
    totalAmount: calculatedTotal,
    items: verifiedItems,
    status: 'success',
  }

  // Simpan ke memory idempotency cache (TTL ringkas)
  if (idempotencyKey) {
    processedTransactions.set(idempotencyKey, transactionRecord)
    if (processedTransactions.size > 1000) {
      const oldestKey = processedTransactions.keys().next().value
      processedTransactions.delete(oldestKey)
    }
  }

  return transactionRecord
}

export default async function handler(req, res, env = process.env) {
  // Hanya menerima metode POST
  if (req.method !== 'POST') {
    return methodNotAllowed(res, 'POST')
  }

  try {
    validateSameOrigin(req)
    requireSession(req, env, 'cashier')
    const result = await processCheckout(req.body, env)
    return sendJson(res, 200, result)
  } catch (error) {
    const { statusCode, message } = publicError(error, 'Checkout is temporarily unavailable')
    return sendJson(res, statusCode, { error: message })
  }
}
