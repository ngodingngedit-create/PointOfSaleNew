import { HttpError } from './http.js'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const PAGE_SIZE = 1000
const MAX_TRANSACTIONS = 20000

function isRealDate(value) {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function jakartaDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export function resolveSalesRange(from, to, {maxDays = 366, defaultDays = 1, now = new Date()} = {}) {
  const today = jakartaDateString(now)
  const endDate = to || today
  let startDate = from
  if (!startDate) {
    const [year, month, day] = endDate.split('-').map(Number)
    startDate = new Date(Date.UTC(year, month - 1, day - (defaultDays - 1))).toISOString().slice(0, 10)
  }
  if (!isRealDate(startDate) || !isRealDate(endDate) || startDate > endDate) {
    throw new HttpError(400, 'Rentang tanggal laporan tidak valid')
  }
  const start = new Date(`${startDate}T00:00:00+07:00`)
  const exclusiveEnd = new Date(new Date(`${endDate}T00:00:00+07:00`).getTime() + 86400000)
  const days = Math.round((exclusiveEnd - start) / 86400000)
  if (days > maxDays) throw new HttpError(400, `Rentang laporan maksimal ${maxDays} hari`)
  return { from: startDate, to: endDate, startIso: start.toISOString(), endExclusiveIso: exclusiveEnd.toISOString() }
}

export async function loadCompletedSales(supabase, branchId, range) {
  if (!branchId) throw new HttpError(409, 'Kasir belum ditautkan ke cabang aktif')
  const rows = []
  let truncated = false
  for (let offset = 0; offset < MAX_TRANSACTIONS; offset += PAGE_SIZE) {
    const end = Math.min(offset + PAGE_SIZE - 1, MAX_TRANSACTIONS - 1)
    const { data, error } = await supabase
      .from('pos_transactions')
      .select('id,branch_id,order_type,table_label,payment_method,total_amount,completed_at,items:pos_transaction_items(product_id,variant_key,product_name,category,sku,variant_name,price_at_sale,qty,subtotal)')
      .eq('status', 'completed')
      .eq('branch_id', branchId)
      .gte('completed_at', range.startIso)
      .lt('completed_at', range.endExclusiveIso)
      .order('completed_at', { ascending: true })
      .range(offset, end)
    if (error) throw new HttpError(503, 'Laporan penjualan sementara tidak tersedia')
    rows.push(...(data || []))
    if (!data || data.length < PAGE_SIZE) break
    if (offset + PAGE_SIZE >= MAX_TRANSACTIONS) truncated = true
  }
  return { transactions: rows, truncated }
}

export function aggregateSales(transactions) {
  const products = new Map()
  const days = new Map()
  let totalSales = 0
  let itemsSold = 0

  for (const sale of transactions) {
    const amount = Number(sale.total_amount) || 0
    totalSales += amount
    const day = jakartaDateString(new Date(sale.completed_at))
    const daily = days.get(day) || { date: day, transactions: 0, sales: 0 }
    daily.transactions += 1
    daily.sales += amount
    days.set(day, daily)

    for (const item of sale.items || []) {
      const qty = Number(item.qty) || 0
      const subtotal = Number(item.subtotal) || 0
      itemsSold += qty
      const key = `${item.product_id}:${item.variant_key || ''}`
      const product = products.get(key) || {
        productId: item.product_id,
        variantKey: item.variant_key || null,
        name: item.variant_name ? `${item.product_name} — ${item.variant_name}` : item.product_name,
        category: item.category || '',
        sku: item.sku || null,
        qty: 0,
        revenue: 0,
      }
      product.qty += qty
      product.revenue += subtotal
      products.set(key, product)
    }
  }

  const transactionCount = transactions.length
  return {
    summary: {
      transactionCount,
      sales: totalSales,
      itemsSold,
      averageTicket: transactionCount ? Math.round(totalSales / transactionCount) : 0,
      currency: 'IDR',
    },
    dailySales: [...days.values()].sort((a, b) => a.date.localeCompare(b.date)),
    topProducts: [...products.values()].sort((a, b) => b.qty - a.qty || b.revenue - a.revenue).slice(0, 20),
  }
}
