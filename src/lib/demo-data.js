// DEMO MODE: DB dummy di memori. Data hilang saat refresh.
// Dipakai kalau .env belum diisi, supaya UI bisa dipreview tanpa Supabase.

const uuid = () => crypto.randomUUID()

export const demoDb = {
  cafe: { id: uuid(), name: 'Kopi Senja (Demo)' },
  user: null,
  products: [
    { id: uuid(), cafe_id: null, name: 'Kopi Susu Gula Aren', category: 'Kopi', price: 18000, stock: 24, image_url: null, is_active: true },
    { id: uuid(), cafe_id: null, name: 'Americano', category: 'Kopi', price: 15000, stock: 30, image_url: null, is_active: true },
    { id: uuid(), cafe_id: null, name: 'Matcha Latte', category: 'Non-Kopi', price: 22000, stock: 4, image_url: null, is_active: true },
    { id: uuid(), cafe_id: null, name: 'Croissant Butter', category: 'Snack', price: 20000, stock: 8, image_url: null, is_active: true },
    { id: uuid(), cafe_id: null, name: 'Cireng Bumbu Rujak', category: 'Snack', price: 12000, stock: 2, image_url: null, is_active: true },
  ],
  transactions: [],
  transactionItems: [],
  insights: [],
}

export const makeErr = (message) => ({ message })

export function seedDemoTransactions() {
  if (demoDb.transactions.length > 0) return
  const methods = ['cash', 'qris']
  for (let day = 6; day >= 0; day--) {
    const n = 3 + Math.floor(Math.random() * 4)
    for (let i = 0; i < n; i++) {
      const created = new Date()
      created.setDate(created.getDate() - day)
      created.setHours(9 + Math.floor(Math.random() * 12))
      const tx = {
        id: uuid(),
        cafe_id: demoDb.cafe.id,
        cashier_id: 'demo-user',
        total_amount: 0,
        payment_method: methods[Math.floor(Math.random() * 2)],
        created_at: created.toISOString(),
      }
      const itemCount = 1 + Math.floor(Math.random() * 3)
      for (let j = 0; j < itemCount; j++) {
        const p = demoDb.products[Math.floor(Math.random() * demoDb.products.length)]
        const qty = 1 + Math.floor(Math.random() * 2)
        tx.total_amount += p.price * qty
        demoDb.transactionItems.push({
          id: uuid(),
          transaction_id: tx.id,
          product_id: p.id,
          qty,
          price_at_sale: p.price,
        })
      }
      demoDb.transactions.push(tx)
    }
  }
}
