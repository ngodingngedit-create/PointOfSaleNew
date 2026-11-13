import { fetchActiveCashiers, publicCashier } from './_lib/sanity.js'
import { methodNotAllowed, publicError, sendJson } from './_lib/http.js'

export async function getCashiers(env = process.env) {
  const docs = await fetchActiveCashiers(env)
  return docs.map(publicCashier).filter(Boolean)
}

export default async function handler(req, res, env = process.env) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET')
  try {
    return sendJson(res, 200, await getCashiers(env))
  } catch (error) {
    const { statusCode, message } = publicError(error, 'Cashier directory is temporarily unavailable')
    return sendJson(res, statusCode, { error: message })
  }
}
