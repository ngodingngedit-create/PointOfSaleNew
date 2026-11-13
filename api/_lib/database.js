import { createClient } from '@supabase/supabase-js'
import { HttpError } from './http.js'

export const EXPECTED_SUPABASE_URL = 'https://qrqwdrhogdiqdbzbhbcl.supabase.co'

export function createServiceClient(env = process.env) {
  const configuredUrl = String(env.SUPABASE_URL || '').replace(/\/$/, '')
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
  if (configuredUrl !== EXPECTED_SUPABASE_URL || !serviceKey) {
    throw new HttpError(503, 'Secure authentication is not configured')
  }

  return createClient(configuredUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { headers: { 'X-Client-Info': 'pos-server-auth' } },
  })
}
