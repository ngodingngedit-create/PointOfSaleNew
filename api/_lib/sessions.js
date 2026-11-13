import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { HttpError } from './http.js'

export const SESSION_COOKIE = 'pos_session'
const CASHIER_TTL_SECONDS = 8 * 60 * 60
const ADMIN_TTL_SECONDS = 60 * 60

function sessionSecret(env) {
  const secret = env.POS_SESSION_SECRET
  if (typeof secret !== 'string' || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new HttpError(503, 'Secure authentication is not configured')
  }
  return secret
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function signature(value, secret) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

export function createSessionToken(identity, env = process.env, now = Date.now()) {
  if (!identity || !['cashier', 'admin'].includes(identity.role) || !identity.id) {
    throw new HttpError(500, 'Invalid session identity')
  }
  const ttl = identity.role === 'admin' ? ADMIN_TTL_SECONDS : CASHIER_TTL_SECONDS
  const header = encode({ alg: 'HS256', typ: 'JWT' })
  const payload = encode({
    iss: 'pos-private-admin',
    sub: String(identity.id),
    name: String(identity.name || '').slice(0, 120),
    role: identity.role,
    iat: Math.floor(now / 1000),
    exp: Math.floor(now / 1000) + ttl,
    jti: randomBytes(16).toString('base64url'),
  })
  const unsigned = `${header}.${payload}`
  return `${unsigned}.${signature(unsigned, sessionSecret(env))}`
}

export function verifySessionToken(token, env = process.env, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 4096) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'))
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
    if (header?.alg !== 'HS256' || header?.typ !== 'JWT') return null
    if (payload?.iss !== 'pos-private-admin' || !['cashier', 'admin'].includes(payload?.role)) return null
    if (typeof payload.sub !== 'string' || !payload.sub || !Number.isInteger(payload.exp)) return null
    if (payload.exp <= Math.floor(now / 1000)) return null
    const unsigned = `${parts[0]}.${parts[1]}`
    const expected = Buffer.from(signature(unsigned, sessionSecret(env)), 'base64url')
    const actual = Buffer.from(parts[2], 'base64url')
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null
    return {
      id: payload.sub,
      name: typeof payload.name === 'string' ? payload.name : '',
      role: payload.role,
      expiresAt: payload.exp,
    }
  } catch {
    return null
  }
}

export function getCookie(req, name = SESSION_COOKIE) {
  const raw = req.headers?.cookie
  if (typeof raw !== 'string') return null
  for (const part of raw.split(';')) {
    const separator = part.indexOf('=')
    if (separator < 0) continue
    if (part.slice(0, separator).trim() === name) {
      try { return decodeURIComponent(part.slice(separator + 1).trim()) } catch { return null }
    }
  }
  return null
}

function cookieOptions(req, env, maxAge) {
  const secure = env.NODE_ENV === 'production' || Boolean(env.VERCEL)
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`
}

export function setSessionCookie(res, token, req, env = process.env, role = 'cashier') {
  const maxAge = role === 'admin' ? ADMIN_TTL_SECONDS : CASHIER_TTL_SECONDS
  const secure = env.NODE_ENV === 'production' || Boolean(env.VERCEL)
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`)
}

export function clearSessionCookie(res, req, env = process.env) {
  res.setHeader('Set-Cookie', cookieOptions(req, env, 0))
}

export function getSession(req, env = process.env) {
  const token = getCookie(req)
  if (!token) return null
  return verifySessionToken(token, env)
}

export function requireSession(req, env = process.env, requiredRole) {
  const session = getSession(req, env)
  if (!session) throw new HttpError(401, 'Authentication required')
  if (requiredRole && session.role !== requiredRole) throw new HttpError(403, 'Not authorized')
  return session
}
