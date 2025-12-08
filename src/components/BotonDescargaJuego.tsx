// src/components/BotonDescargaJuego.tsx
'use client'

type Props = {
  juegoId: string
  origen: string // 'supabase_main' | 'supabase_alt' | ...
  href: string
  children: React.ReactNode
}

export default function BotonDescargaJuego({
  juegoId,
  origen,
  href,
  children,
}: Props) {
  const handleClick = () => {
    if (!juegoId) return

    fetch('/api/interaccion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        juegoId,
        tipo: 'descarga',
        origen,
      }),
    }).catch((err) => {
      console.error('[BotonDescargaJuego] Error al registrar descarga', err)
    })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="
        inline-flex items-center gap-1.5
        rounded-md border border-zinc-700 bg-zinc-900 px-4
        py-2 text-sm
        font-medium text-zinc-50
        transition-colors hover:bg-zinc-800
        dark:border-zinc-300 dark:bg-zinc-100 dark:text-zinc-900
        dark:hover:bg-zinc-200
      "
    >
      {children}
    </a>
  )
}
