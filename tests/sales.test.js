import assert from 'node:assert/strict'
import { test } from 'node:test'
import { aggregateSales, jakartaDateString, resolveSalesRange } from '../api/_lib/sales.js'
import { normalizeMemberPhone } from '../api/_lib/members.js'

test('sales date windows use inclusive calendar dates in Asia/Jakarta', () => {
  const range = resolveSalesRange('2026-11-23', '2026-11-23')
  assert.equal(range.from, '2026-11-23')
  assert.equal(range.to, '2026-11-23')
  assert.equal(range.startIso, '2026-11-22T17:00:00.000Z')
  assert.equal(range.endExclusiveIso, '2026-11-23T17:00:00.000Z')
  assert.throws(() => resolveSalesRange('2026-02-30', '2026-03-01'), /Rentang tanggal laporan tidak valid/)
  assert.throws(() => resolveSalesRange('2026-11-01', '2026-11-02', { maxDays: 1 }), /maksimal 1 hari/)
})

test('sales range defaults to requested number of local calendar days', () => {
  const range = resolveSalesRange(undefined, undefined, {
    defaultDays: 30,
    now: new Date('2026-11-23T10:00:00.000Z'),
  })
  assert.equal(range.to, '2026-11-23')
  assert.equal((Date.parse(range.endExclusiveIso) - Date.parse(range.startIso)) / 86400000, 30)
})

test('report aggregates only persisted sales facts and leaves out member identity', () => {
  const transactions = [
    {
      id: 'sale-1',
      total_amount: 50000,
      completed_at: '2026-11-22T18:00:00.000Z',
      items: [
        { product_id: 'menu-1', product_name: 'Kopi Susu', variant_key: null, qty: 2, subtotal: 50000, sku: 'KOPI-1' },
      ],
    },
    {
      id: 'sale-2',
      total_amount: 30000,
      completed_at: '2026-11-23T02:00:00.000Z',
      items: [
        { product_id: 'menu-1', product_name: 'Kopi Susu', variant_key: null, qty: 1, subtotal: 30000, sku: 'KOPI-1' },
      ],
    },
  ]
  const result = aggregateSales(transactions)
  assert.deepEqual(result.summary, {
    transactionCount: 2,
    sales: 80000,
    itemsSold: 3,
    averageTicket: 40000,
    currency: 'IDR',
  })
  assert.equal(result.dailySales.length, 1)
  assert.deepEqual(result.dailySales[0], { date: '2026-11-23', transactions: 2, sales: 80000 })
  assert.equal(result.topProducts[0].qty, 3)
  assert.equal(JSON.stringify(result).includes('phone'), false)
  assert.equal(jakartaDateString(new Date('2026-11-22T18:00:00.000Z')), '2026-11-23')
})

test('Member phone inputs normalize to E.164 while invalid numbers are rejected', () => {
  assert.equal(normalizeMemberPhone('0812 3456-7890'), '+6281234567890')
  assert.equal(normalizeMemberPhone('81234567890'), '+6281234567890')
  assert.equal(normalizeMemberPhone('+6281234567890'), '+6281234567890')
  assert.equal(normalizeMemberPhone('abc'), null)
  assert.equal(normalizeMemberPhone('123'), null)
})
