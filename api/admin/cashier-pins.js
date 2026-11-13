import { createServiceClient } from '../_lib/database.js'
import { HttpError, methodNotAllowed, publicError, sendJson, validateSameOrigin } from '../_lib/http.js'
import { fetchActiveCashierById, fetchActiveCashiers, publicCashier } from '../_lib/sanity.js'
import { requireSession } from '../_lib/sessions.js'
import { setCashierPin } from '../login-pin.js'

function validCashierId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9._:-]{1,128}$/.test(value.trim())
}

async function listPinStatus(env) {
  const supabase = createServiceClient(env)
  const [cashierDocs, credentialResult] = await Promise.all([
    fetchActiveCashiers(env),
    supabase.from('pos_cashier_pin_credentials').select('cashier_id'),
  ])
  if (credentialResult.error) throw new HttpError(503, 'Secure PIN storage is temporarily unavailable')
  const configured = new Set((credentialResult.data || []).map((record) => record.cashier_id))
  return cashierDocs.map(publicCashier).filter(Boolean).map((cashier) => ({
    ...cashier,
    hasPin: configured.has(cashier.id),
  }))
}

async function setPin(body, env) {
  const cashierId = typeof body?.cashierId === 'string' ? body.cashierId.trim() : ''
  if (!validCashierId(cashierId)) throw new HttpError(400, 'Select a valid cashier profile')
  const pin = body?.pin
  if (typeof pin !== 'string' || !/^\d{4,6}$/.test(pin)) {
    throw new HttpError(400, 'PIN must contain 4 to 6 digits')
  }
  const cashier = await fetchActiveCashierById(cashierId, env)
  if (!cashier) throw new HttpError(404, 'Cashier profile was not found or is inactive')
  const supabase = createServiceClient(env)
  await setCashierPin(supabase, cashierId, pin)
  return { success: true }
}

async function clearPin(body, env) {
  const cashierId = typeof body?.cashierId === 'string' ? body.cashierId.trim() : ''
  if (!validCashierId(cashierId)) throw new HttpError(400, 'Select a valid cashier profile')
  const supabase = createServiceClient(env)
  const { error } = await supabase.from('pos_cashier_pin_credentials').delete().eq('cashier_id', cashierId)
  if (error) throw new HttpError(503, 'Secure PIN storage is temporarily unavailable')
  return { success: true }
}

export default async function handler(req, res, env = process.env) {
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) return methodNotAllowed(res, 'GET, POST, DELETE')
  try {
    requireSession(req, env, 'admin')
    if (req.method === 'GET') return sendJson(res, 200, await listPinStatus(env))
    validateSameOrigin(req)
    const result = req.method === 'POST' ? await setPin(req.body, env) : await clearPin(req.body, env)
    return sendJson(res, 200, result)
  } catch (error) {
    const { statusCode, message } = publicError(error, 'Cashier PIN management is temporarily unavailable')
    return sendJson(res, statusCode, { error: message })
  }
}
