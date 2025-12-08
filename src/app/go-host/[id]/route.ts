// src/app/go-host/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getJuegoDetalleGlobal } from '@/lib/db/multiSource'
import { getLinksForJuego } from '@/lib/storage/juegoLinks'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id
  const urlObj = new URL(req.url)
  const hoster = urlObj.searchParams.get('h')

  if (!hoster) {
    // Si no se especifica hoster, volvemos a la página del juego
    return NextResponse.redirect(
      new URL(`/juego/${encodeURIComponent(id)}`, req.url),
    )
  }

  // Necesitamos título y origen para volver a resolver los links en el servidor
  const { juego } = await getJuegoDetalleGlobal(id)

  if (!juego) {
    return NextResponse.redirect(
      new URL(`/juego/${encodeURIComponent(id)}`, req.url),
    )
  }

  const titulo = (juego as any).titulo as string | undefined
  const origen = (juego as any).origen as string | undefined

  if (!titulo || !origen) {
    return NextResponse.redirect(
      new URL(`/juego/${encodeURIComponent(id)}`, req.url),
    )
  }

  // Volvemos a pedir los links en el servidor
  const links = await getLinksForJuego(titulo, origen)
  const raw = (links as any)[hoster]

  if (!raw || typeof raw !== 'string') {
    // No hay link para ese hoster, volvemos a la página del juego
    return NextResponse.redirect(
      new URL(`/juego/${encodeURIComponent(id)}`, req.url),
    )
  }

  const text = raw.trim()

  // Intentar extraer una URL HTTP/HTTPS dentro del texto
  let finalUrl = text
  const idx = text.toLowerCase().indexOf('http')
  if (idx !== -1) {
    finalUrl = text.slice(idx).trim().split(/\s/)[0]

    // Corregir "https:/algo" -> "https://algo"
    if (/^https?:\/[^/]/.test(finalUrl)) {
      finalUrl = finalUrl.replace(/^(https?:)\/(?!\/)/, '$1//')
    }
  }

  const isHttp = /^https?:\/\//i.test(finalUrl)
  const isMagnet = /^magnet:/i.test(finalUrl)

  if (!isHttp && !isMagnet) {
    // Si no parece una URL válida, volvemos a la página del juego
    return NextResponse.redirect(
      new URL(`/juego/${encodeURIComponent(id)}`, req.url),
    )
  }

  return NextResponse.redirect(finalUrl)
}
