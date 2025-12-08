import { supabase } from '@/lib/supabase'
import JuegoCard from '@/components/JuegoCard'
import Link from 'next/link'
import type { Juego } from '@/types/juego'

const JUEGOS_POR_PAGINA = 12

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { page?: string }
}) {
  const page = parseInt(searchParams?.page || '1', 10)
  const desde = (page - 1) * JUEGOS_POR_PAGINA
  const hasta = desde + JUEGOS_POR_PAGINA - 1

  const { data: etiqueta, error: tagError } = await supabase
    .from('etiquetas')
    .select('id, nombre, slug')
    .eq('slug', params.slug)
    .single()

  if (tagError || !etiqueta) {
    return <div className="p-4">Etiqueta no encontrada 😢</div>
  }

  const { data, error, count } = await supabase
    .from('juego_etiquetas')
    .select(
      `
      juego_id,
      juegos (
        id,
        titulo,
        descripcion,
        imagen,
        juego_etiquetas (
          etiquetas (
            id,
            nombre,
            slug
          )
        )
      )
    `,
      { count: 'exact' },
    )
    .eq('etiqueta_id', etiqueta.id)
    .range(desde, hasta)

  if (error) {
    console.error('Error al cargar juegos por etiqueta:', error)
    return (
      <div className="p-4">Error cargando los juegos de esta etiqueta 😢</div>
    )
  }

  const juegos: Juego[] =
    data
      ?.map((jt: any) => {
        const juego = jt.juegos
        if (!juego) return null
        return {
          ...juego,
          etiquetas:
            juego.juego_etiquetas
              ?.map((je: any) => je.etiquetas)
              .filter((t: any) => !!t) ?? [],
        }
      })
      .filter(Boolean) ?? []

  const totalPaginas = Math.ceil((count || 0) / JUEGOS_POR_PAGINA)

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">
        🎮 Juegos con la etiqueta{' '}
        <span className="text-blue-500">#{etiqueta.nombre}</span>
      </h1>

      {juegos.length === 0 ? (
        <p>No hay juegos con esta etiqueta todavía.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {juegos.map((juego) => (
            <JuegoCard key={juego.id} juego={juego} />
          ))}
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <Link
              key={i}
              href={`/tag/${etiqueta.slug}?page=${i + 1}`}
              className={`rounded border px-3 py-1 ${
                i + 1 === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-black'
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
