import { createClient } from '@sanity/client'

export async function getCashiers(env = process.env) {
  const projectId = env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID || 'aejzrj0n'
  const dataset = env.SANITY_DATASET || env.VITE_SANITY_DATASET || 'production'
  const apiVersion = env.SANITY_API_VERSION || '2025-02-06'
  const token = env.SANITY_API_TOKEN

  // Client server-side (jika ada token pakai token, jika belum ada pakai publik client)
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token: token || undefined,
    useCdn: false,
  })

  // KRITIS: Field `pin` sengaja TIDAK disertakan agar tidak pernah bocor ke browser
  const query = `*[_type == "cashier" && isActive != false]{
    "id": _id,
    name,
    role,
    avatar
  } | order(name asc)`

  try {
    const list = await client.fetch(query)
    // Jika belum ada data kasir di Sanity, berikan default fallback
    if (!list || list.length === 0) {
      return [
        { id: 'cashier-default-1', name: 'Kasir Utama', role: 'cashier', avatar: 'KU' },
        { id: 'cashier-default-2', name: 'Supervisor Shift', role: 'supervisor', avatar: 'SS' },
      ]
    }
    return list
  } catch (err) {
    console.error('Error fetching cashiers from Sanity:', err)
    // Fallback jika skema belum dibuat di Sanity
    return [
      { id: 'cashier-default-1', name: 'Kasir Utama', role: 'cashier', avatar: 'KU' },
      { id: 'cashier-default-2', name: 'Supervisor Shift', role: 'supervisor', avatar: 'SS' },
    ]
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const cashiers = await getCashiers(process.env)
    return res.status(200).json(cashiers)
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
