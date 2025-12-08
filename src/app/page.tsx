// src/app/page.tsx

import Link from 'next/link'
import JuegoCard from '@/components/JuegoCard'
import Buscador from '@/components/Buscador'
import type { Juego } from '@/types/juego'
import { getJuegosGlobal } from '@/lib/db/multiSource'

const JUEGOS_POR_PAGINA = 12

type SearchParams = {
  page?: string
  q?: string
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { page: pageParam = '1', q: query = '' } = await searchParams
  const page = Number.parseInt(pageParam, 10) || 1

  const { juegos, totalPages } = await getJuegosGlobal({
    page,
    perPage: JUEGOS_POR_PAGINA,
    search: query || undefined,
  })

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Juegos recientes</h1>
        <Buscador />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {juegos.length > 0 ? (
          juegos.map((juego: Juego) => (
            <JuegoCard key={juego.id} juego={juego} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No se encontraron juegos.
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => {
          const pagina = i + 1
          const isActive = pagina === page

          const href = `/?page=${pagina}${
            query ? `&q=${encodeURIComponent(query)}` : ''
          }`

          return (
            <Link
              key={pagina}
              href={href}
              className={`rounded border px-3 py-1 text-sm ${
                isActive
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {pagina}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
