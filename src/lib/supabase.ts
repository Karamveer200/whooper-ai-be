import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null

export const getSupabase = (): SupabaseClient => {
  if (!supabase) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('Missing Supabase environment variables')
    }
    supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return supabase
}
