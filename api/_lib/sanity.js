import { createClient } from '@sanity/client'
import { HttpError } from './http.js'

function getSanityClient(env = process.env) {
  const projectId = env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID || 'aejzrj0n'
  const dataset = env.SANITY_DATASET || env.VITE_SANITY_DATASET || 'production'
  const apiVersion = env.SANITY_API_VERSION || env.VITE_SANITY_API_VERSION || '2025-02-06'
  return createClient({ projectId, dataset, apiVersion, useCdn: false })
}

const CASHIER_FIELDS = `_id, name, role, avatar`

export async function fetchActiveCashiers(env = process.env) {
  try {
    const client = getSanityClient(env)
    return await client.fetch(`*[_type == "cashier" && isActive != false]{${CASHIER_FIELDS}} | order(name asc)`)
  } catch {
    throw new HttpError(503, 'Cashier directory is temporarily unavailable')
  }
}

export async function fetchActiveCashierById(cashierId, env = process.env) {
  try {
    const client = getSanityClient(env)
    return await client.fetch(`*[_type == "cashier" && _id == $cashierId && isActive != false][0]{${CASHIER_FIELDS}}`, { cashierId })
  } catch {
    throw new HttpError(503, 'Cashier directory is temporarily unavailable')
  }
}

export function publicCashier(doc) {
  if (!doc) return null
  return {
    id: doc._id,
    name: String(doc.name || 'Cashier').slice(0, 120),
    role: String(doc.role || 'cashier').slice(0, 40),
    avatar: typeof doc.avatar === 'string' ? doc.avatar.slice(0, 8) : '',
  }
}
