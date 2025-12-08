// src/app/go/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getJuegoDetalleGlobal } from '@/lib/db/multiSource'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const juegoId = params.id

  // Reutilizamos tu lógica de datos global
  const { juego } = await getJuegoDetalleGlobal(juegoId)

  // Si no hay juego o no tiene enlace_descarga, redirigimos a la home (o 404 si prefieres)
  if (!juego || !juego.enlace_descarga) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Redirigimos al enlace real desde el backend
  return NextResponse.redirect(juego.enlace_descarga)
}
