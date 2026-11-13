import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { HttpError } from './http.js'

const scrypt = promisify(scryptCallback)
export const SCRYPT_N = 32768
export const SCRYPT_R = 8
export const SCRYPT_P = 1
const HASH_BYTES = 64
const SALT_BYTES = 16
const MAXMEM = 128 * 1024 * 1024

function decodeBase64Url(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null
  const decoded = Buffer.from(value, 'base64url')
  return decoded.length ? decoded : null
}

async function derive(secret, salt) {
  return Buffer.from(await scrypt(String(secret), salt, HASH_BYTES, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: MAXMEM,
  }))
}

export async function hashPin(pin) {
  const salt = randomBytes(SALT_BYTES)
  const digest = await derive(pin, salt)
  return { salt: salt.toString('base64url'), hash: digest.toString('base64url') }
}

export async function verifyPin(pin, encodedSalt, encodedHash) {
  const salt = decodeBase64Url(String(encodedSalt || ''))
  const expected = decodeBase64Url(String(encodedHash || ''))
  if (!salt || salt.length !== SALT_BYTES || !expected || expected.length !== HASH_BYTES) return false
  const actual = await derive(pin, salt)
  return timingSafeEqual(actual, expected)
}

export async function hashAdminPassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 1024) {
    throw new HttpError(400, 'Administrator password must be 12–1024 characters')
  }
  const { salt, hash } = await hashPin(password)
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${hash}`
}

export async function verifyAdminPassword(password, encoded) {
  if (typeof password !== 'string' || typeof encoded !== 'string') return false
  const parts = encoded.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false
  if (parts[1] !== String(SCRYPT_N) || parts[2] !== String(SCRYPT_R) || parts[3] !== String(SCRYPT_P)) return false
  return verifyPin(password, parts[4], parts[5])
}

export function constantTimeTextEqual(left, right) {
  const a = Buffer.from(String(left ?? ''), 'utf8')
  const b = Buffer.from(String(right ?? ''), 'utf8')
  const digestA = createHash('sha256').update(a).digest()
  const digestB = createHash('sha256').update(b).digest()
  const matches = timingSafeEqual(digestA, digestB)
  return matches && a.length === b.length
}
