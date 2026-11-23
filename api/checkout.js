import { createClient } from '@sanity/client'
import { createHash, createHmac } from 'node:crypto'
import { createServiceClient } from './_lib/database.js'
import { HttpError, methodNotAllowed, publicError, sendJson, validateSameOrigin } from './_lib/http.js'
import { buildCheckoutPlan, parseCheckoutItems } from './_lib/checkout-plan.js'
import { fetchActiveCashierById, fetchActiveTableForBranch, publicCashier } from './_lib/sanity.js'
import { requireSession } from './_lib/sessions.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function outcomeUnknown(message) {
  const error = new HttpError(503, message)
  error.outcomeUnknown = true
  return error
}

function createSanityEditor(env) {
  const token = env.SANITY_API_TOKEN
  if (!token) throw new HttpError(503, 'Checkout server configuration is incomplete')
  return createClient({
    projectId: env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID || 'aejzrj0n',
    dataset: env.SANITY_DATASET || env.VITE_SANITY_DATASET || 'production',
    apiVersion: env.SANITY_API_VERSION || '2025-02-06',
    token,
    useCdn: false,
  })
}

function markerIdFor(transactionId, env) {
  const secret = env.POS_SESSION_SECRET
  if (typeof secret !== 'string' || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new HttpError(503, 'Secure checkout is not configured')
  }
  const digest = createHmac('sha256', secret).update(`sanity-stock-marker:${transactionId}`).digest('hex').slice(0, 48)
  return `posCheckout-${digest}`
}

function salesIntentHash({ lines, paymentMethod, memberId, orderType, tableId, branchId, cashierId }) {
  const normalizedLines = [...lines]
    .map(({ productId, variantKey, qty }) => ({ productId, variantKey: variantKey || null, qty }))
    .sort((a, b) => `${a.productId}:${a.variantKey || ''}`.localeCompare(`${b.productId}:${b.variantKey || ''}`))
  const intent = JSON.stringify({ lines: normalizedLines, paymentMethod, memberId, orderType, tableId, branchId, cashierId })
  return createHash('sha256').update(intent).digest('hex')
}

function publicTransaction(row, items) {
  return {
    transactionId: row.id,
    createdAt: row.completed_at || row.created_at,
    paymentMethod: row.payment_method,
    totalAmount: Number(row.total_amount),
    branchId: row.branch_id,
    orderType: row.order_type,
    tableLabel: row.table_label,
    memberId: row.member_id,
    items: items.map((item) => ({
      productId: item.product_id,
      ...(item.variant_key ? { variantKey: item.variant_key } : {}),
      ...(item.variant_name ? { variantName: item.variant_name } : {}),
      ...(item.sku ? { sku: item.sku } : {}),
      productName: item.product_name,
      category: item.category || '',
      priceAtSale: Number(item.price_at_sale),
      qty: Number(item.qty),
      subtotal: Number(item.subtotal),
    })),
    status: 'success',
  }
}

async function readTransaction(supabase, transactionId) {
  const [{ data: sale, error: saleError }, { data: items, error: itemError }] = await Promise.all([
    supabase.from('pos_transactions')
      .select('id,branch_id,member_id,order_type,table_label,payment_method,total_amount,status,created_at,completed_at')
      .eq('id', transactionId).maybeSingle(),
    supabase.from('pos_transaction_items')
      .select('product_id,variant_key,product_name,category,sku,variant_name,price_at_sale,qty,subtotal')
      .eq('transaction_id', transactionId).order('id', { ascending: true }),
  ])
  if (saleError || itemError || !sale) throw new HttpError(503, 'Data transaksi belum dapat diverifikasi')
  return { sale, items: items || [] }
}

async function completeSale(supabase, transactionId) {
  const { error } = await supabase.rpc('pos_complete_checkout', { p_transaction_id: transactionId })
  if (error) throw outcomeUnknown('Transaksi tersimpan dan sedang menunggu verifikasi akhir')
  try {
    const { sale, items } = await readTransaction(supabase, transactionId)
    return publicTransaction(sale, items)
  } catch {
    throw outcomeUnknown('Transaksi tersimpan dan sedang menunggu verifikasi akhir')
  }
}

async function hasStockMarker(sanityClient, transactionId, env) {
  const markerId = markerIdFor(transactionId, env)
  const result = await sanityClient.fetch('*[_id == $markerId][0]._id', { markerId })
  return Boolean(result)
}

