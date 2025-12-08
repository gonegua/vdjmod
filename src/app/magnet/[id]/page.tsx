// src/app/magnet/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getJuegoDetalleGlobal } from '@/lib/db/multiSource'
import { getLinksForJuego } from '@/lib/storage/juegoLinks'

type MagnetPageProps = {
  params: { id: string }
  searchParams: { h?: string }
}

function extractMagnet(text: string): string | null {
  const trimmed = text.trim()
  if (!trimmed) return null

  const lower = trimmed.toLowerCase()
  const idx = lower.indexOf('magnet:')
  if (idx === -1) {
    // Si no hay "magnet:", quizá el archivo ya contiene SOLO el magnet
    return trimmed.startsWith('magnet:') ? trimmed : null
  }

  let magnet = trimmed.slice(idx).trim()
  // Cortar en espacio/salto de línea por si el fichero tiene texto extra
  magnet = magnet.split(/\s/)[0]
  return magnet || null
}

export default async function MagnetPage({
  params,
  searchParams,
}: MagnetPageProps) {
  const id = params.id
  const hoster = searchParams.h ?? 'magnet'

  const { juego } = await getJuegoDetalleGlobal(id)

  if (!juego) {
    return notFound()
  }

  const titulo = (juego as any).titulo as string | undefined
  const origen = (juego as any).origen as string | undefined

  if (!titulo || !origen) {
    return notFound()
  }

  const links = await getLinksForJuego(titulo, origen)
  const raw = (links as any)[hoster]

  if (!raw || typeof raw !== 'string') {
    return notFound()
  }

  const text = raw.trim()
  const magnet = extractMagnet(text)

  if (!magnet) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-50">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg shadow-black/40">
        <h1 className="mb-2 text-xl font-semibold">Magnet link</h1>
        <p className="mb-4 text-sm text-zinc-400">
          Juego:{' '}
          <span className="font-medium text-zinc-100">
            {(juego as any).titulo}
          </span>
        </p>

        <label className="mb-2 block text-xs font-medium text-zinc-400">
          Copia este enlace y pégalo en tu cliente torrent:
        </label>

        <textarea
          readOnly
          className="
            w-full resize-none rounded-lg border border-zinc-700
            bg-zinc-950 px-3 py-2
            font-mono text-xs text-zinc-100
            focus:outline-none focus:ring-2 focus:ring-zinc-500
            md:text-sm
          "
          rows={3}
          value={magnet}
        />

        <p className="mt-3 text-[0.7rem] text-zinc-500">
          El enlace está ofuscado en la página original y solo se muestra aquí
          para que puedas copiarlo manualmente.
        </p>
      </div>
    </div>
  )
}
