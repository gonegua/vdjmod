// src/lib/supabaseAlt.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_2
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_2

console.log('[SUPABASE ALT] URL:', supabaseUrl)
console.log('[SUPABASE ALT] ANON LENGTH:', supabaseAnonKey?.length)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL_2 o NEXT_PUBLIC_SUPABASE_ANON_KEY_2. Revisa tu .env.local',
  )
}

export const supabaseAlt = createClient(supabaseUrl, supabaseAnonKey)
