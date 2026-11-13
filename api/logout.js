import { clearSessionCookie } from './_lib/sessions.js'
import { methodNotAllowed, publicError, sendJson, validateSameOrigin } from './_lib/http.js'

export default async function handler(req, res, env = process.env) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST')
  try {
    validateSameOrigin(req)
    clearSessionCookie(res, req, env)
    return sendJson(res, 200, { success: true })
  } catch (error) {
    const { statusCode, message } = publicError(error, 'Sign-out is temporarily unavailable')
    return sendJson(res, statusCode, { error: message })
  }
}
