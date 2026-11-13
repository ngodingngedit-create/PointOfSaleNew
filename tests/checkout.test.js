import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { hashPin, verifyPin, hashAdminPassword, verifyAdminPassword } from '../api/_lib/passwords.js'
import { createSessionToken, verifySessionToken } from '../api/_lib/sessions.js'
import { setCashierPin, verifyCashierPin } from '../api/login-pin.js'
import loginPinHandler from '../api/login-pin.js'
import adminPinHandler from '../api/admin/cashier-pins.js'
import checkoutHandler from '../api/checkout.js'

const TEST_SECRET = 'unit-test-session-secret-value-at-least-32-bytes'
const testEnv = { POS_SESSION_SECRET: TEST_SECRET }

function mockResponse() {
  return {
    headers: {},
    body: null,
    statusCode: 200,
    setHeader(name, value) { this.headers[name.toLowerCase()] = value },
    end(value = '') { this.body = value; this.writableEnded = true; return this },
  }
}

test('cashier PINs are salted scrypt hashes and valid PIN length is enforced', async () => {
  const first = await hashPin('0427')
  const second = await hashPin('0427')
  assert.notEqual(first.salt, second.salt)
  assert.notEqual(first.hash, second.hash)
  assert.equal(await verifyPin('0427', first.salt, first.hash), true)
  assert.equal(await verifyPin('9999', first.salt, first.hash), false)
  assert.equal(await verifyPin('0427', 'bad-salt', first.hash), false)
})

test('admin PIN writes persist only an independent salt and hash', async () => {
  let stored = null
  const fakeSupabase = {
    from(table) {
      assert.equal(table, 'pos_cashier_pin_credentials')
      return { upsert: async (row) => { stored = row; return { error: null } } }
    },
  }
  await setCashierPin(fakeSupabase, 'cashier-1', '0427')
  assert.equal(stored.cashier_id, 'cashier-1')
  assert.equal(stored.pin, undefined)
  assert.equal(stored.pin_hash.includes('0427'), false)
  assert.equal(await verifyPin('0427', stored.pin_salt, stored.pin_hash), true)
  await assert.rejects(() => setCashierPin(fakeSupabase, 'cashier-1', '123'))
  await assert.rejects(() => setCashierPin(fakeSupabase, 'cashier-1', '12ab'))
})

test('administrator password hash verifies only the original password', async () => {
  const encoded = await hashAdminPassword('A long random admin passphrase!')
  assert.match(encoded, /^scrypt\$32768\$8\$1\$/)
  assert.equal(await verifyAdminPassword('A long random admin passphrase!', encoded), true)
  assert.equal(await verifyAdminPassword('not the password', encoded), false)
  await assert.rejects(() => hashAdminPassword('short'))
})

test('signed sessions are role-bound, tamper-evident, and expire', () => {
  const now = 1_800_000_000_000
  const token = createSessionToken({ id: 'cashier-1', name: 'Cashier', role: 'cashier' }, testEnv, now)
  assert.equal(verifySessionToken(token, testEnv, now)?.role, 'cashier')
  const signatureStart = token.lastIndexOf('.') + 1
  const replacement = token[signatureStart] === 'A' ? 'B' : 'A'
  const tampered = `${token.slice(0, signatureStart)}${replacement}${token.slice(signatureStart + 1)}`
  assert.equal(verifySessionToken(tampered, testEnv, now), null)
  assert.equal(verifySessionToken(token, testEnv, now + 9 * 60 * 60 * 1000), null)
})

test('PIN login fails closed when the supplied existing Supabase project has no server key', async () => {
  await assert.rejects(
    () => verifyCashierPin({ cashierId: 'cashier-1', pin: '0427' }, { POS_SESSION_SECRET: TEST_SECRET }),
    (error) => error.statusCode === 503,
  )
})

test('PIN API does not return bearer tokens when backend configuration is missing', async () => {
  const res = mockResponse()
  await loginPinHandler({ method: 'POST', headers: {}, body: { cashierId: 'cashier-1', pin: '0427' } }, res, { POS_SESSION_SECRET: TEST_SECRET })
  assert.equal(res.statusCode, 503)
  assert.equal(res.headers['set-cookie'], undefined)
  assert.doesNotMatch(res.body, /token|0427|pin_hash|pin_salt/i)
})

test('admin PIN endpoint and checkout reject unauthenticated requests server-side', async () => {
  const adminResponse = mockResponse()
  await adminPinHandler({ method: 'GET', headers: {} }, adminResponse, testEnv)
  assert.equal(adminResponse.statusCode, 401)

  const checkoutResponse = mockResponse()
  await checkoutHandler({ method: 'POST', headers: {}, body: { items: [], paymentMethod: 'cash' } }, checkoutResponse, testEnv)
  assert.equal(checkoutResponse.statusCode, 401)
})

test('frontend source contains no localStorage session, default PIN, or cashier hash fields', () => {
  const root = process.cwd()
  const authStore = fs.readFileSync(path.join(root, 'src/stores/auth.js'), 'utf8')
  const loginPage = fs.readFileSync(path.join(root, 'src/views/LoginView.vue'), 'utf8')
  const pinApi = fs.readFileSync(path.join(root, 'api/login-pin.js'), 'utf8')
  const cashierApi = fs.readFileSync(path.join(root, 'api/cashiers.js'), 'utf8')
  assert.doesNotMatch(authStore, /localStorage|pos_cashier_session|token\s*=/i)
  assert.doesNotMatch(loginPage, /default\s*PIN|1234/i)
  assert.doesNotMatch(pinApi, /doc\.pin|cashier-default|1234/i)
  assert.doesNotMatch(cashierApi, /pin_hash|pin_salt|default-1|default-2/i)
})
