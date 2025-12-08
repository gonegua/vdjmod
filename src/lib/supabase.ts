import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('[SUPABASE] URL:', supabaseUrl)
console.log('[SUPABASE] ANON LENGTH:', supabaseAnonKey?.length)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. Revisa tu .env.local',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
