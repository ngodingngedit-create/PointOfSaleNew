export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
  }
}

export function sendJson(res, statusCode, body, headers = {}) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value)
  return res.end(JSON.stringify(body))
}

export function methodNotAllowed(res, allow) {
  return sendJson(res, 405, { error: 'Method Not Allowed' }, { Allow: allow })
}

export function publicError(error, fallback = 'Request could not be completed') {
  if (error?.statusCode && error.statusCode < 500) {
    return { statusCode: error.statusCode, message: error.message }
  }
  return { statusCode: 503, message: fallback }
}

export function validateSameOrigin(req) {
  const origin = req.headers?.origin
  if (!origin) return
  const host = req.headers?.host
  try {
    if (!host || new URL(origin).host.toLowerCase() !== String(host).toLowerCase()) {
      throw new HttpError(403, 'Cross-origin request rejected')
    }
  } catch (error) {
    if (error instanceof HttpError) throw error
    throw new HttpError(403, 'Cross-origin request rejected')
  }
}
