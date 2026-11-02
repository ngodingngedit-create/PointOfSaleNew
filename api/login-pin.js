import { createClient } from '@sanity/client'
import crypto from 'node:crypto'

export async function verifyCashierPin(body, env = process.env) {
  const { cashierId, pin } = body || {}

  if (!cashierId || !pin) {
    const err = new Error('ID Kasir dan PIN wajib diisi')
    err.statusCode = 400
    throw err
  }

  // Support fallback default kasir jika skema Sanity belum dideploy
  if (cashierId === 'cashier-default-1' || cashierId === 'cashier-default-2') {
    // PIN default: 1234
    if (String(pin) !== '1234') {
      const err = new Error('PIN tidak sesuai (Gunakan PIN default: 1234)')
      err.statusCode = 401
      throw err
    }
    const name = cashierId === 'cashier-default-1' ? 'Kasir Utama' : 'Supervisor Shift'
    const role = cashierId === 'cashier-default-1' ? 'cashier' : 'supervisor'
    return {
      success: true,
      token: `session-${crypto.randomBytes(16).toString('hex')}`,
      cashier: { id: cashierId, name, role },
    }
  }

  const projectId = env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID || 'aejzrj0n'
  const dataset = env.SANITY_DATASET || env.VITE_SANITY_DATASET || 'production'
  const apiVersion = env.SANITY_API_VERSION || '2025-02-06'
  const token = env.SANITY_API_TOKEN

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token: token || undefined,
    useCdn: false,
  })

  // Query verifikasi PIN di sisi server
  const query = `*[_type == "cashier" && _id == $cashierId && isActive != false][0]{
    _id,
    name,
    role,
    pin
  }`
  const doc = await client.fetch(query, { cashierId })

  if (!doc) {
    const err = new Error('Kasir tidak ditemukan atau berstatus nonaktif')
    err.statusCode = 404
    throw err
  }

  // Verifikasi PIN
  if (String(doc.pin).trim() !== String(pin).trim()) {
    const err = new Error('PIN kasir tidak valid')
    err.statusCode = 401
    throw err
  }

  return {
    success: true,
    token: `session-${crypto.randomBytes(16).toString('hex')}`,
    cashier: {
      id: doc._id,
      name: doc.name,
      role: doc.role || 'cashier',
    },
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const result = await verifyCashierPin(req.body, process.env)
    return res.status(200).json(result)
  } catch (error) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      error: error.message || 'Terjadi kesalahan saat memverifikasi PIN',
    })
  }
}
