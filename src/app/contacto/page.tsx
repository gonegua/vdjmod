// src/app/contacto/page.tsx

'use client'
import { useState } from 'react'

export default function ContactoPage() {
  const correo = 'aahspvdj@vk.com' // <-- cámbialo por el tuyo
  const [copiado, setCopiado] = useState(false)

  async function copiarCorreo() {
    try {
      await navigator.clipboard.writeText(correo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch (err) {
      console.error('Error copiando correo:', err)
    }
  }

  return (
    <div className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-center text-2xl font-semibold">Contacto</h1>

      <p className="mb-4 text-center text-sm text-zinc-700 dark:text-zinc-300">
        Si quieres enviar un comentario, sugerencia o reporte, hazlo al
        siguiente correo:
      </p>

      <div className="mb-6 flex justify-center">
        <button
          onClick={copiarCorreo}
          className="
            inline-flex items-center justify-center
            rounded-md border border-zinc-300
            bg-zinc-50 px-4 py-2
            text-sm font-medium
            text-zinc-900 transition-colors
            hover:bg-zinc-200 dark:border-zinc-700
            dark:bg-zinc-900 dark:text-zinc-100
            dark:hover:bg-zinc-800
          "
        >
          {correo}
        </button>
      </div>

      {copiado && (
        <p className="mb-4 text-center text-sm text-green-600">
          ¡Correo copiado!
        </p>
      )}

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-500"></p>
    </div>
  )
}
