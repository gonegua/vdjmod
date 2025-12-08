'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function Buscador() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [open, setOpen] = useState(false)

  const formRef = useRef<HTMLFormElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Autofocus cuando se abre el buscador
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  // 🔥 Cerrar buscador si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const current = new URLSearchParams(searchParams.toString())

    if (query.trim()) current.set('q', query.trim())
    else current.delete('q')

    router.push(`/?${current.toString()}`)
  }

  const toggleOpen = () => {
    setOpen((prev) => !prev)
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSearch}
      className="relative flex items-center gap-2"
    >
      {/* Botón de lupa */}
      <button
        type="button"
        onClick={toggleOpen}
        className="rounded-full border border-gray-500/60 bg-gray-800 p-2 transition-colors hover:bg-gray-700"
        aria-label={open ? 'Cerrar buscador' : 'Abrir buscador'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
          />
        </svg>
      </button>

      {/* Input desplegable */}
      {open && (
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar juegos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            w-40 rounded border border-gray-500/60
            bg-gray-900 px-2 py-1
            text-sm text-gray-100 focus:outline-none
            focus:ring-1 focus:ring-blue-500 sm:w-64
          "
        />
      )}
    </form>
  )
}
