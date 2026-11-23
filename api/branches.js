import { fetchActiveCashierById, fetchActiveTablesForBranch, publicCashier } from './_lib/sanity.js'
import { HttpError, methodNotAllowed, publicError, sendJson, validateSameOrigin } from './_lib/http.js'
import { requireSession } from './_lib/sessions.js'

export async function getBranchConfig(session, env = process.env) {
  const doc = await fetchActiveCashierById(session.id, env)
  if (!doc) throw new HttpError(403, 'Profil kasir tidak aktif atau tidak ditemukan')

  const cashier = publicCashier(doc)
  const branch = doc.branch && doc.branch.isActive !== false
    ? { id: doc.branch._id, name: String(doc.branch.name || '').slice(0, 100) }
    : null
  const tables = branch ? (await fetchActiveTablesForBranch(branch.id, env)).map((table) => ({
    id: table._id,
    name: String(table.name || '').slice(0, 40),
    sortOrder: Number.isFinite(table.sortOrder) ? table.sortOrder : 0,
  })) : []
  const configuredBranch = branch ? { ...branch, tables } : null

  return {
    cashier,
    branch: configuredBranch,
    branches: configuredBranch ? [configuredBranch] : [],
    tables,
    configurationError: !branch
      ? 'Kasir belum ditautkan ke cabang aktif di Sanity Studio.'
      : null,
  }
}

export default async function handler(req, res, env = process.env) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET')
  try {
    validateSameOrigin(req)
    const session = requireSession(req, env, 'cashier')
    return sendJson(res, 200, await getBranchConfig(session, env))
  } catch (error) {
    const { statusCode, message } = publicError(error, 'Konfigurasi cabang dan meja tidak tersedia')
    return sendJson(res, statusCode, { error: message })
  }
}