function assertIntegerMoney(items, total) {
  if (!Number.isSafeInteger(total) || total < 0 || items.some((item) =>
    !Number.isSafeInteger(item.priceAtSale) || !Number.isSafeInteger(item.subtotal) || item.priceAtSale < 0 || item.subtotal < 0
  )) {
    throw new HttpError(409, 'Harga produk harus berupa rupiah bulat yang valid')
  }
}

async function returnExistingSale(supabase, sanityClient, existing, requestHash, env) {
  if (existing.request_hash !== requestHash) {
    throw new HttpError(409, 'Kunci checkout sudah digunakan untuk pesanan berbeda')
  }
  if (existing.status === 'failed') throw new HttpError(409, 'Checkout sebelumnya gagal; buat checkout baru setelah memeriksa pesanan')
  if (existing.status === 'pending') {
    let markerExists
    try { markerExists = await hasStockMarker(sanityClient, existing.id, env) } catch {
      throw outcomeUnknown('Status checkout sebelumnya belum dapat diverifikasi. Jangan kirim pembayaran ulang.')
    }
    if (!markerExists) throw outcomeUnknown('Checkout sebelumnya masih diverifikasi. Jangan kirim pembayaran ulang; hubungi supervisor bila status tidak berubah.')
    return completeSale(supabase, existing.id)
  }
  const { sale, items } = await readTransaction(supabase, existing.id)
  return publicTransaction(sale, items)
}

