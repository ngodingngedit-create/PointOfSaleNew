import { createServiceClient } from './_lib/database.js'
import { HttpError, methodNotAllowed, publicError, sendJson, validateSameOrigin } from './_lib/http.js'
import { normalizeMemberPhone } from './_lib/members.js'
import { memberRateLimitKeys, enforceRateLimits } from './_lib/rate-limit.js'
import { requireSession } from './_lib/sessions.js'

function memberPayload(row) {
  return {
    id: row.id,
    name: String(row.full_name || '').slice(0, 100),
    phone: row.phone_e164,
    createdAt: row.created_at,
  }
}

export async function lookupMember(phone, env = process.env) {
  const normalized = normalizeMemberPhone(phone)
  if (!normalized) throw new HttpError(400, 'Format nomor telepon tidak valid')
  const supabase = createServiceClient(env)
  const { data, error } = await supabase
    .from('pos_members')
    .select('id,full_name,phone_e164,created_at')
    .eq('phone_e164', normalized)
    .maybeSingle()
  if (error) throw new HttpError(503, 'Data Member sementara tidak tersedia')
  return data ? memberPayload(data) : null
}

export async function createMember(body, env = process.env) {
  const name = typeof body?.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : ''
  const phone = normalizeMemberPhone(body?.phone)
  if (name.length < 2 || name.length > 100) throw new HttpError(400, 'Nama Member harus 2–100 karakter')
  if (!phone) throw new HttpError(400, 'Format nomor telepon tidak valid')

  const supabase = createServiceClient(env)
  const { data, error } = await supabase
    .from('pos_members')
    .insert({ full_name: name, phone_e164: phone })
    .select('id,full_name,phone_e164,created_at')
    .single()
  if (error?.code === '23505') throw new HttpError(409, 'Nomor ini sudah terdaftar sebagai Member. Cari nomor tersebut untuk memilih profil yang ada.')
  if (error) throw new HttpError(503, 'Member tidak dapat disimpan saat ini')
  return memberPayload(data)
}

export default async function handler(req, res, env = process.env) {
  if (!['GET', 'POST'].includes(req.method)) return methodNotAllowed(res, 'GET, POST')
  try {
    validateSameOrigin(req)
    const session = requireSession(req, env, 'cashier')
    const supabase = createServiceClient(env)
    await enforceRateLimits(supabase, memberRateLimitKeys(req, session, env))

    if (req.method === 'GET') {
      const value = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`).searchParams.get('phone')
      return sendJson(res, 200, { member: await lookupMember(value, env) })
    }

    return sendJson(res, 201, { member: await createMember(req.body, env) })
  } catch (error) {
    const { statusCode, message } = publicError(error, 'Member tidak dapat diproses saat ini')
    return sendJson(res, statusCode, { error: message })
  }
}
