import { createServiceClient } from './_lib/database.js'
import { HttpError, methodNotAllowed, publicError, sendJson, validateSameOrigin } from './_lib/http.js'
import { fetchActiveCashierById, publicCashier } from './_lib/sanity.js'
import { enforceRateLimits, clearRateLimits, pinRateLimitKeys } from './_lib/rate-limit.js'
import { hashPin, verifyPin } from './_lib/passwords.js'
import { createSessionToken, setSessionCookie } from './_lib/sessions.js'

export async function setCashierPin(supabase, cashierId, pin) {
  if (typeof pin !== 'string' || !/^\d{4,6}$/.test(pin)) {
    throw new HttpError(400, 'PIN must contain 4 to 6 digits')
  }
  const { salt, hash } = await hashPin(pin)
  const { error } = await supabase.from('pos_cashier_pin_credentials').upsert({
    cashier_id: cashierId,
    pin_salt: salt,
    pin_hash: hash,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'cashier_id' })
  if (error) throw new HttpError(503, 'Secure PIN storage is temporarily unavailable')
}

export async function verifyCashierPin(body, env = process.env, req = { headers: {} }) {
  const cashierId = typeof body?.cashierId === 'string' ? body.cashierId.trim() : ''
  const pin = body?.pin
  if (!/^[A-Za-z0-9._:-]{1,128}$/.test(cashierId) || typeof pin !== 'string' || !/^\d{4,6}$/.test(pin)) {
    throw new HttpError(400, 'Enter a cashier profile and a 4–6 digit PIN')
  }

  const supabase = createServiceClient(env)
  const limits = pinRateLimitKeys(req, cashierId, env)
  await enforceRateLimits(supabase, limits)

  const [doc, credentialResult] = await Promise.all([
    fetchActiveCashierById(cashierId, env),
    supabase.from('pos_cashier_pin_credentials')
      .select('pin_salt,pin_hash')
      .eq('cashier_id', cashierId)
      .maybeSingle(),
  ])
  if (credentialResult.error) throw new HttpError(503, 'Secure authentication is temporarily unavailable')
  const stored = credentialResult.data
  const validPin = stored && await verifyPin(pin, stored.pin_salt, stored.pin_hash)
  if (!doc || !validPin) throw new HttpError(401, 'Cashier profile or PIN is not valid')

  await clearRateLimits(supabase, limits)
  const cashier = publicCashier(doc)
  return {
    cashier: { id: cashier.id, name: cashier.name, role: cashier.role },
    token: createSessionToken({ id: cashier.id, name: cashier.name, role: 'cashier' }, env),
  }
}

export default async function handler(req, res, env = process.env) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST')
  try {
    validateSameOrigin(req)
    const result = await verifyCashierPin(req.body, env, req)
    setSessionCookie(res, result.token, req, env, 'cashier')
    return sendJson(res, 200, { success: true, cashier: result.cashier })
  } catch (error) {
    const { statusCode, message } = publicError(error, 'PIN verification is temporarily unavailable')
    return sendJson(res, statusCode, { error: message })
  }
}
