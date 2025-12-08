// src/lib/db/multiSource.ts

import { supabase } from '@/lib/supabase'
import { supabaseAlt } from '@/lib/supabaseAlt'
import type { Juego } from '@/types/juego'
import { getLinksForJuego, getRequisitosTexto } from '@/lib/storage/juegoLinks'

/**
 * Juego enriquecido con información de origen.
 * No es necesario tocar src/types/juego.ts: esto es un tipo interno.
 */
type JuegoConOrigen = Juego & {
  origen: string
}

/**
 * Definimos una fuente Supabase (una cuenta).
 */
type FuenteSupabase = {
  id: string
  tipo: 'supabase'
  cliente: typeof supabase
}

type Fuente = FuenteSupabase

// =========================
//   LISTA DE FUENTES ACTIVAS
// =========================

const FUENTES: Fuente[] = [
  {
    id: 'supabase_main',
    tipo: 'supabase',
    cliente: supabase,
  },
  {
    id: 'supabase_alt',
    tipo: 'supabase',
    cliente: supabaseAlt,
  },
]

// =========================
//   HELPERS POR TIPO DE FUENTE
// =========================

async function getTodosJuegosDesdeSupabase(
  fuente: FuenteSupabase,
  opciones: { search?: string },
): Promise<JuegoConOrigen[]> {
  const { search } = opciones
  const { cliente } = fuente

  let consulta = cliente.from('juegos').select(
    `
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
    `,
  )

  if (search && search.trim() !== '') {
    consulta = consulta.ilike('titulo', `%${search}%`)
  }

  const { data, error } = await consulta

  if (error) {
    console.error(
      `[multiSource][${fuente.id}] error en getTodosJuegosDesdeSupabase:`,
      error,
    )
    throw error
  }

  const filas = data ?? []

  return filas.map((row: any) => {
    const etiquetas =
      row.juego_etiquetas
        ?.map((je: any) => je.etiquetas)
        .filter((t: any) => !!t) ?? []

    const juegoBase: Juego = {
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      imagen: row.imagen,
      etiquetas,
    }

    return {
      ...juegoBase,
      origen: fuente.id,
    }
  })
}

async function getJuegoPorIdDesdeSupabase(
  fuente: FuenteSupabase,
  id: string,
): Promise<JuegoConOrigen | null> {
  const { cliente } = fuente

  const { data, error } = await cliente
    .from('juegos')
    .select(
      `
      id,
      titulo,
      descripcion,
      imagen,
      categoria,
      video,
      enlace_descarga,
      steam_widget_iframe,
      juego_etiquetas (
        etiquetas (
          id,
          nombre,
          slug
        )
      )
    `,
    )
    .eq('id', id)
    .single()

  if (error) {
    if ((error as any).code === 'PGRST116') {
      return null
    }
    console.error(
      `[multiSource][${fuente.id}] error en getJuegoPorIdDesdeSupabase:`,
      error,
    )
    throw error
  }

  if (!data) return null

  const etiquetas =
    data.juego_etiquetas
      ?.map((je: any) => je.etiquetas)
      .filter((t: any) => !!t) ?? []

  const juegoBase: Juego = {
    id: data.id,
    titulo: data.titulo,
    descripcion: data.descripcion,
    imagen: data.imagen,
    categoria: data.categoria ?? undefined,
    video: data.video ?? undefined,
    enlace_descarga: data.enlace_descarga ?? undefined,
    steam_widget_iframe: data.steam_widget_iframe ?? undefined,
    etiquetas,
  }

  return {
    ...juegoBase,
    origen: fuente.id,
  }
}

async function getComentariosDesdeSupabase(
  fuente: FuenteSupabase,
  juegoId: string,
) {
  const { cliente } = fuente

  const { data, error } = await cliente
    .from('comentarios')
    .select('texto, fecha, usuario_id')
    .eq('juego_id', juegoId)
    .order('fecha', { ascending: false })

  if (error) {
    console.error(
      `[multiSource][${fuente.id}] error en getComentariosDesdeSupabase:`,
      error,
    )
    throw error
  }

  return (data ?? []) as {
    texto: string
    fecha: string
    usuario_id: string | null
  }[]
}

// =========================
//   API PÚBLICA PARA LAS PÁGINAS
// =========================

export async function getJuegosGlobal(options: {
  page: number
  perPage: number
  search?: string
}): Promise<{
  juegos: Juego[]
  totalItems: number
  totalPages: number
}> {
  const { page, perPage, search } = options

  const resultados = await Promise.all(
    FUENTES.map((fuente) => {
      if (fuente.tipo === 'supabase') {
        return getTodosJuegosDesdeSupabase(fuente, { search })
      }
      return Promise.resolve([] as JuegoConOrigen[])
    }),
  )

  const todos: JuegoConOrigen[] = resultados.flat()

  todos.sort((a, b) => a.titulo.localeCompare(b.titulo))

  const totalItems = todos.length
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / perPage) : 1

  const start = (page - 1) * perPage
  const end = start + perPage
  const pagina = todos.slice(start, end)

  return {
    juegos: pagina,
    totalItems,
    totalPages,
  }
}

export async function getJuegoDetalleGlobal(id: string): Promise<{
  juego: (JuegoConOrigen & { linksByHoster?: Record<string, string> }) | null
  comentarios: {
    texto: string
    fecha: string
    usuario_id: string | null
  }[]
}> {
  for (const fuente of FUENTES) {
    if (fuente.tipo === 'supabase') {
      const juegoConOrigen = await getJuegoPorIdDesdeSupabase(fuente, id)
      if (juegoConOrigen) {
        const comentarios = await getComentariosDesdeSupabase(fuente, id)

        // Links por hoster (ya lo tenías funcionando)
        const linksByHoster = await getLinksForJuego(
          juegoConOrigen.titulo,
          juegoConOrigen.origen,
        )

        // NUEVO: intentar obtener requisitos desde Storage
        const requisitosTexto = await getRequisitosTexto(
          juegoConOrigen.titulo,
          juegoConOrigen.origen,
        )

        const descripcionFinal =
          requisitosTexto && requisitosTexto.trim().length > 0
            ? requisitosTexto
            : ((juegoConOrigen.descripcion as string | undefined) ?? '')

        return {
          juego: {
            ...juegoConOrigen,
            descripcion: descripcionFinal,
            linksByHoster,
          },
          comentarios,
        }
      }
    }
  }

  return {
    juego: null,
    comentarios: [],
  }
}
