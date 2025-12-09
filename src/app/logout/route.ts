// src/app/logout/route.ts

// src/app/logout/route.ts
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = createServerClient() // SIN argumentos
  await supabase.auth.signOut()
  return redirect('/login')
}
