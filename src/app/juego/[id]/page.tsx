// src/app/juego/[id]/page.tsx

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getJuegoDetalleGlobal } from '@/lib/db/multiSource'
import TrackVisita from '@/components/TrackVisita'
import BotonDescargaJuego from '@/components/BotonDescargaJuego'
import MagnetButton from '@/components/MagnetButton'
import CommentSection from '@/components/CommentSection'

export default async function JuegoDetalle({
  params,
}: {
  params: { id: string }
}) {
  const { juego, comentarios } = await getJuegoDetalleGlobal(params.id)

  if (!juego) {
    return notFound()
  }

  // ORIGEN de la fuente (supabase_main | supabase_alt) inyectado por multiSource
  const origen = (juego as any).origen ?? 'supabase_main'

  const etiquetas = juego.etiquetas ?? []

  const LIMITE = 5
  const totalEtiquetas = etiquetas.length
  const etiquetasVisibles = etiquetas.slice(0, LIMITE)
  const etiquetasRestantes = etiquetas.slice(LIMITE)

  const nombreEtiqueta = (nombre: string | null | undefined) =>
    typeof nombre === 'string' ? nombre.replace(/^#/, '') : (nombre ?? '')

  // 🔍 DEBUG: ver qué llega desde multiSource para este juego
  console.log('DEBUG juego links/enlace_descarga', {
    id: juego.id,
    titulo: juego.titulo,
    enlace_descarga: (juego as any).enlace_descarga,
    linksByHoster: (juego as any).linksByHoster,
  })

  return (
    <div className="mx-auto max-w-3xl p-4 text-base text-zinc-900 dark:text-zinc-100">
      {/* Registrar visita a la página del juego */}
      <TrackVisita juegoId={juego.id} origen={origen} />

      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight">
        {juego.titulo}
      </h1>

      {/* =========================== */}
      {/*     BLOQUE DE ETIQUETAS     */}
      {/* =========================== */}

      {totalEtiquetas > 0 && (
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          {/* Checkbox controlador (peer) */}
          <input
            type="checkbox"
            id={`toggle-etiquetas-${juego.id}`}
            className="peer hidden"
          />

          {/* Etiquetas visibles (primeras 5) */}
          {etiquetasVisibles.map((tag: any) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="
                rounded-full border border-zinc-300 bg-zinc-200
                px-2 py-1
                text-xs text-zinc-900
                transition-colors hover:bg-zinc-300 dark:border-zinc-700
                dark:bg-zinc-800 dark:text-zinc-100
                dark:hover:bg-zinc-700
              "
            >
              {nombreEtiqueta(tag.nombre)}
            </Link>
          ))}

          {/* Botón +N (justo después de las visibles cuando está colapsado) */}
          {etiquetasRestantes.length > 0 && (
            <label
              htmlFor={`toggle-etiquetas-${juego.id}`}
              className="
                cursor-pointer select-none rounded-full border border-zinc-300 bg-zinc-200
                px-2 py-1
                text-xs text-zinc-900
                transition-colors hover:bg-zinc-300 peer-checked:hidden
                dark:border-zinc-700 dark:bg-zinc-800
                dark:text-zinc-100
                dark:hover:bg-zinc-700
              "
            >
              +{etiquetasRestantes.length}
            </label>
          )}

          {/* Etiquetas restantes (aparecen al desplegar, justo después de las visibles) */}
          {etiquetasRestantes.map((tag: any) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="
                hidden rounded-full
                border border-zinc-300 bg-zinc-200 px-2
                py-1 text-xs
                text-zinc-900 transition-colors
                hover:bg-zinc-300 peer-checked:inline-flex dark:border-zinc-700
                dark:bg-zinc-800 dark:text-zinc-100
                dark:hover:bg-zinc-700
              "
            >
              {nombreEtiqueta(tag.nombre)}
            </Link>
          ))}

          {/* Botón – (aparece al desplegar y se va al final gracias a order-last) */}
          {etiquetasRestantes.length > 0 && (
            <label
              htmlFor={`toggle-etiquetas-${juego.id}`}
              className="
                hidden cursor-pointer select-none
                rounded-full border border-zinc-300 bg-zinc-200 px-2 py-1
                text-xs text-zinc-900
                transition-colors hover:bg-zinc-300
                peer-checked:order-last peer-checked:inline-flex dark:border-zinc-700
                dark:bg-zinc-800 dark:text-zinc-100
                dark:hover:bg-zinc-700
              "
            >
              –
            </label>
          )}
        </div>
      )}

      {/* =========================== */}
      {/*     IMAGEN PRINCIPAL        */}
      {/* =========================== */}

      <div className="mb-4">
        <Image
          src={juego.imagen}
          alt={juego.titulo}
          width={800}
          height={400}
          className="mb-10 rounded-lg border border-zinc-300 dark:border-zinc-800"
        />
      </div>

      {/* =========================== */}
      {/*       WIDGET DE STEAM       */}
      {/* (movido antes de requisitos) */}
      {/* =========================== */}

      {(() => {
        const rawValue = juego.steam_widget_iframe
        const raw =
          rawValue === null || rawValue === undefined
            ? ''
            : String(rawValue).trim()

        if (!raw) return null

        // Caso 1: el campo ya viene con un iframe completo
        if (raw.includes('<iframe')) {
          return (
            <div
              className="
                my-6 overflow-hidden rounded-lg
                border border-zinc-300 bg-zinc-50
                dark:border-zinc-800 dark:bg-zinc-900
              "
            >
              <div
                className="w-full"
                dangerouslySetInnerHTML={{ __html: raw }}
              />
            </div>
          )
        }

        // Caso 2: solo el AppID numérico, ej: "2356560"
        let src: string
        if (/^\d+$/.test(raw)) {
          src = `https://store.steampowered.com/widget/${raw}/`
        } else {
          // Caso 3: asumimos que es ya una URL completa al widget
          src = raw
        }

        return (
          <div
            className="
              my-6 overflow-hidden rounded-lg
              border border-zinc-300 bg-zinc-50
              dark:border-zinc-800 dark:bg-zinc-900
            "
          >
            <iframe
              src={src}
              className="w-full"
              height={190}
              title={`Steam widget de ${juego.titulo}`}
              loading="lazy"
            />
          </div>
        )
      })()}

      {/* ========================================= */}
      {/*   PARSEAR STRING DE SUPABASE A TABLAS     */}
      {/* ========================================= */}

      {(() => {
        const texto: string = (juego.descripcion as string) || ''

        // NOTAS (si sigues usando "NOTAS:" al final del texto)
        const notasMatch = texto.match(/NOTAS:([\s\S]*)/i)
        const notas = notasMatch?.[1]
          ?.split('•')
          .map((l) => l.trim())
          .filter(Boolean)

        // Dividir descripción por líneas, limpiar y quitar vacías
        const lineas = texto
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)

        type ReqItem = { key: string; value: string }

        const minimos: ReqItem[] = []
        const recomendados: ReqItem[] = []

        // Buscar índice de las "cabeceras" 1: y 2:
        const idx1 = lineas.findIndex((l) => l.replace(/\s+/g, '') === '1:')
        const idx2 = lineas.findIndex((l) => l.replace(/\s+/g, '') === '2:')

        const parseBullets = (rawLines: string[]): ReqItem[] =>
          rawLines
            .filter((l) => l.startsWith('•'))
            .map((l) => {
              const sinBullet = l.replace(/^•\s*/, '')
              const [key, ...rest] = sinBullet.split(':')
              return {
                key: key.trim(),
                value: rest.join(':').trim(),
              }
            })
            .filter((item) => item.key.length > 0)

        // Mínimos: entre 1: y 2: (o fin)
        if (idx1 !== -1) {
          const start = idx1 + 1
          const end = idx2 !== -1 ? idx2 : lineas.length
          minimos.push(...parseBullets(lineas.slice(start, end)))
        }

        // Recomendados: desde 2: hasta el final
        if (idx2 !== -1) {
          const start = idx2 + 1
          recomendados.push(...parseBullets(lineas.slice(start)))
        }

        const tieneEstructura =
          minimos.length > 0 ||
          recomendados.length > 0 ||
          (notas && notas.length > 0)

        // Si no hay ninguna línea útil, mostrar la descripción tal cual
        if (!tieneEstructura) {
          return (
            <p className="mb-4 whitespace-pre-line leading-relaxed">{texto}</p>
          )
        }

        return (
          <div className="mb-6 space-y-4">
            {/* TABLA REQUISITOS */}
            {(minimos.length || recomendados.length) > 0 && (
              <div>
                <h2 className="mb-2 text-center font-[Inter] text-xl font-semibold tracking-tight">
                  Requisitos del sistema
                </h2>

                <div className="overflow-x-auto rounded-lg border border-zinc-300 bg-zinc-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/90">
                  <div className="text-[0.7rem] md:text-[0.75rem]">
                    <table className="w-full">
                      <thead className="bg-zinc-200/80 text-left text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                        <tr>
                          <th className="border-r border-zinc-300 p-2.5 dark:border-zinc-700 md:p-3">
                            Mínimos
                          </th>
                          <th className="p-2.5 md:p-3">Recomendados</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(
                          {
                            length: Math.max(
                              minimos.length,
                              recomendados.length,
                            ),
                          },
                          (_, i) => (
                            <tr
                              key={i}
                              className="border-t border-zinc-200 dark:border-zinc-800"
                            >
                              <td className="border-r border-zinc-200 p-2.5 align-top dark:border-zinc-800 md:p-3">
                                {minimos[i] ? (
                                  <div className="space-y-0.5">
                                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                      {minimos[i].key}:
                                    </span>{' '}
                                    <span className="text-zinc-700 dark:text-zinc-300">
                                      {minimos[i].value}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-zinc-400 dark:text-zinc-600">
                                    –
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 align-top md:p-3">
                                {recomendados[i] ? (
                                  <div className="space-y-0.5">
                                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                      {recomendados[i].key}:
                                    </span>{' '}
                                    <span className="text-zinc-700 dark:text-zinc-300">
                                      {recomendados[i].value}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-zinc-400 dark:text-zinc-600">
                                    –
                                  </span>
                                )}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* NOTAS (si existen) */}
            {notas && notas.length > 0 && (
              <div
                className="
                  rounded-lg border border-zinc-300
                  bg-zinc-50/90 px-4 py-3
                  shadow-sm dark:border-zinc-700
                  dark:bg-zinc-900/90
                "
              >
                <h3 className="mb-2 text-lg font-semibold">Notas</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-800 dark:text-zinc-200">
                  {notas.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      })()}

      {/* =========================== */}
      {/*   EXTRA: CATEGORÍA / VIDEO  */}
      {/* =========================== */}

      {juego.categoria && (
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Categoría: {juego.categoria}
        </p>
      )}

      {juego.video && (
        <div className="my-6 aspect-video overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-800">
          <iframe
            src={juego.video}
            className="w-full"
            title={`Video de {juego.titulo}`}
            allowFullScreen
          />
        </div>
      )}

      {/* =========================== */}
      {/*   LINKS POR HOSTER (NUEVO)  */}
      {/* =========================== */}

      {(() => {
        const linksByHoster: Record<string, string> | undefined = (juego as any)
          .linksByHoster

        const LINK_HOSTERS_ORDER = [
          'paste', // link agrupado
          '1fichier',
          'pixeldrain',
          'gofile',
          'magnet',
          'vikingfile',
          'turbobit',
          'mega',
          'mediafire',
          'ranoz',
          'hitfile',
        ] as const

        const tieneLinks =
          linksByHoster &&
          Object.values(linksByHoster).some(
            (url) => typeof url === 'string' && url.trim().length > 0,
          )

        if (!tieneLinks) return null

        return (
          <div className="my-6">
            <h2 className="mb-3 text-center font-[Inter] text-xl font-semibold tracking-tight">
              Fuente externa
            </h2>

            <div className="flex flex-wrap justify-center gap-2">
              {LINK_HOSTERS_ORDER.map((hoster) => {
                const hasLink =
                  !!linksByHoster &&
                  typeof linksByHoster[hoster] === 'string' &&
                  linksByHoster[hoster]!.trim().length > 0

                if (!hasLink) return null

                // MAGNET: botón con modal, no usa /go-host
                if (hoster === 'magnet') {
                  return (
                    <MagnetButton key={hoster} juegoId={String(juego.id)} />
                  )
                }

                // Otros hosters (incluido "paste"): siguen usando /go-host
                const internalUrl = `/go-host/${encodeURIComponent(
                  String(juego.id),
                )}?h=${encodeURIComponent(hoster)}`

                return (
                  <a
                    key={hoster}
                    href={internalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center rounded-full border border-zinc-300 bg-zinc-50
                      px-3 py-1.5 text-xs font-medium
                      text-zinc-900 transition-colors
                      hover:bg-zinc-200 dark:border-zinc-700
                      dark:bg-zinc-900 dark:text-zinc-100
                      dark:hover:bg-zinc-800
                    "
                  >
                    {hoster === 'paste' ? 'Enlaces' : hoster.toUpperCase()}
                  </a>
                )
              })}
            </div>
          </div>
        )
      })()}

      {juego.enlace_descarga && (
        <BotonDescargaJuego
          juegoId={juego.id}
          origen={origen}
          href={`/go/${juego.id}`}
        >
          Descargar juego
        </BotonDescargaJuego>
      )}

      {/* Comentarios */}
      {/* <CommentSection juegoId={juego.id} /> */}
    </div>
  )
}
