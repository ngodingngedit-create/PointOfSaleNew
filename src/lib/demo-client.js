// Mock query builder yang meniru supabase-js untuk demo mode.
// Mendukung: from().select/insert/update/delete + eq/gte/lte/in/order/limit/single
import { demoDb, makeErr, seedDemoTransactions } from './demo-data'

const uuid = () => crypto.randomUUID()

function resolveRows(table) {
  if (table === 'products') return [...demoDb.products]
  if (table === 'cafe_members') {
    return demoDb.user
      ? [{ id: uuid(), cafe_id: demoDb.cafe.id, user_id: demoDb.user.id, role: 'owner', cafes: { name: demoDb.cafe.name } }]
      : []
  }
  if (table === 'transactions') return [...demoDb.transactions]
  if (table === 'transaction_items') return [...demoDb.transactionItems]
  if (table === 'ai_insights') return [...demoDb.insights]
  if (table === 'daily_sales') {
    const byDate = {}
    for (const t of demoDb.transactions) {
      const d = t.created_at.slice(0, 10)
      if (!byDate[d]) byDate[d] = { cafe_id: demoDb.cafe.id, sale_date: d, transaction_count: 0, total_sales: 0 }
      byDate[d].transaction_count++
      byDate[d].total_sales += Number(t.total_amount)
    }
    return Object.values(byDate).sort((a, b) => a.sale_date.localeCompare(b.sale_date))
  }
  if (table === 'product_sales') {
    const byProduct = {}
    for (const ti of demoDb.transactionItems) {
      const p = demoDb.products.find((x) => x.id === ti.product_id)
      if (!p) continue
      if (!byProduct[p.id])
        byProduct[p.id] = { cafe_id: demoDb.cafe.id, product_id: p.id, product_name: p.name, category: p.category, total_qty: 0, total_revenue: 0 }
      byProduct[p.id].total_qty += ti.qty
      byProduct[p.id].total_revenue += ti.qty * Number(ti.price_at_sale)
    }
    return Object.values(byProduct)
  }
  return []
}

function runQuery(state) {
  let rows = resolveRows(state.table)

  for (const f of state.filters) {
    rows = rows.filter((r) => {
      if (f.op === 'eq') return r[f.col] === f.val
      if (f.op === 'gte') return String(r[f.col]).slice(0, 10) >= String(f.val).slice(0, 10)
      if (f.op === 'lte') return String(r[f.col]).slice(0, 10) <= String(f.val).slice(0, 10)
      if (f.op === 'in') return f.val.includes(r[f.col])
      return true
    })
  }

  if (state.order) {
    const { col, ascending } = state.order
    rows.sort((a, b) => {
      const av = a[col]
      const bv = b[col]
      const cmp =
        typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return ascending ? cmp : -cmp
    })
  }
  if (state.limit != null) rows = rows.slice(0, state.limit)

  if (state.action === 'insert') {
    const inserts = state.payload.map((p) => ({
      id: uuid(),
      cafe_id: demoDb.cafe.id,
      created_at: new Date().toISOString(),
      ...p,
    }))
    demoDb[state.table].push(...inserts)
    return { data: state.single ? inserts[0] : inserts, error: null }
  }
  if (state.action === 'update') {
    for (const r of rows) Object.assign(r, state.payload)
    return { data: state.single ? (rows[0] ?? null) : rows, error: null }
  }
  if (state.action === 'delete') {
    const ids = new Set(rows.map((r) => r.id))
    demoDb[state.table] = demoDb[state.table].filter((r) => !ids.has(r.id))
    return { data: null, error: null }
  }
  return { data: state.single ? (rows[0] ?? null) : rows, error: null }
}

function builder(state) {
  return {
    select: () => builder(state),
    insert: (payload) =>
      builder({ ...state, action: 'insert', payload: Array.isArray(payload) ? payload : [payload] }),
    update: (payload) => builder({ ...state, action: 'update', payload }),
    delete: () => builder({ ...state, action: 'delete' }),
    eq: (col, val) => builder({ ...state, filters: [...state.filters, { col, op: 'eq', val }] }),
    gte: (col, val) => builder({ ...state, filters: [...state.filters, { col, op: 'gte', val }] }),
    lte: (col, val) => builder({ ...state, filters: [...state.filters, { col, op: 'lte', val }] }),
    in: (col, val) => builder({ ...state, filters: [...state.filters, { col, op: 'in', val }] }),
    order: (col, opts) => builder({ ...state, order: { col, ascending: opts?.ascending !== false } }),
    limit: (n) => builder({ ...state, limit: n }),
    single: () => runQuery({ ...state, single: true }),
    then: (resolve, reject) => Promise.resolve(runQuery(state)).then(resolve, reject),
  }
}

