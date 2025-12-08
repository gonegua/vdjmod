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
    <nav className="bg-gray-900 p-4 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        {/* LOGO + BADGE */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">
            <Link href="/" className="logo-mark inline-flex items-center gap-1">
              <span>AA 🎮</span>
            </Link>
          </h1>

          {/* 🎄 Badge “Season” mejor integrado */}
          <span className="season-badge inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-md backdrop-blur">
            <span className="inline-block text-sm">🕯️</span>
          </span>
        </div>

        {/* LINKS */}
        <ul className="flex space-x-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:underline ${
                  pathname === link.href ? 'font-semibold text-primary' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* TEMA + USER MENU (SIN BOTÓN "INICIAR SESIÓN") */}
        <div className="flex items-center gap-3">
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
