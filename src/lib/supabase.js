import { createClient } from '@supabase/supabase-js'
import { createMockAuth, createMockDb, createMockFunctions } from './demo-client'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ===== DEMO MODE =====
// Kalau .env belum diisi, pakai mock client dengan data dummy di memori
// supaya UI bisa dipreview tanpa Supabase. Semua perubahan hilang saat refresh.
export const isDemoMode = !supabaseUrl || !supabaseAnonKey

function makeMockClient() {
  return {
    auth: createMockAuth(),
    from: createMockDb().from,
    rpc: createMockDb().rpc,
    functions: createMockFunctions(),
  }
}

export const supabase = isDemoMode ? makeMockClient() : createClient(supabaseUrl, supabaseAnonKey)

if (isDemoMode) {
  console.warn(
    '[DEMO MODE] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi di frontend/.env. ' +
      'App jalan dengan data dummy (hilang saat refresh). Isi .env lalu restart dev server untuk koneksi Supabase asli.'
  )
}
