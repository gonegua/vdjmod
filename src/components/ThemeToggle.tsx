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
      className="inline-flex items-center justify-center rounded-md border border-border bg-background px-2 py-2 transition-colors hover:bg-muted"
      aria-label="Cambiar tema"
    >
      {isLight ? (
        // Modo claro → sol con color ámbar
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        // Modo oscuro → luna con azul cielo
        <Moon className="h-5 w-5 text-sky-300" />
      )}
    </button>
  )
}
