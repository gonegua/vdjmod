'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 1) Efecto para marcar que el componente está montado
  useEffect(() => {
    setMounted(true)
  }, [])

  // 2) Guardar el tema en una cookie cada vez que cambie
  useEffect(() => {
    if (!resolvedTheme) return

    // 1 año de duración (31536000 segundos)
    document.cookie = `theme=${resolvedTheme}; path=/; max-age=31536000; SameSite=Lax`
  }, [resolvedTheme])

  // Después de declarar todos los hooks ya podemos condicionar el render
  if (!mounted) return null

  const isLight = resolvedTheme === 'light'

  const handleClick = () => {
    setTheme(isLight ? 'dark' : 'light')
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Cambiar tema"
      className="
        inline-flex h-9 w-9 items-center justify-center
        rounded-lg border border-white/10
        bg-black/40 text-white
        shadow-md backdrop-blur-sm
        transition
        hover:brightness-125
      "
    >
      {isLight ? (
        // Modo claro → sol amarillo con brillo
        <Sun
          className="
            h-5 w-5
            text-yellow-300
            drop-shadow-[0_0_6px_rgba(250,204,21,0.9)] filter
          "
        />
      ) : (
        // Modo oscuro → luna blanca con brillo
        <Moon
          className="
            h-5 w-5
            text-slate-50
            drop-shadow-[0_0_6px_rgba(248,250,252,0.9)] filter
          "
        />
      )}
    </button>
  )
}
