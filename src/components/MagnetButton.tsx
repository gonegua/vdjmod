// src/components/MagnetButton.tsx
'use client'

import { useState } from 'react'

type Props = {
  juegoId: string
}

export default function MagnetButton({ juegoId }: Props) {
  const [open, setOpen] = useState(false)
  const [magnet, setMagnet] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = async () => {
    setOpen(true)
    setError(null)

    if (magnet) {
      return
    }

    try {
      setLoading(true)
      const res = await fetch(
        `/api/magnet?juegoId=${encodeURIComponent(juegoId)}`,
        { method: 'GET' },
      )

      if (!res.ok) {
        throw new Error('No se pudo obtener el enlace magnet.')
      }

      const data = await res.json()
      if (!data.magnet || typeof data.magnet !== 'string') {
        throw new Error('El enlace magnet no es válido.')
      }

      setMagnet(data.magnet)
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar el enlace magnet.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!magnet) return
    try {
      await navigator.clipboard.writeText(magnet)
    } catch {
      // el usuario siempre puede copiar manualmente
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="
          inline-flex items-center rounded-full border border-zinc-300 bg-zinc-50
          px-3 py-1.5 text-xs font-medium
          text-zinc-900 transition-colors
          hover:bg-zinc-200 dark:border-zinc-700
          dark:bg-zinc-900 dark:text-zinc-100
          dark:hover:bg-zinc-800
        "
      >
        MAGNET
      </button>

      {open && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/60
          "
          onClick={() => setOpen(false)}
        >
          <div
            className="
              w-full max-w-xl rounded-2xl border border-zinc-800
              bg-zinc-900/95 p-6 shadow-lg shadow-black/40
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-50">
                Enlace MAGNET
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cerrar
              </button>
            </div>

            {loading && (
              <p className="text-xs text-zinc-400">Cargando enlace magnet...</p>
            )}

            {!loading && error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            {!loading && !error && magnet && (
              <>
                <label className="mb-2 block text-[0.7rem] font-medium text-zinc-400">
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

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="
                      inline-flex items-center rounded-full border border-zinc-600 bg-zinc-800
                      px-3 py-1.5 text-xs
                      font-medium text-zinc-50
                      transition-colors
                      hover:bg-zinc-700
                    "
                  >
                    Copiar
                  </button>
                </div>

                <p className="mt-2 text-[0.65rem] text-zinc-500">
                  El enlace está ofuscado en la página original y solo se
                  obtiene al pulsar este botón.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
