// app/categorias/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Etiqueta = {
  id: number
  nombre: string
  slug: string
}

// Mapeo de etiquetas "especiales" -> nombre a mostrar
// Claves en minúsculas para que coincidan con nombre/slug normalizados
const FEATURED_LABELS: Record<string, string> = {
  action: '💥 Acción',
  adventure: '🗺️ Aventura',
  automation: '🤖 Automatización',
  'base-building': '🏠 Construcción de base',
  'colony-sim': '🏙️ Simulador de Colonia',
  crafting: '🔧 Frabricación de recursos',
  'creature-collector': '🦎 Criador de criaturas',
  driving: '🏎️ Carreras',
  fighting: '🥊 Lucha',
  horror: '😱 Horror',
  indie: '🌱 Indie',
  'local-multiplayer': '🕹️🎮 Pantalla dividida',
  'open-world': '🌍 Mundo Abierto',
  rpg: '🎲 RPG',
  rts: '🌐 RTS',
  shooter: '🔫 Disparos',
  sports: '⚽ Deporte',
  strategy: '💡 Estrategia',
  'tower-defense': '🏰 Defensa de torre',
  survival: '🌲 Supervivencia',
  'recursos-bajos': '🟢 Recursos Bajos',
  'rescursos-medios-bajos': '🟡 Recursos Medio-Bajos',
  'recursos-medios-altos': '🟠 Recursos Medio-Altos',
  'recursos-altos-ultra': '🔴 Recursos Altos-Ultra',
  p2p: '♻️ P2P',
}

function limpiarNombre(raw: string) {
  const sinHash = raw.startsWith('#') ? raw.slice(1) : raw
  return sinHash.trim()
}

// 🔧 AQUÍ el ajuste: normalizamos TODO al formato con guiones
function normalizarClaveDesdeEtiqueta(tag: Etiqueta) {
  // nombre: "Base Building" -> "base-building"
  const nombreNorm = limpiarNombre(tag.nombre)
    .toLowerCase()
    .replace(/\s+/g, '-')

  // slug: lo usamos tal cual (en minúsculas), con guiones
  // "base-building", "open-world", "recursos-medios-altos", etc.
  const slugNorm = (tag.slug || '').toLowerCase()

  return { nombreNorm, slugNorm }
}

function esDestacada(tag: Etiqueta) {
  const { nombreNorm, slugNorm } = normalizarClaveDesdeEtiqueta(tag)
  const claves = Object.keys(FEATURED_LABELS)
  return claves.some((k) => k === nombreNorm || k === slugNorm)
}

function getNombreMostrado(tag: Etiqueta) {
  const { nombreNorm, slugNorm } = normalizarClaveDesdeEtiqueta(tag)
  const claves = Object.keys(FEATURED_LABELS)

  const claveEncontrada = claves.find((k) => k === nombreNorm || k === slugNorm)

  if (claveEncontrada) {
    return FEATURED_LABELS[claveEncontrada]
  }

  // Si no es destacada, se muestra el nombre limpio tal como está
  return limpiarNombre(tag.nombre)
}

function normalizarLabelParaOrden(tag: Etiqueta) {
  // Texto que realmente ve el usuario (con emoji)
  const mostrado = getNombreMostrado(tag)
  // Quitar emojis/símbolos iniciales y espacios
  return mostrado.replace(/^[^\p{L}\p{N}]+/u, '').trim()
}

export default async function CategoriasPage({
  searchParams,
}: {
  searchParams?: { verTodas?: string }
}) {
  const { data, error } = await supabase
    .from('etiquetas')
    .select('id, nombre, slug')
    .order('nombre', { ascending: true })

  if (error) {
    console.error('Error al cargar categorías:', error)
    return <div className="p-4">Error cargando las categorías 😢</div>
  }

  const etiquetas: Etiqueta[] = data ?? []

  if (etiquetas.length === 0) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-center text-2xl font-bold">🧩 Destacadas</h1>
        <p>Todavía no hay etiquetas creadas.</p>
      </div>
    )
  }

  const mostrarTodas = searchParams?.verTodas === '1'

  const etiquetasDestacadas = etiquetas.filter(esDestacada).sort((a, b) =>
    normalizarLabelParaOrden(a).localeCompare(
      normalizarLabelParaOrden(b),
      'es', // orden alfabético en español
      { sensitivity: 'base' },
    ),
  )

  // Otras etiquetas = todas menos las destacadas
  const idsDestacadas = new Set(etiquetasDestacadas.map((t) => t.id))
  const otrasEtiquetas = etiquetas
    .filter((t) => !idsDestacadas.has(t.id))
    .sort((a, b) =>
      normalizarLabelParaOrden(a).localeCompare(
        normalizarLabelParaOrden(b),
        'es',
        { sensitivity: 'base' },
      ),
    )

  return (
    <div className="space-y-10 p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">🧩 Destacadas</h1>
      <p className="mb-4 text-sm text-muted-foreground"></p>

      {/* BLOQUE DE ETIQUETAS DESTACADAS */}
      {etiquetasDestacadas.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold"></h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {etiquetasDestacadas.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`} className="group">
                <div
                  className="
                    flex h-24 items-center justify-center rounded-2xl
                    border border-border
                    bg-card px-4 text-center text-card-foreground shadow-md
                    transition-all duration-150 hover:bg-accent
                    hover:text-accent-foreground hover:shadow-xl
                  "
                >
                  <span className="truncate text-base font-semibold tracking-tight md:text-lg">
                    {getNombreMostrado(tag)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* BLOQUE DE OTRAS ETIQUETAS */}
      <section className="border-t border-border/60 pt-4">
        {!mostrarTodas ? (
          // Estado inicial: otras etiquetas ocultas, solo botón al final
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground"></p>
            <Link
              href="/categorias?verTodas=1"
              className="
                inline-flex items-center gap-2 rounded-full border border-border
                bg-background px-4 py-2 text-sm
                font-medium shadow-sm transition-all
                hover:bg-accent hover:text-accent-foreground hover:shadow
              "
            >
              Todas las categorías
            </Link>
          </div>
        ) : (
          // Cuando se pulsa "Mostrar todas": se ve el grid normal de todas las demás
          <>
            {/* TÍTULO CLICABLE PARA VOLVER A OCULTAR */}
            <h2 className="mb-3 text-center text-xl font-semibold">
              <Link
                href="/categorias"
                className="cursor-pointer hover:underline"
                title="Ocultar etiquetas adicionales"
              >
                Todas las categorías
              </Link>
            </h2>

            {otrasEtiquetas.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay más etiquetas aparte de las principales.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {otrasEtiquetas.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="group"
                  >
                    <div
                      className="
                        flex aspect-video items-center justify-center rounded-xl
                        border border-border bg-card p-3 text-center text-card-foreground
                        shadow transition-shadow hover:bg-accent
                        hover:text-accent-foreground hover:shadow-lg
                      "
                    >
                      <span className="truncate text-sm font-medium">
                        {getNombreMostrado(tag)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Link
                href="/categorias"
                className="text-xs text-muted-foreground underline hover:text-foreground"
              >
                Ocultar etiquetas adicionales
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
