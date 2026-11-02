import { createClient } from '@sanity/client'
import crypto from 'node:crypto'

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

  // Agregasi kuantitas yang diminta jika terdapat ID produk duplikat dalam payload
  const requestedMap = new Map()
  for (const item of items) {
    const pId = item?.productId || item?.product_id || item?.id
    const qty = Number(item?.qty)
    if (!pId || !Number.isInteger(qty) || qty <= 0) {
      const err = new Error('Format item pesanan tidak valid')
      err.statusCode = 400
      throw err
    }
    requestedMap.set(pId, (requestedMap.get(pId) || 0) + qty)
  }

  const productIds = Array.from(requestedMap.keys())

  // Ambil ulang snapshot harga dan stok terkini secara real-time dari Sanity
  const query = `*[_type == "product" && _id in $productIds]{
    _id,
    name,
    category,
    price,
    stock,
    isActive
  }`
  const dbProducts = await serverClient.fetch(query, { productIds })
  const dbProductMap = new Map(dbProducts.map((p) => [p._id, p]))

  // Validasi: pastikan semua produk ada, berstatus aktif, dan stok mencukupi
  const verifiedItems = []
  let calculatedTotal = 0

  for (const [productId, requestedQty] of requestedMap.entries()) {
    const product = dbProductMap.get(productId)
    if (!product) {
      const err = new Error(`Produk dengan ID ${productId} tidak ditemukan`)
      err.statusCode = 404
      throw err
    }

    if (product.isActive === false) {
      const err = new Error(`Produk "${product.name}" sedang nonaktif dan tidak dapat dibeli`)
      err.statusCode = 400
      throw err
    }

    if (product.stock < requestedQty) {
      const err = new Error(
        `Stok tidak mencukupi untuk "${product.name}". Tersedia: ${product.stock}, diminta: ${requestedQty}`
      )
      err.statusCode = 409
      throw err
    }

    const price = Number(product.price) || 0
    calculatedTotal += price * requestedQty

    verifiedItems.push({
      productId: product._id,
      productName: product.name,
      category: product.category || 'Reguler',
      priceAtSale: price,
      qty: requestedQty,
      subtotal: price * requestedQty,
    })
  }

  // Eksekusi mutasi decrement stok secara atomik melalui Sanity transaction
  let mutation = serverClient.transaction()
  for (const [productId, requestedQty] of requestedMap.entries()) {
    mutation = mutation.patch(productId, (patch) => patch.dec({ stock: requestedQty }))
  }

  const mutationResult = await mutation.commit()

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

export default async function handler(req, res) {
  // Hanya menerima metode POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const result = await processCheckout(req.body, process.env)
    return res.status(200).json(result)
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      error: error.message || 'Terjadi kesalahan internal pada server',
    })
  }
}
