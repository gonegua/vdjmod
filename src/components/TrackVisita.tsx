// src/components/TrackVisita.tsx
'use client'

import { useEffect } from 'react'

type Props = {
  juegoId: string
  origen: string // 'supabase_main' | 'supabase_alt' | ...
}

export default function TrackVisita({ juegoId, origen }: Props) {
  useEffect(() => {
    if (!juegoId) return

    fetch('/api/interaccion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        juegoId,
        tipo: 'visita',
        origen,
      }),
    }).catch((err) => {
      console.error('[TrackVisita] Error al registrar visita', err)
    })
  }, [juegoId, origen])

  return null
}
