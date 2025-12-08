// src/lib/storage/juegoLinks.ts

export const HOSTERS = [
  '1fichier',
  'pixeldrain',
  'gofile',
  'paste', // 👈 NUEVO: soporte para archivo _paste.txt
  'magnet',
  'vikingfile',
  'turbobit',
  'mega',
  'mediafire',
  'ranoz',
  'hitfile',
] as const

export type HosterId = (typeof HOSTERS)[number]
export type LinksByHoster = Partial<Record<HosterId, string>>

/**
 * Configuración por origen (multi-cuenta).
 */
const ORIGIN_STORAGE_CONFIG: Record<string, { publicUrlBase?: string }> = {
  supabase_main: {
    publicUrlBase: process.env.NEXT_PUBLIC_SUPABASE_MAIN_STORAGE_PUBLIC_URL,
  },
  supabase_alt: {
    publicUrlBase: process.env.NEXT_PUBLIC_SUPABASE_ALT_STORAGE_PUBLIC_URL,
  },
}

export function gameNameToBase(name: string): string {
  return name
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9.]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function normalizeHoster(hosterRaw: string): HosterId | null {
  const h = hosterRaw.toLowerCase()
  const match = HOSTERS.find((x) => x.toLowerCase() === h)
  return match ?? null
}

/**
 * Lee archivos <base>_<hoster>.txt del bucket <base>_links
 * y devuelve un objeto con cada hoster encontrado.
 */
export async function getLinksForJuego(
  titulo: string,
  origen: string,
): Promise<LinksByHoster> {
  const result: LinksByHoster = {}

  if (!titulo || typeof titulo !== 'string') return result

  const cfg = ORIGIN_STORAGE_CONFIG[origen]
  const publicUrlBase = cfg?.publicUrlBase
  if (!publicUrlBase) return result

  const base = gameNameToBase(titulo)
  if (!base) return result

  const bucketName = `${base}_links`
  const folderName = `${base}_links`

  await Promise.all(
    HOSTERS.map(async (hoster) => {
      const fileName = `${base}_${hoster}.txt`
      const fileUrl = `${publicUrlBase}/${encodeURIComponent(
        bucketName,
      )}/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`

      try {
        const res = await fetch(fileUrl, { cache: 'no-store' })

        if (!res.ok) return

        const text = (await res.text()).trim()
        if (!text) return

        const normalized = normalizeHoster(hoster)
        if (!normalized) return

        result[normalized] = text
      } catch {
        return
      }
    }),
  )

  return result
}

/**
 * Lee archivo <base>_magnet.txt si existe.
 */
export async function getMagnetLinkForJuego(
  titulo: string,
  origen: string,
): Promise<string | null> {
  if (!titulo || typeof titulo !== 'string') return null

  const cfg = ORIGIN_STORAGE_CONFIG[origen]
  const publicUrlBase = cfg?.publicUrlBase
  if (!publicUrlBase) return null

  const base = gameNameToBase(titulo)
  if (!base) return null

  const bucketName = `${base}_links`
  const folderName = `${base}_links`
  const fileName = `${base}_magnet.txt`

  const fileUrl = `${publicUrlBase}/${encodeURIComponent(
    bucketName,
  )}/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`

  try {
    const res = await fetch(fileUrl, { cache: 'no-store' })
    if (!res.ok) return null

    const text = (await res.text()).trim()
    return text || null
  } catch {
    return null
  }
}

/**
 * Lee archivo <base>_requisitos.txt si existe.
 */
export async function getRequisitosForJuego(
  titulo: string,
  origen: string,
): Promise<string | null> {
  if (!titulo || typeof titulo !== 'string') return null

  const cfg = ORIGIN_STORAGE_CONFIG[origen]
  const publicUrlBase = cfg?.publicUrlBase
  if (!publicUrlBase) return null

  const base = gameNameToBase(titulo)
  if (!base) return null

  const bucketName = `${base}_requisitos`
  const folderName = `${base}_requisitos`
  const fileName = `${base}_requisitos.txt`

  const fileUrl = `${publicUrlBase}/${encodeURIComponent(
    bucketName,
  )}/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`

  try {
    const res = await fetch(fileUrl, { cache: 'no-store' })
    if (!res.ok) return null

    const text = (await res.text()).trim()
    return text || null
  } catch {
    return null
  }
}

/* -------------------------------------------------------
   🔧 COMPATIBILIDAD CON multiSource.ts
   multiSource llama a getRequisitosTexto(),
   así que lo restauramos como alias de getRequisitosForJuego.
--------------------------------------------------------- */
export async function getRequisitosTexto(
  titulo: string,
  origen: string,
): Promise<string | null> {
  return getRequisitosForJuego(titulo, origen)
}
