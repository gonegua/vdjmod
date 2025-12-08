// src/actions/auth-actions.tsx
'use server'

import { headers } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // createServerClient SIN argumentos (como está tipado en tu proyecto)
  const supabase = createServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signUp(formData: FormData) {
  const origin = headers().get('origin')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const apodo = formData.get('apodo') as string

  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  const user = data?.user

  if (!user) {
    return { error: 'No se pudo obtener el usuario recién registrado.' }
  }

  // Insertar perfil personalizado
  const { error: perfilError } = await supabase.from('perfiles').insert([
    {
      id: user.id,
      apodo: apodo,
      actualizado_en: new Date().toISOString(),
    },
  ])

  if (perfilError) {
    return {
      error:
        'Registro exitoso, pero falló al crear perfil: ' + perfilError.message,
    }
  }

  if (user.identities?.length === 0) {
    return { message: 'Revisa tu correo para confirmar el registro.' }
  }

  return { success: true }
}