export function createMockAuth() {
  const demoEmail = 'demo@kopisenja.com'
  return {
    getSession: async () => ({
      data: { session: demoDb.user ? { user: demoDb.user } : null },
    }),
    onAuthStateChange: (_cb) => ({ data: { subscription: { unsubscribe() {} } } }),
    signUp: async ({ email, options }) => {
      demoDb.user = { id: uuid(), email: email || demoEmail }
      if (options?.data?.cafe_name) demoDb.cafe.name = options.data.cafe_name
      return { data: { user: demoDb.user }, error: null }
    },
    signInWithPassword: async ({ email }) => {
      demoDb.user = { id: uuid(), email: email || demoEmail }
      return { data: { user: demoDb.user }, error: null }
    },
    signOut: async () => {
      demoDb.user = null
      return { error: null }
    },
    getUser: async () => ({ data: { user: demoDb.user }, error: null }),
  }
}

export function createMockDb() {
  return {
    from: (table) => builder({ table, filters: [], action: null, single: false }),
    rpc: async (fn, args) => {
      if (fn !== 'checkout') return { data: null, error: makeErr(`RPC "${fn}" tidak tersedia di demo mode`) }
      const { p_items, p_payment_method } = args
      if (!p_items?.length) return { data: null, error: makeErr('Keranjang kosong') }

      let total = 0
      for (const item of p_items) {
        const p = demoDb.products.find((x) => x.id === item.product_id)
        if (!p || !p.is_active) return { data: null, error: makeErr('Produk tidak ditemukan atau tidak aktif') }
        if (p.stock < item.qty) return { data: null, error: makeErr(`Stok tidak cukup untuk produk "${p.name}"`) }
        total += p.price * item.qty
      }

      const tx = {
        id: uuid(),
        cafe_id: demoDb.cafe.id,
        cashier_id: 'demo-user',
        total_amount: total,
        payment_method: p_payment_method,
        created_at: new Date().toISOString(),
      }
      demoDb.transactions.push(tx)
      for (const item of p_items) {
        const p = demoDb.products.find((x) => x.id === item.product_id)
        demoDb.transactionItems.push({
          id: uuid(),
          transaction_id: tx.id,
          product_id: p.id,
          qty: item.qty,
          price_at_sale: p.price,
        })
        p.stock -= item.qty
      }
      return { data: tx.id, error: null }
    },
  }
}

export function createMockFunctions() {
  return {
    invoke: async (name, { body }) => {
      if (name !== 'analyze-sales') return { data: null, error: makeErr('Function tidak dikenal') }
      seedDemoTransactions()
      await new Promise((r) => setTimeout(r, 1800))

      const start = body.start_date
      const end = body.end_date
      const inPeriod = demoDb.transactions.filter((t) => {
        const d = t.created_at.slice(0, 10)
        return d >= start && d <= end
      })
      const total = inPeriod.reduce((s, t) => s + Number(t.total_amount), 0)

      const perProduct = {}
      for (const ti of demoDb.transactionItems) {
        if (!inPeriod.some((t) => t.id === ti.transaction_id)) continue
        const p = demoDb.products.find((x) => x.id === ti.product_id)
        if (!p) continue
        if (!perProduct[p.id]) perProduct[p.id] = { product_name: p.name, qty: 0 }
        perProduct[p.id].qty += ti.qty
      }
      const sorted = Object.values(perProduct).sort((a, b) => b.qty - a.qty)

      const trends = sorted.slice(0, 5).map((p, i) => ({
        product_name: p.product_name,
        trend: i === 0 ? 'naik' : i === sorted.length - 1 && sorted.length > 2 ? 'turun' : 'stabil',
        note:
          i === 0
            ? `Produk terlaris periode ini dengan ${p.qty} unit terjual.`
            : i === sorted.length - 1 && sorted.length > 2
              ? 'Penjualan paling rendah, pertimbangkan promosi.'
              : `${p.qty} unit terjual, relatif stabil.`,
      }))

      const recommendations = [
        {
          type: 'restock',
          title: 'Restock produk stok menipis',
          detail: 'Beberapa produk punya stok ≤ 5. Segera lakukan pemesanan ke supplier sebelum weekend.',
        },
        {
          type: 'promosi',
          title: `Promosikan ${sorted.at(-1)?.product_name ?? 'produk slow-moving'}`,
          detail: 'Produk ini paling sedikit terjual. Coba bundling dengan produk terlaris atau diskon jam sepi.',
        },
        {
          type: 'bundling',
          title: 'Paket Kopi + Snack',
          detail: 'Kategori Kopi dan Snack saling melengkapi. Buat paket hemat untuk menaikkan nilai transaksi.',
        },
      ]

      const insight = {
        id: uuid(),
        cafe_id: demoDb.cafe.id,
        period_start: start,
        period_end: end,
        summary_text:
          `Periode ${start} s/d ${end} tercatat ${inPeriod.length} transaksi dengan total pendapatan Rp ${total.toLocaleString('id-ID')}. ` +
          `"${sorted[0]?.product_name ?? '-'}" menjadi produk terlaris. ` +
          `Pertahankan performa produk unggulan dan perbaiki produk yang menurun. (Catatan: ini demo mode — analisis AI asli butuh Supabase + GEMINI_API_KEY.)`,
        recommendations: { trends, recommendations },
        raw_stats: { total_transactions: inPeriod.length, total_revenue: total },
        created_at: new Date().toISOString(),
      }
      demoDb.insights.unshift(insight)
      return { data: { success: true, insight }, error: null }
    },
  }
}
