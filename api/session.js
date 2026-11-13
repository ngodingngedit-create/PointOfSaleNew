import { getSession } from './_lib/sessions.js'
import { methodNotAllowed, publicError, sendJson } from './_lib/http.js'

export default async function handler(req, res, env = process.env) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET')
  try {
    const session = getSession(req, env)
    if (!session) return sendJson(res, 401, { authenticated: false })
    if (session.role === 'admin') {
      return sendJson(res, 200, { authenticated: true, role: 'admin', admin: { username: session.id } })
    }
    return sendJson(res, 200, {
      authenticated: true,
      role: 'cashier',
      cashier: { id: session.id, name: session.name, role: 'cashier' },
    })
  } catch (error) {
    const { statusCode, message } = publicError(error, 'Session validation is temporarily unavailable')
    return sendJson(res, statusCode, { error: message })
  }
}
