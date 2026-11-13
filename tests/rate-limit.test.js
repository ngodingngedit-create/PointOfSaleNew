import assert from 'node:assert/strict'
import { test } from 'node:test'
import { adminRateLimitKeys, pinRateLimitKeys } from '../api/_lib/rate-limit.js'

const env = { POS_SESSION_SECRET: 'unit-test-session-secret-value-at-least-32-bytes', POS_ADMIN_USERNAME: 'test-admin' }

test('rate limits include opaque account-scoped buckets to constrain distributed guesses', () => {
  const req = { headers: { 'x-real-ip': '203.0.113.19' } }
  const cashierLimits = pinRateLimitKeys(req, 'cashier-1', env)
  assert.equal(cashierLimits.length, 3)
  assert.deepEqual(cashierLimits.map((item) => item.maxAttempts), [30, 10, 20])
  assert.ok(cashierLimits.every((item) => /^[a-f0-9]{64}$/.test(item.key)))
  assert.ok(cashierLimits.every((item) => !item.key.includes('203.0.113.19')))

  const adminLimits = adminRateLimitKeys(req, env)
  assert.equal(adminLimits.length, 2)
  assert.deepEqual(adminLimits.map((item) => item.maxAttempts), [10, 10])
  assert.ok(adminLimits.every((item) => /^[a-f0-9]{64}$/.test(item.key)))
})
