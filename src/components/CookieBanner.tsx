'use client'

import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hasAccepted = document.cookie
      .split('; ')
      .find((row) => row.startsWith('cookies-accepted='))

    if (!hasAccepted) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    document.cookie = `cookies-accepted=true; path=/; max-age=31536000; SameSite=Lax`
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6 duration-300 animate-in fade-in slide-in-from-bottom">
      <div className="w-full max-w-3xl rounded-xl border border-border bg-gradient-to-br from-background/95 to-background/80 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Icono + mensaje */}
          <div className="flex items-start gap-3">
            <Info className="mt-1 h-6 w-6 text-primary" />

            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">
                Preferencias de Cookies
              </p>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Este sitio utiliza cookies esenciales (modo claro/oscuro) para
                mejorar la experiencia.
              </p>
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={handleAccept}
            className="hover:bg-primary/85 whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
