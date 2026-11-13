import { createHmac } from 'node:crypto'
import { HttpError } from './http.js'

function getIp(req) {
  // Vercel supplies x-real-ip from its trusted edge. Use the left-most forwarded
  // address only as a local/proxy fallback; never store the address itself.
  const realIp = req.headers?.['x-real-ip']
  if (typeof realIp === 'string' && realIp.length > 0 && realIp.length <= 128) return realIp.trim()
  const forwarded = req.headers?.['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length <= 512) {
    const chain = forwarded.split(',').map((part) => part.trim()).filter(Boolean)
    if (chain.length) return chain[0].slice(0, 128)
  }
  return 'unknown'
}

function keyedHash(value, env) {
  const secret = env.POS_SESSION_SECRET
  if (typeof secret !== 'string' || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new HttpError(503, 'Secure authentication is not configured')
  }
  return createHmac('sha256', secret).update(value).digest('hex')
}

export function pinRateLimitKeys(req, cashierId, env = process.env) {
  const ip = getIp(req)
  return [
    { key: keyedHash(`pin:ip:${ip}`, env), maxAttempts: 30 },
    { key: keyedHash(`pin:ip-cashier:${ip}:${cashierId}`, env), maxAttempts: 10 },
    { key: keyedHash(`pin:cashier:${cashierId}`, env), maxAttempts: 20 },
  ]
}

export function adminRateLimitKeys(req, env = process.env) {
  const ip = getIp(req)
  const username = String(env.POS_ADMIN_USERNAME || 'unconfigured').toLowerCase()
  return [
    { key: keyedHash(`admin:ip:${ip}`, env), maxAttempts: 10 },
    { key: keyedHash(`admin:account:${username}`, env), maxAttempts: 10 },
  ]
}

export async function enforceRateLimits(supabase, limits) {
  for (const limit of limits) {
    const { data, error } = await supabase.rpc('pos_rate_limit_check', {
      p_bucket_key: limit.key,
      p_max_attempts: limit.maxAttempts,
      p_window_seconds: 900,
      p_lock_seconds: 900,
    })
    if (error) throw new HttpError(503, 'Secure authentication is temporarily unavailable')
    const row = Array.isArray(data) ? data[0] : data
    if (!row || row.allowed !== true) throw new HttpError(429, 'Too many attempts. Try again later.')
  }
}

export async function clearRateLimits(supabase, limits) {
  const results = await Promise.all(limits.map(({ key }) =>
    supabase.rpc('pos_rate_limit_clear', { p_bucket_key: key })
  ))
  if (results.some(({ error }) => error)) {
    throw new HttpError(503, 'Secure authentication is temporarily unavailable')
  }
}
