// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/authContext'
import UserMenu from './UserMenu'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/categorias', label: 'Categorías' },
  //  { href: '/favoritos', label: 'Favoritos' },  ---> Línea oculta hasta desarrollar más el proyecto total
]

export default function Navbar() {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  if (loading) return null

  return (
    <nav className="bg-gray-900 text-white">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* IZQUIERDA: LOGO + LUCES */}
        <div className="flex shrink-0 items-center gap-1">
          <h1 className="text-xl font-bold">
            <Link href="/" className="logo-mark inline-flex items-center gap-1">
              <span>AA 🎮</span>
            </Link>
          </h1>

          {/* Badge con luces pegado al logo */}
          <span className="season-badge inline-flex items-center rounded-full bg-gray-800/80 px-1.5 py-0.5 shadow-md backdrop-blur">
            <span className="xmas-lights flex items-center gap-0.5">
              <span className="xmas-light green" />
              <span className="xmas-light red" />
              <span className="xmas-light yellow" />
              <span className="xmas-light blue" />
            </span>
          </span>
        </div>

        {/* CENTRO: LINKS SIEMPRE CENTRADOS EN LA PÁGINA */}
        <ul className="absolute left-1/2 flex -translate-x-[50%] space-x-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`
                  rounded px-2 py-1
                  ${
                    pathname === link.href
                      ? 'border-b-2 border-green-500 font-semibold text-green-400'
                      : 'hover:underline'
                  }
                `}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* DERECHA: TEMA + USER MENU */}
        <div className="flex shrink-0 items-center gap-3">
          <ThemeToggle />

          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              {/* 
              <Link
                href="/login"
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80"
              >
                Iniciar sesión
              </Link>
              */}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