export async function processCheckout(body, env = process.env, session) {
  const { items, paymentMethod, idempotencyKey } = body || {}
  if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, 'Keranjang belanja kosong')
  if (items.length > 100) throw new HttpError(400, 'Jumlah baris pesanan terlalu banyak')
  if (!['cash', 'qris'].includes(paymentMethod)) throw new HttpError(400, 'Metode pembayaran harus cash atau QRIS')
  if (typeof idempotencyKey !== 'string' || !UUID_PATTERN.test(idempotencyKey)) {
    throw new HttpError(400, 'Kunci checkout tidak valid')
  }
  if (!session?.id) throw new HttpError(401, 'Authentication required')

  const orderType = body.orderType === 'dine_in' ? 'dine_in' : body.orderType === 'take_away' || !body.orderType ? 'take_away' : null
  if (!orderType) throw new HttpError(400, 'Jenis pesanan tidak valid')
  const tableId = typeof body.tableId === 'string' && body.tableId ? body.tableId : null
  if (orderType === 'dine_in' && !tableId) throw new HttpError(400, 'Pilih meja yang aktif')
  if (orderType === 'take_away' && tableId) throw new HttpError(400, 'Pesanan bawa pulang tidak menggunakan meja')

  const cashierDoc = await fetchActiveCashierById(session.id, env)
  const cashier = publicCashier(cashierDoc)
  if (!cashier || !cashier.branchId || !cashier.branchActive) {
    throw new HttpError(409, 'Kasir belum ditautkan ke cabang aktif di Sanity Studio')
  }

  let table = null
  if (orderType === 'dine_in') {
    table = await fetchActiveTableForBranch(tableId, cashier.branchId, env)
    if (!table) throw new HttpError(400, 'Meja tidak aktif atau bukan milik cabang kasir')
  }

  const memberId = body.memberId == null || body.memberId === '' ? null : body.memberId
  if (memberId && (typeof memberId !== 'string' || !UUID_PATTERN.test(memberId))) {
    throw new HttpError(400, 'Member yang dipilih tidak valid')
  }
  const requestedLines = parseCheckoutItems(items)
  const hash = salesIntentHash({
    lines: requestedLines,
    paymentMethod,
    memberId,
    orderType,
    tableId,
    branchId: cashier.branchId,
    cashierId: cashier.id,
  })
  const supabase = createServiceClient(env)
  const sanityClient = createSanityEditor(env)

  const { data: existing, error: existingError } = await supabase
    .from('pos_transactions')
    .select('id,request_hash,status')
    .eq('idempotency_key', idempotencyKey)
    .maybeSingle()
  if (existingError) throw new HttpError(503, 'Penyimpanan transaksi belum tersedia')
  if (existing) return returnExistingSale(supabase, sanityClient, existing, hash, env)

  if (memberId) {
    const { data: member, error: memberError } = await supabase
      .from('pos_members').select('id').eq('id', memberId).maybeSingle()
    if (memberError) throw new HttpError(503, 'Data Member sementara tidak tersedia')
    if (!member) throw new HttpError(400, 'Member yang dipilih tidak ditemukan')
  }

  const productIds = [...new Set(requestedLines.map((line) => line.productId))]
  let dbProducts
  try {
    dbProducts = await sanityClient.fetch(
      `*[_type == "product" && _id in $productIds]{_id,_rev,name,category,sku,price,stock,isActive,variants[]{_key,name,sku,price,stock}}`,
      { productIds },
    )
  } catch {
    throw new HttpError(503, 'Data harga dan stok produk tidak tersedia')
  }
  const { verifiedItems, calculatedTotal, stockUpdates } = buildCheckoutPlan(requestedLines, dbProducts)
  assertIntegerMoney(verifiedItems, calculatedTotal)

  const { data: rpcRows, error: beginError } = await supabase.rpc('pos_begin_checkout', {
    p_idempotency_key: idempotencyKey,
    p_request_hash: hash,
    p_branch_id: cashier.branchId,
    p_cashier_id: cashier.id,
    p_cashier_name: cashier.name,
    p_member_id: memberId,
    p_order_type: orderType,
    p_table_id: table?._id || null,
    p_table_label: table?.name || null,
    p_payment_method: paymentMethod,
    p_subtotal: calculatedTotal,
    p_items: verifiedItems.map((item) => ({
      productId: item.productId,
      variantKey: item.variantKey || null,
      productName: item.productName,
      category: item.category || null,
      sku: item.sku || null,
      variantName: item.variantName || null,
      priceAtSale: item.priceAtSale,
      qty: item.qty,
      subtotal: item.subtotal,
    })),
  })
  if (beginError) throw new HttpError(503, 'Transaksi tidak dapat disiapkan di database')
  const started = Array.isArray(rpcRows) ? rpcRows[0] : rpcRows
  if (!started?.transaction_id) throw new HttpError(503, 'Transaksi tidak dapat disiapkan di database')
  if (!started.created_new) return returnExistingSale(supabase, sanityClient, { id: started.transaction_id, request_hash: hash, status: started.transaction_status }, hash, env)

  const markerId = markerIdFor(started.transaction_id, env)
  try {
    let mutation = sanityClient.transaction()
    for (const update of stockUpdates) {
      mutation = mutation.patch(update.productId, (patch) => {
        if (update.parentQty > 0) patch.dec({ stock: update.parentQty })
        for (const variantUpdate of update.variantQtys) {
          patch.dec({ [`variants[_key=="${variantUpdate.variantKey}"].stock`]: variantUpdate.qty })
        }
        if (update.revision) patch.ifRevisionId(update.revision)
        return patch
      })
    }
    mutation = mutation.createIfNotExists({
      _id: markerId,
      _type: 'posCheckoutMarker',
      createdAt: new Date().toISOString(),
    })
    await mutation.commit()
  } catch (error) {
    let markerExists
    try { markerExists = await hasStockMarker(sanityClient, started.transaction_id, env) } catch {
      throw outcomeUnknown('Checkout belum dapat diverifikasi. Jangan kirim pembayaran ulang; cek status pesanan terlebih dahulu.')
    }
    if (markerExists) return completeSale(supabase, started.transaction_id)

    if ([409, 412].includes(Number(error?.statusCode))) {
      const { error: failError } = await supabase.rpc('pos_fail_checkout', { p_transaction_id: started.transaction_id })
      if (failError) throw new HttpError(503, 'Stok berubah saat checkout; pesanan perlu diperiksa supervisor')
      throw new HttpError(409, 'Stok berubah saat checkout. Muat ulang keranjang sebelum mencoba lagi.')
    }
    throw outcomeUnknown('Checkout belum dapat diverifikasi. Jangan kirim pembayaran ulang; cek status pesanan terlebih dahulu.')
  }

  return completeSale(supabase, started.transaction_id)
}

export default async function handler(req, res, env = process.env) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST')
  try {
    validateSameOrigin(req)
    const session = requireSession(req, env, 'cashier')
    return sendJson(res, 200, await processCheckout(req.body, env, session))
  } catch (error) {
    const { statusCode, message } = publicError(error, 'Checkout sementara tidak tersedia')
    return sendJson(res, statusCode, { error: message, ...(error?.outcomeUnknown ? { outcomeUnknown: true } : {}) })
  }
}
