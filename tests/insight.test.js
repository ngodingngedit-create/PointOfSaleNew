import assert from 'node:assert/strict'
import { test } from 'node:test'
import { generateSalesInsight, insightErrorResponse } from '../api/insight.js'
import { loadCompletedSales, resolveSalesRange } from '../api/_lib/sales.js'

// These fixtures exist only in isolated unit tests, never in the application or database.
const session = { id: 'cashier-1', role: 'cashier' }
const env = { POS_SESSION_SECRET: 'x'.repeat(40), TOKEN_HARBOR_POS_API_KEY: 'test-key' }
const cashier = { _id: session.id, name: 'Cashier', branch: { _id: 'branch-1', isActive: true } }
const request = { question: 'Ringkasan penjualan periode ini', from: '2026-11-23', to: '2026-11-23' }
const sales = [
  { id: '1', cashier_name: 'PRIVATE CASHIER', member_id: 'PRIVATE MEMBER', total_amount: 25000, completed_at: '2026-11-23T01:00:00Z', items: [{ product_id: 'p1', product_name: 'Kopi', qty: 1, subtotal: 25000 }] },
  { id: '2', total_amount: 35000, completed_at: '2026-11-23T03:00:00Z', items: [{ product_id: 'p2', product_name: 'Roti', qty: 1, subtotal: 35000 }] },
]
function deps(overrides = {}) {
  return {
    fetchActiveCashierById: async () => cashier,
    createServiceClient: () => ({}),
    enforceRateLimits: async () => {},
    loadCompletedSales: async () => ({ transactions: sales, truncated: false }),
    fetch: async () => new Response(JSON.stringify({ choices: [{ message: { content: 'Ringkasan dari data transaksi.' } }] }), { status: 200 }),
    ...overrides,
  }
}

async function errorFor(fn) {
  try { await fn(); assert.fail('expected an error') } catch (error) { return insightErrorResponse(error) }
}

test('AI receives only the selected branch, period, aggregates and the pinned free model', async () => {
  let sent
  let branch
  let range
  const result = await generateSalesInsight(request, session, env, deps({
    loadCompletedSales: async (_db, branchId, selectedRange) => {
      branch = branchId
      range = selectedRange
      return { transactions: sales, truncated: false }
    },
    fetch: async (url, options) => {
      assert.equal(url, 'https://tokenharbor.ai/v1/chat/completions')
      sent = JSON.parse(options.body)
      return new Response(JSON.stringify({ choices: [{ message: { content: 'Ringkasan dari data transaksi.' } }] }), { status: 200 })
    },
  }))
  assert.equal(branch, 'branch-1')
  assert.equal(range.startIso, '2026-11-22T17:00:00.000Z')
  assert.equal(range.endExclusiveIso, '2026-11-23T17:00:00.000Z')
  assert.equal(sent.model, 'mimo-v2.6-flash:free')
  const content = JSON.parse(sent.messages[1].content)
  assert.deepEqual(content.periode, { from: request.from, to: request.to })
  assert.equal(content.dataPenjualan.summary.sales, 60000)
  assert.equal(content.dataPenjualan.summary.transactionCount, 2)
  assert.equal(content.dataPenjualan.topProducts.length, 2)
  assert.doesNotMatch(JSON.stringify(sent), /PRIVATE CASHIER|PRIVATE MEMBER/)
  assert.equal(result.answer, 'Ringkasan dari data transaksi.')
  assert.equal(result.model, 'mimo-v2.6-flash:free')
})

test('no sales returns a clear empty state without calling a model or requiring a key', async () => {
  let called = false
  const result = await generateSalesInsight(request, session, { POS_SESSION_SECRET: env.POS_SESSION_SECRET }, deps({
    loadCompletedSales: async () => ({ transactions: [], truncated: false }),
    fetch: async () => { called = true; throw new Error('must not call') },
  }))
  assert.equal(result.empty, true)
  assert.match(result.message, /Belum ada transaksi/)
  assert.equal(called, false)
})

test('missing, unavailable or truncated data never generates a synthetic answer', async () => {
  let calls = 0
  const neverCall = async () => { calls++; throw new Error('must not call') }
  for (const load of [
    async () => ({ transactions: undefined, truncated: false }),
    async () => ({ transactions: [], truncated: true }),
    async () => { throw new Error('private database failure') },
  ]) {
    const response = await errorFor(() => generateSalesInsight(request, session, env, deps({ loadCompletedSales: load, fetch: neverCall })))
    assert.ok(response.statusCode >= 400)
    assert.doesNotMatch(JSON.stringify(response), /private database failure/)
  }
  assert.equal(calls, 0)
})

test('missing key and provider access, consent, rate and network failures have safe useful errors without fallback', async () => {
  const noKey = await errorFor(() => generateSalesInsight(request, session, { POS_SESSION_SECRET: env.POS_SESSION_SECRET }, deps()))
  assert.equal(noKey.body.code, 'ai_not_configured')
  for (const [status, payload, expected] of [
    [403, { error: { code: 'free_models_disabled', message: 'private detail' } }, 'ai_consent_required'],
    [401, { error: { message: 'private detail' } }, 'ai_access_denied'],
    [429, { error: { message: 'private detail' } }, 'ai_busy'],
    [500, { error: { message: 'private detail' } }, 'ai_unavailable'],
  ]) {
    let calls = 0
    const result = await errorFor(() => generateSalesInsight(request, session, env, deps({ fetch: async () => {
      calls++
      return new Response(JSON.stringify(payload), { status })
    } })))
    assert.equal(result.body.code, expected)
    assert.doesNotMatch(JSON.stringify(result), /private detail|test-key/)
    assert.equal(calls, 1)
  }
  const network = await errorFor(() => generateSalesInsight(request, session, env, deps({ fetch: async () => { throw new Error('secret detail') } })))
  assert.equal(network.body.code, 'ai_unreachable')
  assert.doesNotMatch(JSON.stringify(network), /secret detail/)
})

test('malformed, blank, or unavailable AI answers remain errors rather than mock insight', async () => {
  for (const [body, code] of [['not-json', 'ai_invalid_response'], [JSON.stringify({ choices: [{ message: { content: '' } }] }), 'ai_empty_response']]) {
    const result = await errorFor(() => generateSalesInsight(request, session, env, deps({ fetch: async () => new Response(body, { status: 200 }) })))
    assert.equal(result.body.code, code)
  }
})

test('invalid periods and unsupported or personal questions are rejected before any model call', async () => {
  assert.throws(() => resolveSalesRange(undefined, 'not-a-date'), /Rentang tanggal laporan tidak valid/)
  for (const body of [
    { ...request, from: '2026-02-30' },
    { ...request, from: '2026-01-01', to: '2026-05-01' },
    { ...request, question: 'Berikan nomor pelanggan dan penjualan' },
    { ...request, question: 'Ceritakan resep kopi' },
  ]) {
    let called = false
    const result = await errorFor(() => generateSalesInsight(body, session, env, deps({ fetch: async () => { called = true } })))
    assert.equal(result.statusCode, 400)
    assert.equal(called, false)
  }
})

test('a null database response is an error, not an empty sales period', async () => {
  const builder = { select() { return this }, eq() { return this }, gte() { return this }, lt() { return this }, order() { return this }, async range() { return { data: null, error: null } } }
  const db = { from() { return builder } }
  await assert.rejects(loadCompletedSales(db, 'branch-1', resolveSalesRange('2026-11-23', '2026-11-23')), /sementara tidak tersedia/)
})
