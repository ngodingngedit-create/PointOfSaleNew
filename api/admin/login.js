import { createServiceClient } from '../_lib/database.js'
import { HttpError, methodNotAllowed, publicError, sendJson, validateSameOrigin } from '../_lib/http.js'
import { adminRateLimitKeys, enforceRateLimits, clearRateLimits } from '../_lib/rate-limit.js'
import { constantTimeTextEqual, verifyAdminPassword } from '../_lib/passwords.js'
import { createSessionToken, setSessionCookie } from '../_lib/sessions.js'

export async function verifyAdminCredentials(body, env = process.env, req = { headers: {} }) {
  const username = typeof body?.username === 'string' ? body.username.trim() : ''
  const password = body?.password
  if (!username || username.length > 128 || typeof password !== 'string' || password.length > 1024) {
    throw new HttpError(400, 'Enter administrator credentials')
  }

  const supabase = createServiceClient(env)
  const limits = adminRateLimitKeys(req, env)
  await enforceRateLimits(supabase, limits)

  const expectedUsername = env.POS_ADMIN_USERNAME
  const passwordHash = env.POS_ADMIN_PASSWORD_HASH
  if (!expectedUsername || !passwordHash) {
    throw new HttpError(503, 'Secure administrator access is not configured')
  }

  const usernameMatches = constantTimeTextEqual(username, expectedUsername)
  const passwordMatches = await verifyAdminPassword(password, passwordHash)
  if (!usernameMatches || !passwordMatches) throw new HttpError(401, 'Administrator username or password is not valid')

  await clearRateLimits(supabase, limits)
  return {
    admin: { username: expectedUsername },
    token: createSessionToken({ id: expectedUsername, name: 'Administrator', role: 'admin' }, env),
  }
}

export default async function handler(req, res, env = process.env) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST')
  try {
    validateSameOrigin(req)
    const result = await verifyAdminCredentials(req.body, env, req)
    setSessionCookie(res, result.token, req, env, 'admin')
    return sendJson(res, 200, { success: true, admin: result.admin })
  } catch (error) {
    const { statusCode, message } = publicError(error, 'Administrator sign-in is temporarily unavailable')
    return sendJson(res, statusCode, { error: message })
  }
}
