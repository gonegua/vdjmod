// src/lib/supabase.ts (o donde lo tengas)

import {
  createBrowserClient as browserClient,
  createServerClient as serverClient,
  type CookieOptions,
} from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { type Session } from '@supabase/auth-helpers-nextjs'

/**
 * Cliente para el navegador (CSR)
 */
export const createBrowserClient = (initialSession: Session | null = null) =>
  browserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        ...(initialSession && {
          // Hidratar la sesión inicial si viene del servidor
          initialSession,
        }),
      },
    },
  )

/**
 * Cliente para Server Components / Route Handlers / Server Actions (SSR)
 *
 * Versión sin `next/headers` para que este archivo pueda usarse
 * también desde `pages/` sin errores.
 *
 * Nota: aquí NO se leen ni escriben cookies de Supabase; la sesión
 * no se hidrata automáticamente en SSR. Para uso público (sin login SSR)
 * es suficiente.
 */
export const createServerClient = () =>
  serverClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(_name: string) {
          // En este helper compartido no leemos cookies
          return undefined
        },
        set(_name: string, _value: string, _options: CookieOptions) {
          // No-op en este contexto
        },
        remove(_name: string, _options: CookieOptions) {
          // No-op en este contexto
        },
      },
    },
  )

/**
 * Cliente para middleware (Edge / node middleware.ts)
 * Sigue usando NextRequest/NextResponse como antes.
 */
export const createMiddlewareClient = (request: NextRequest) => {
  // Respuesta base sin modificar
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = serverClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Si se actualiza la cookie, sincronizar request y response
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Si se elimina la cookie, sincronizar request y response
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    },
  )

  return { supabase, response }
}
