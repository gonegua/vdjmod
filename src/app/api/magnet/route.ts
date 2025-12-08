// src/app/api/magnet/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getJuegoDetalleGlobal } from '@/lib/db/multiSource'
import { getLinksForJuego } from '@/lib/storage/juegoLinks'

function extractMagnet(text: string): string | null {
  const trimmed = text.trim()
  if (!trimmed) return null

  const lower = trimmed.toLowerCase()
  const idx = lower.indexOf('magnet:')
  if (idx === -1) {
    return trimmed.startsWith('magnet:') ? trimmed : null
  }

  let magnet = trimmed.slice(idx).trim()
  magnet = magnet.split(/\s/)[0]
  return magnet || null
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const juegoId = url.searchParams.get('juegoId')

  if (!juegoId) {
    return NextResponse.json({ error: 'juegoId requerido' }, { status: 400 })
  }

  const { juego } = await getJuegoDetalleGlobal(juegoId)

  if (!juego) {
    return NextResponse.json({ error: 'Juego no encontrado' }, { status: 404 })
  }

  const titulo = (juego as any).titulo as string | undefined
  const origen = (juego as any).origen as string | undefined

  if (!titulo || !origen) {
    return NextResponse.json(
      { error: 'Datos del juego incompletos' },
      { status: 500 },
    )
  }

  const links = await getLinksForJuego(titulo, origen)
  const raw = (links as any)['magnet']

  if (!raw || typeof raw !== 'string') {
    return NextResponse.json(
      { error: 'Enlace magnet no disponible' },
      { status: 404 },
    )
  }

  const magnet = extractMagnet(raw)
  if (!magnet) {
    return NextResponse.json(
      { error: 'Enlace magnet inválido' },
      { status: 500 },
    )
  }

  return NextResponse.json({ magnet })
}
