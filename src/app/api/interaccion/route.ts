// src/app/api/interaccion/route.ts

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAlt } from '@/lib/supabaseAlt'

const ORIGEN_SUPABASE_MAIN = 'supabase_main'
const ORIGEN_SUPABASE_ALT = 'supabase_alt'

function getClientPorOrigen(origen?: string) {
  switch (origen) {
    case ORIGEN_SUPABASE_MAIN:
      return supabase
    case ORIGEN_SUPABASE_ALT:
      return supabaseAlt
    default:
      // Fallback: principal
      return supabase
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { ok: false, error: 'Cuerpo inválido' },
        { status: 400 },
      )
    }

    const { juegoId, tipo, origen } = body as {
      juegoId?: string
      tipo?: string
      origen?: string
    }

    if (!juegoId || !tipo) {
      return NextResponse.json(
        { ok: false, error: 'juegoId y tipo son obligatorios' },
        { status: 400 },
      )
    }

    if (!['visita', 'descarga'].includes(tipo)) {
      return NextResponse.json(
        { ok: false, error: 'tipo inválido' },
        { status: 400 },
      )
    }

    // Elegir cliente según origen (cuenta principal o alternativa)
    const cliente = getClientPorOrigen(origen)

    // Fecha actual en formato YYYY-MM-DD (solo fecha)
    const hoy = new Date().toISOString().slice(0, 10)

    // Llamar a la función de Postgres que incrementa los contadores diarios
    const { error } = await cliente.rpc('incrementar_interaccion_juego', {
      p_juego_id: juegoId,
      p_tipo: tipo,
      p_fecha: hoy,
    })

    if (error) {
      console.error(
        `[interaccion] Error al incrementar contador (origen=${origen}):`,
        error,
      )
      return NextResponse.json(
        { ok: false, error: 'Error al registrar la interacción' },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[interaccion] Excepción:', err)
    return NextResponse.json(
      { ok: false, error: 'Error interno' },
      { status: 500 },
    )
  }
}
