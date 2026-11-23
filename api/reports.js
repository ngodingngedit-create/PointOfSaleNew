import { createServiceClient } from './_lib/database.js'
import { HttpError, methodNotAllowed, publicError, sendJson, validateSameOrigin } from './_lib/http.js'
import { fetchActiveCashierById, publicCashier } from './_lib/sanity.js'
import { aggregateSales, loadCompletedSales, resolveSalesRange } from './_lib/sales.js'
import { requireSession } from './_lib/sessions.js'

export async function getSalesReport(session, query, env = process.env) {
  const cashierDoc = await fetchActiveCashierById(session.id, env)
  const cashier = publicCashier(cashierDoc)
  if (!cashier?.branchId || !cashier.branchActive) throw new HttpError(409, 'Kasir belum ditautkan ke cabang aktif di Sanity Studio')

  const range = resolveSalesRange(query.from, query.to)
  const supabase = createServiceClient(env)
  const { transactions, truncated } = await loadCompletedSales(supabase, cashier.branchId, range)
  const aggregate = aggregateSales(transactions)
  const payments = new Map()
  for (const sale of transactions) {
    const method = sale.payment_method || 'unknown'
    const current = payments.get(method) || { method, amount: 0, transactions: 0 }
    current.amount += Number(sale.total_amount) || 0
    current.transactions += 1
    payments.set(method, current)
  }
  return {
    summary: {
      totalRevenue: aggregate.summary.sales,
      totalTransactions: aggregate.summary.transactionCount,
      averageOrderValue: aggregate.summary.averageTicket,
      itemsSold: aggregate.summary.itemsSold,
      currency: 'IDR',
    },
    daily: aggregate.dailySales.map((row) => ({ date: row.date, totalSales: row.sales, totalOrders: row.transactions })),
    topProducts: aggregate.topProducts.map((row) => ({
      productId: row.productId,
      productName: row.name,
      category: row.category,
      totalQty: row.qty,
      totalSales: row.revenue,
    })),
    paymentMethods: [...payments.values()],
    from: range.from,
    to: range.to,
    empty: transactions.length === 0,
    truncated,
  }
}

export default async function handler(req, res, env = process.env) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET')
  try {
    validateSameOrigin(req)
    const session = requireSession(req, env, 'cashier')
    const url = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`)
    const result = await getSalesReport(session, { from: url.searchParams.get('from'), to: url.searchParams.get('to') }, env)
    return sendJson(res, 200, result)
  } catch (error) {
    const { statusCode, message } = publicError(error, 'Laporan penjualan sementara tidak tersedia')
    return sendJson(res, statusCode, { error: message })
  }
}
