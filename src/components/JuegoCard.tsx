// src/components/JuegoCard.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Juego } from '@/types/juego'

// Fechas de temporada: diciembre completo + 1 al 6 de enero
function isChristmasSeason() {
  const now = new Date()
  const month = now.getMonth() // 0 = enero, 11 = diciembre
  const day = now.getDate()
  return month === 11 || (month === 0 && day <= 6)
}

export default function JuegoCard({
  juego,
  variant = 'list', // "list" = inicio, "detail" = página del juego
}: {
  juego: Juego
  variant?: 'list' | 'detail'
}) {
  const [mostrarTodas, setMostrarTodas] = useState(false)

  const etiquetasOriginales = juego.etiquetas || []

  // Limpiar solo lo visual (el backend mantiene #)
  const etiquetas = etiquetasOriginales.map((tag) => ({
    ...tag,
    nombre: tag.nombre.replace(/^#/, ''),
  }))

  // --- LÓGICA P2P ---
  const LIMITE_BASE = 5

  const esP2P = (tagNombre: string, slug?: string | null) => {
    const n = tagNombre.toLowerCase()
    const s = (slug || '').toLowerCase()
    return n === 'p2p' || s === 'p2p'
  }

  const tieneP2P = etiquetas.some((tag) => esP2P(tag.nombre, (tag as any).slug))

  const limiteMax = tieneP2P ? LIMITE_BASE + 1 : LIMITE_BASE
  const total = etiquetas.length

  const mostrandoTodas = variant === 'detail' && mostrarTodas

  const limiteActual = mostrandoTodas ? total : Math.min(limiteMax, total)

  const sobrantes = mostrandoTodas ? 0 : Math.max(0, total - limiteActual)

  let visibles = mostrandoTodas ? etiquetas : etiquetas.slice(0, limiteActual)

  if (!mostrandoTodas && tieneP2P) {
    const tagP2P = etiquetas.find((tag) => esP2P(tag.nombre, (tag as any).slug))
    if (tagP2P) {
      const yaIncluida = visibles.some((tag) => tag.id === tagP2P.id)
      if (!yaIncluida) {
        const sinUltima = visibles.slice(0, Math.max(0, limiteActual - 1))
        visibles = [...sinUltima, tagP2P]
      }
    }
  }

  const navidad = isChristmasSeason()

  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-card text-card-foreground 
      transition-colors transition-shadow hover:bg-background/70 hover:shadow-xl ${
        navidad ? 'gamecard-season' : 'gamecard-normal'
      }`}
    >
      {/* Enlace principal */}
      <Link href={`/juego/${juego.id}`} className="block">
        <img
          src={juego.imagen}
          alt={juego.titulo}
          className="h-48 w-full object-cover"
        />
        <div className="p-4">
          <h2 className="mb-1 text-center text-xl font-semibold">
            {juego.titulo}
          </h2>
        </div>
      </Link>

      {/* Etiquetas */}
      {total > 0 && (
        <div className="flex flex-wrap justify-center gap-2 px-4 pb-4">
          {visibles.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${(tag as any).slug}`}
              className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {tag.nombre}
            </Link>
          ))}

          {sobrantes > 0 && (
            <button
              type="button"
              className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                if (variant === 'detail') {
                  setMostrarTodas(true)
                }
              }}
            >
              ...
            </button>
          )}
        </div>
      )}
    </div>
  )
}
